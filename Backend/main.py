from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import models
from database import engine, SessionLocal
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import os
from typing import Optional
import shutil
import uuid
from fastapi import File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


load_dotenv()

#barcodeLookupApiKey = os.getenv("BARCODELOOKUPAPIKEY")

class UpdateCountRequest(BaseModel):
    inventory_id:int
    item_id:int
    quantityDelta:int

class AddItemToInv(BaseModel):
    inventory_id : int
    item_id : int
    quantity : int
    low_stock_trigger: int
    
class AddUserToInv(BaseModel):
    invId : int
    username : str
    
class InventoryResponse(BaseModel):
    invId: int
    invName: str


class ItemResponse(BaseModel):
    item_id : int
    item_name: str
    desc: str
    upc: str
    photo_url: str
    price: float
    category: str
    brand: str
    quantity: int
    low_stock_trigger: int
    
class UserCreate(BaseModel):
    username: str
    password: str
    wants_notif: bool = True # Defaults to True if the mobile app doesn't send it


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# --- SIMPLIFIED SECURITY CONSTANTS ---
SECRET_KEY = "openinventory-super-secret-key" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200 # Set to 5 hours so you don't get logged out while testing

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTHENTICATION ROUTES ---

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


@app.post("/items/create", status_code=status.HTTP_201_CREATED)
def create_global_item(
    upc: str = Form(...),
    item_name: str = Form(...),
    desc: str = Form(""),
    category: str = Form("Unknown"),
    price: float = Form(0.0),
    brand: str = Form("Unknown"),
    file: UploadFile = File(None), # The new image file upload!
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # 1. Check if the barcode already exists
    existing_item = db.query(models.Item).filter(models.Item.upc == upc).first()
    
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An item with this barcode already exists in the database."
        )

    # 2. Handle the Image Saving
    photo_path = ""
    if file:
        # Generate a unique random string for the filename so we never overwrite existing images
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_location = f"static/images/{unique_filename}"

        # Write the file directly to the VPS hard drive
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        # This is the path we save to the database
        photo_path = f"/static/images/{unique_filename}"

    # 3. Map to SQLAlchemy and save to Postgres
    new_item = models.Item(
        upc=upc,
        item_name=item_name,
        desc=desc,
        price=price,
        photo_url=photo_path, # Saves the local path!
        category=category,
        brand=brand        
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": f"Item '{new_item.item_name}' successfully added to the catalog!", 
        "item_id": new_item.item_id,
        "photo_url": new_item.photo_url
    }

@app.get("/items/{barcode}")
def get_item_by_barcode(barcode: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    # 1. Search our global catalog for the specific barcode
    item = db.query(models.Item).filter(models.Item.upc == barcode).first()
    
    # 2. If it doesn't exist, tell the app it's time to show the "Create Item" form
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Barcode not found in OpenInventory catalog."
        )
    
    # 3. If it exists, return the full item details!
    return item

@app.post("/signup", status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if the username is already taken
    existing_user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if existing_user:
        # If the user exists, throw an error!
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username is already taken"
        )

    # 2. Create the new user object (School Project Plain Text Version!)
    # We map the data from the Pydantic model (user_data) to the SQLAlchemy model (models.User)
    new_user = models.User(
        username=user_data.username,
        password=user_data.password, # Saving plain text directly!
        wants_notif=user_data.wants_notif
    )

    # 3. Save it to the database
    db.add(new_user)       # Adds the new user to the staging area
    db.commit()            # Actually saves it to Postgres
    db.refresh(new_user)   # Grabs the freshly saved user (now with an auto-generated user_id)

    # 4. Return a success message
    return {"message": f"User '{new_user.username}' created successfully!", "user_id": new_user.user_id}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Find the user
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    
    # 2. PLAIN TEXT PASSWORD CHECK (School Project Only!)
    # We are checking if the password they typed matches exactly what is in the database
    if not user or user.password != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create the Token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user.username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": encoded_jwt, "token_type": "bearer"}


@app.get("/items/search")
def search_items(
    q: str, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # 1. We use .ilike() for a case-insensitive "contains" search.
    # The '%' signs are wildcards, meaning "find this text anywhere in the string."
    search_query = f"%{q}%"
    
    results = db.query(models.Item).filter(
        (models.Item.item_name.ilike(search_query)) |
        (models.Item.brand.ilike(search_query)) |
        (models.Item.category.ilike(search_query))
    ).all()

    # 2. Return the list of items (even if it's an empty list [])
    return results

# --- ROUTE PROTECTION DEPENDENCY ---




# --- TEST ROUTES ---

@app.get("/")
def read_root():
    return {"message": "OpenInventory API is running!"}


@app.get("/inventory/getinventories")
def get_inventories(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    #Yo its me parker! This endpoint retrieves the Name and ID of all inventories assosciated with the current user. Hold on to this stuff, Its important and you will need both for other endpoints.
    
    invList = (db.query(models.InventoryUser).filter(models.InventoryUser.user_id == current_user.user_id).all())
    invResponse = []
    
    if not invList:
        raise HTTPException(status_code=400, detail="No inventories linked to user!")
    
    for inv in invList:
        inventory = (db.query(models.Inventory).filter(models.Inventory.inventory_id == inv.inventory_id ).first())
        inventoryName = inventory.inventory_name
        res = InventoryResponse(invId=inv.inventory_id, invName=inventoryName)
        invResponse.append(res)
    
    return invResponse

@app.post("/inventory/create")
def create_inventory(invName : str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user) ):
    
    if not invName or not invName.strip():
        raise HTTPException(status_code=400, detail="Inventory name required")
    
    newInv = models.Inventory(inventory_name = invName.strip())
    db.add(newInv)
    db.commit()
    db.refresh(newInv)
    
    newInvUser = models.InventoryUser(user_id=current_user.user_id, inventory_id=newInv.inventory_id)
    db.add(newInvUser)
    db.commit()
    return {"message": "Inventory created successfully!", "inventory_id": newInv.inventory_id}
    
@app.post("/inventory/adduser")
def add_user_to_inv(addUserReq: AddUserToInv, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user) ):
    #YO YO YO, Its me parker!!! We take in the inventoryId and the username of the user that we want to add to our Inventory. (See AddUserToInv to know how to format data when sending data here)
    
    findUser = (db.query(models.User).filter(models.User.username == addUserReq.username).first())
    
    if not findUser:
        raise HTTPException(status_code=404,
            detail="Username not found")
        
    userToAdd = findUser.user_id
    existing = (db.query(models.InventoryUser).filter(models.InventoryUser.user_id == userToAdd, models.InventoryUser.inventory_id == addUserReq.invId).first())
    if existing:
        raise HTTPException(status_code=400, detail="User already added to inventory!")
     
        
    newInvUser = models.InventoryUser(user_id=userToAdd, inventory_id=addUserReq.invId)
    db.add(newInvUser)
    db.commit()
    
    return userToAdd

@app.post("/inventory/additem")
def add_item_to_inventory(addItem: AddItemToInv, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user) ):
    existing = (db.query(models.InventoryEntry).filter(models.InventoryEntry.inventory_id == addItem.inventory_id , models.InventoryEntry.item_id == addItem.item_id).first())
    
    if existing:
        raise HTTPException(status_code=400,
            detail="Item already in inventory!")
    
    itemEntry = models.InventoryEntry(inventory_id = addItem.inventory_id, item_id=addItem.item_id, quantity=addItem.quantity, low_stock_trigger = addItem.low_stock_trigger)
    db.add(itemEntry)
    db.commit()
    return {"message": "Item added to inventory!"}

@app.post("/inventory/updatecount")
def update_count(req: UpdateCountRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    item = (db.query(models.InventoryEntry).filter(models.InventoryEntry.inventory_id == req.inventory_id, models.InventoryEntry.item_id == req.item_id).first())
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in this inventory.")
    
    item.quantity = item.quantity + req.quantityDelta
    
    if item.quantity < 0:
        raise HTTPException(status_code=400,
            detail="Quantity cannot be below zero!")
        
    db.commit()
    
    return {"message" : "Item quantity updated!"}


@app.get("/inventory/{inventory_id}/items")
def get_inventory_items(inventory_id : int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    inventory = (db.query(models.InventoryEntry).filter(models.InventoryEntry.inventory_id == inventory_id).all())
    inventoryContents = []
    
    if inventory:
        for items in inventory:
            item = (db.query(models.Item).filter(models.Item.item_id == items.item_id).first())
            itemToAdd = ItemResponse(item_id=item.item_id, item_name=item.item_name, desc=item.desc, upc=item.upc, photo_url=item.photo_url, price=item.price, category=item.category, brand=item.brand, quantity=items.quantity, low_stock_trigger=items.low_stock_trigger)
            inventoryContents.append(itemToAdd)
    else:
        raise HTTPException(status_code=400,
            detail="No entries found for inventory!")
        
    return inventoryContents