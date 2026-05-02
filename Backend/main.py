from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from jose import jwt, JWTError
import models
from database import engine, SessionLocal
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from typing import Optional
import shutil
import uuid
import httpx
from fastapi import File, UploadFile, Form
from fastapi.staticfiles import StaticFiles


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

class InviteUserRequest(BaseModel):
    user_id: int
    
class InventoryResponse(BaseModel):
    invId: int
    invName: str
    role: str


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

class CatalogItemResponse(BaseModel):
    item_id: int
    item_name: str
    desc: str
    upc: str
    photo_url: str
    price: float
    category: str
    brand: str

class InventoryBarcodeLookupResponse(BaseModel):
    in_inventory: bool
    item: CatalogItemResponse
    quantity: Optional[int] = None
    low_stock_trigger: Optional[int] = None

class InventoryUserResponse(BaseModel):
    user_id: int
    username: str
    role: str
    joined_at: Optional[datetime] = None

class InviteCandidateResponse(BaseModel):
    user_id: int
    username: str

class NotificationTokenRequest(BaseModel):
    expo_push_token: str

class UserCreate(BaseModel):
    username: str
    password: str
    wants_notif: bool = True # Defaults to True if the mobile app doesn't send it

# --- SIMPLIFIED SECURITY CONSTANTS ---
SECRET_KEY = "openinventory-super-secret-key" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200 # Set to 30 days so you don't get logged out while testing
INVENTORY_ROLE_ADMIN = "admin"
INVENTORY_ROLE_MEMBER = "member"
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

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


def require_inventory_member(inventory_id: int, current_user: models.User, db: Session) -> models.InventoryUser:
    membership = (
        db.query(models.InventoryUser)
        .filter(
            models.InventoryUser.inventory_id == inventory_id,
            models.InventoryUser.user_id == current_user.user_id
        )
        .first()
    )

    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this inventory")

    return membership


def require_inventory_admin(inventory_id: int, current_user: models.User, db: Session) -> models.InventoryUser:
    membership = require_inventory_member(inventory_id=inventory_id, current_user=current_user, db=db)

    if membership.role != INVENTORY_ROLE_ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only inventory admins can perform this action")

    return membership


def ensure_inventory_user_schema():
    with engine.begin() as connection:
        connection.execute(
            text("ALTER TABLE inventory_users ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT 'member'")
        )
        connection.execute(
            text("ALTER TABLE inventory_users ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()")
        )
        connection.execute(
            text("ALTER TABLE inventory_users ADD COLUMN IF NOT EXISTS added_by_user_id INTEGER")
        )
        connection.execute(
            text("UPDATE inventory_users SET role = 'member' WHERE role IS NULL OR role = ''")
        )

        missing_admin_rows = connection.execute(
            text(
                """
                SELECT iu.inventory_id, MIN(iu.user_id) AS user_id
                FROM inventory_users iu
                LEFT JOIN inventory_users admins
                    ON admins.inventory_id = iu.inventory_id AND admins.role = 'admin'
                GROUP BY iu.inventory_id
                HAVING COUNT(admins.inv_user_id) = 0
                """
            )
        ).fetchall()

        for row in missing_admin_rows:
            connection.execute(
                text(
                    """
                    UPDATE inventory_users
                    SET role = 'admin'
                    WHERE inventory_id = :inventory_id AND user_id = :user_id
                    """
                ),
                {"inventory_id": row.inventory_id, "user_id": row.user_id},
            )


def ensure_notification_schema():
    with engine.begin() as connection:
        connection.execute(
            text("ALTER TABLE users ADD COLUMN IF NOT EXISTS expo_push_token VARCHAR")
        )


def send_low_stock_push_notifications(inventory_id: int, item_name: str, quantity: int, threshold: int, db: Session):
    recipients = (
        db.query(models.User)
        .join(models.InventoryUser, models.InventoryUser.user_id == models.User.user_id)
        .filter(
            models.InventoryUser.inventory_id == inventory_id,
            models.User.wants_notif == True,
            models.User.expo_push_token.isnot(None),
            models.User.expo_push_token != ""
        )
        .all()
    )

    if not recipients:
        return

    messages = [
        {
            "to": user.expo_push_token,
            "title": "Low stock alert",
            "body": f"{item_name} is low ({quantity} left, trigger {threshold}).",
            "data": {
                "inventory_id": inventory_id,
                "item_name": item_name,
                "quantity": quantity,
                "low_stock_trigger": threshold
            }
        }
        for user in recipients
    ]

    try:
        httpx.post(EXPO_PUSH_URL, json=messages, timeout=10.0)
    except Exception:
        # Push delivery should never block inventory updates.
        return


@app.on_event("startup")
def bootstrap_inventory_membership():
    ensure_inventory_user_schema()
    ensure_notification_schema()


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


@app.post("/notifications/push-token")
def register_push_token(
    token_request: NotificationTokenRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cleaned_token = token_request.expo_push_token.strip()
    if not cleaned_token:
        raise HTTPException(status_code=400, detail="Push token is required")

    current_user.expo_push_token = cleaned_token
    db.commit()
    return {"message": "Push token registered"}


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
        return []
    
    for inv in invList:
        inventory = (db.query(models.Inventory).filter(models.Inventory.inventory_id == inv.inventory_id ).first())
        inventoryName = inventory.inventory_name
        res = InventoryResponse(invId=inv.inventory_id, invName=inventoryName, role=inv.role)
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
    
    newInvUser = models.InventoryUser(
        user_id=current_user.user_id,
        inventory_id=newInv.inventory_id,
        role=INVENTORY_ROLE_ADMIN,
        added_by_user_id=current_user.user_id
    )
    db.add(newInvUser)
    db.commit()
    return {"message": "Inventory created successfully!", "inventory_id": newInv.inventory_id}


@app.get("/inventory/{inventory_id}/users", response_model=list[InventoryUserResponse])
def get_inventory_users(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_inventory_admin(inventory_id=inventory_id, current_user=current_user, db=db)

    members = (
        db.query(models.InventoryUser, models.User)
        .join(models.User, models.User.user_id == models.InventoryUser.user_id)
        .filter(models.InventoryUser.inventory_id == inventory_id)
        .all()
    )

    response = [
        InventoryUserResponse(
            user_id=user.user_id,
            username=user.username,
            role=membership.role,
            joined_at=membership.joined_at
        )
        for membership, user in members
    ]
    response.sort(key=lambda row: (0 if row.role == INVENTORY_ROLE_ADMIN else 1, row.username.lower()))
    return response


@app.get("/inventory/getusers", response_model=list[InventoryUserResponse])
def get_inventory_users_legacy(
    invId: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return get_inventory_users(inventory_id=invId, db=db, current_user=current_user)


@app.get("/inventory/{inventory_id}/invite-candidates", response_model=list[InviteCandidateResponse])
def get_invite_candidates(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_inventory_admin(inventory_id=inventory_id, current_user=current_user, db=db)

    assigned_user_rows = (
        db.query(models.InventoryUser.user_id)
        .filter(models.InventoryUser.inventory_id == inventory_id)
        .all()
    )
    assigned_user_ids = [row.user_id for row in assigned_user_rows]

    candidate_query = db.query(models.User)
    if assigned_user_ids:
        candidate_query = candidate_query.filter(~models.User.user_id.in_(assigned_user_ids))

    candidates = candidate_query.order_by(models.User.username.asc()).all()
    return [InviteCandidateResponse(user_id=user.user_id, username=user.username) for user in candidates]


@app.post("/inventory/{inventory_id}/invite", status_code=status.HTTP_201_CREATED)
def invite_user_to_inventory(
    inventory_id: int,
    invite_request: InviteUserRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_inventory_admin(inventory_id=inventory_id, current_user=current_user, db=db)

    user_to_invite = db.query(models.User).filter(models.User.user_id == invite_request.user_id).first()
    if not user_to_invite:
        raise HTTPException(status_code=404, detail="User not found")

    existing_membership = (
        db.query(models.InventoryUser)
        .filter(
            models.InventoryUser.inventory_id == inventory_id,
            models.InventoryUser.user_id == invite_request.user_id
        )
        .first()
    )
    if existing_membership:
        raise HTTPException(status_code=400, detail="User already belongs to this inventory")

    new_membership = models.InventoryUser(
        user_id=invite_request.user_id,
        inventory_id=inventory_id,
        role=INVENTORY_ROLE_MEMBER,
        added_by_user_id=current_user.user_id
    )
    db.add(new_membership)
    db.commit()

    return {
        "message": "User invited successfully",
        "inventory_id": inventory_id,
        "user_id": user_to_invite.user_id,
        "username": user_to_invite.username,
        "role": INVENTORY_ROLE_MEMBER,
    }
    
@app.post("/inventory/adduser")
def add_user_to_inv(addUserReq: AddUserToInv, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user) ):
    #YO YO YO, Its me parker!!! We take in the inventoryId and the username of the user that we want to add to our Inventory. (See AddUserToInv to know how to format data when sending data here)
    
    require_inventory_admin(inventory_id=addUserReq.invId, current_user=current_user, db=db)

    findUser = (db.query(models.User).filter(models.User.username == addUserReq.username).first())
    
    if not findUser:
        raise HTTPException(status_code=404,
            detail="Username not found")
        
    userToAdd = findUser.user_id
    existing = (db.query(models.InventoryUser).filter(models.InventoryUser.user_id == userToAdd, models.InventoryUser.inventory_id == addUserReq.invId).first())
    if existing:
        raise HTTPException(status_code=400, detail="User already added to inventory!")
     
        
    newInvUser = models.InventoryUser(
        user_id=userToAdd,
        inventory_id=addUserReq.invId,
        role=INVENTORY_ROLE_MEMBER,
        added_by_user_id=current_user.user_id
    )
    db.add(newInvUser)
    db.commit()
    
    return userToAdd

@app.post("/inventory/additem")
def add_item_to_inventory(addItem: AddItemToInv, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user) ):
    require_inventory_admin(inventory_id=addItem.inventory_id, current_user=current_user, db=db)

    existing = (db.query(models.InventoryEntry).filter(models.InventoryEntry.inventory_id == addItem.inventory_id , models.InventoryEntry.item_id == addItem.item_id).first())
    
    if existing:
        raise HTTPException(status_code=400,
            detail="Item already in inventory!")
    
    itemEntry = models.InventoryEntry(inventory_id = addItem.inventory_id, item_id=addItem.item_id, quantity=addItem.quantity, low_stock_trigger = addItem.low_stock_trigger)
    db.add(itemEntry)
    db.commit()
    return {"message": "Item added to inventory!"}


@app.put("/inventory/{inventory_id}/items/{item_id}")
def edit_inventory_item(
    inventory_id: int,
    item_id: int,
    item_name: str = Form(...),
    upc: str = Form(...),
    quantity: int = Form(...),
    low_stock_trigger: int = Form(...),
    desc: str = Form(""),
    photo_url: str = Form(""),
    price: float = Form(0.0),
    category: str = Form(""),
    brand: str = Form(""),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_inventory_admin(inventory_id=inventory_id, current_user=current_user, db=db)

    inventory_entry = (
        db.query(models.InventoryEntry)
        .filter(
            models.InventoryEntry.inventory_id == inventory_id,
            models.InventoryEntry.item_id == item_id
        )
        .first()
    )

    if not inventory_entry:
        raise HTTPException(status_code=404, detail="Item not found in this inventory.")

    catalog_item = db.query(models.Item).filter(models.Item.item_id == item_id).first()
    if not catalog_item:
        raise HTTPException(status_code=404, detail="Catalog item not found.")

    if quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be below zero!")
    if low_stock_trigger < 0:
        raise HTTPException(status_code=400, detail="Low stock trigger cannot be below zero!")

    upc_conflict = (
        db.query(models.Item)
        .filter(models.Item.upc == upc, models.Item.item_id != item_id)
        .first()
    )
    if upc_conflict:
        raise HTTPException(status_code=400, detail="Another item already uses this barcode.")

    previous_quantity = inventory_entry.quantity
    previous_threshold = inventory_entry.low_stock_trigger

    catalog_item.item_name = item_name.strip()
    catalog_item.desc = desc
    catalog_item.upc = upc.strip()
    catalog_item.price = price
    catalog_item.category = category
    catalog_item.brand = brand

    if file:
        file_extension = file.filename.split(".")[-1] if file.filename and "." in file.filename else "bin"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_location = f"static/images/{unique_filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        catalog_item.photo_url = f"/static/images/{unique_filename}"
    else:
        catalog_item.photo_url = photo_url

    inventory_entry.quantity = quantity
    inventory_entry.low_stock_trigger = low_stock_trigger

    db.commit()

    crossed_low_stock = previous_quantity > previous_threshold and inventory_entry.quantity <= inventory_entry.low_stock_trigger
    if crossed_low_stock:
        send_low_stock_push_notifications(
            inventory_id=inventory_id,
            item_name=catalog_item.item_name,
            quantity=inventory_entry.quantity,
            threshold=inventory_entry.low_stock_trigger,
            db=db,
        )

    return {"message": "Item updated successfully"}


@app.delete("/inventory/{inventory_id}/items/{item_id}")
def delete_inventory_item(
    inventory_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_inventory_admin(inventory_id=inventory_id, current_user=current_user, db=db)

    inventory_entry = (
        db.query(models.InventoryEntry)
        .filter(
            models.InventoryEntry.inventory_id == inventory_id,
            models.InventoryEntry.item_id == item_id
        )
        .first()
    )

    if not inventory_entry:
        raise HTTPException(status_code=404, detail="Item not found in this inventory.")

    db.delete(inventory_entry)
    db.commit()
    return {"message": "Item removed from inventory"}

@app.post("/inventory/updatecount")
def update_count(req: UpdateCountRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    require_inventory_member(inventory_id=req.inventory_id, current_user=current_user, db=db)

    item = (db.query(models.InventoryEntry).filter(models.InventoryEntry.inventory_id == req.inventory_id, models.InventoryEntry.item_id == req.item_id).first())
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in this inventory.")
    
    previous_quantity = item.quantity
    item.quantity = item.quantity + req.quantityDelta

    if item.quantity < 0:
        raise HTTPException(status_code=400,
            detail="Quantity cannot be below zero!")

    db.commit()

    crossed_low_stock = previous_quantity > item.low_stock_trigger and item.quantity <= item.low_stock_trigger
    if crossed_low_stock:
        catalog_item = db.query(models.Item).filter(models.Item.item_id == item.item_id).first()
        item_name = catalog_item.item_name if catalog_item else "Item"
        send_low_stock_push_notifications(
            inventory_id=req.inventory_id,
            item_name=item_name,
            quantity=item.quantity,
            threshold=item.low_stock_trigger,
            db=db,
        )

    return {"message" : "Item quantity updated!"}


@app.get("/inventory/{inventory_id}/items")
def get_inventory_items(inventory_id : int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    require_inventory_member(inventory_id=inventory_id, current_user=current_user, db=db)

    inventory = (db.query(models.InventoryEntry).filter(models.InventoryEntry.inventory_id == inventory_id).all())
    inventoryContents = []
    
    if inventory:
        for items in inventory:
            item = (db.query(models.Item).filter(models.Item.item_id == items.item_id).first())
            if not item:
                # Skip dangling inventory entries that reference deleted/invalid item rows
                continue
            itemToAdd = ItemResponse(item_id=item.item_id, item_name=item.item_name, desc=item.desc, upc=item.upc, photo_url=item.photo_url, price=item.price, category=item.category, brand=item.brand, quantity=items.quantity, low_stock_trigger=items.low_stock_trigger)
            inventoryContents.append(itemToAdd)
        
    return inventoryContents


@app.get("/inventory/{inventory_id}/items/by-barcode/{barcode}", response_model=InventoryBarcodeLookupResponse)
def get_inventory_item_by_barcode(
    inventory_id: int,
    barcode: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_inventory_member(inventory_id=inventory_id, current_user=current_user, db=db)

    catalog_item = db.query(models.Item).filter(models.Item.upc == barcode).first()
    if not catalog_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barcode not found in OpenInventory catalog.")

    inventory_entry = (
        db.query(models.InventoryEntry)
        .filter(
            models.InventoryEntry.inventory_id == inventory_id,
            models.InventoryEntry.item_id == catalog_item.item_id
        )
        .first()
    )

    return InventoryBarcodeLookupResponse(
        in_inventory=inventory_entry is not None,
        item=CatalogItemResponse(
            item_id=catalog_item.item_id,
            item_name=catalog_item.item_name,
            desc=catalog_item.desc or "",
            upc=catalog_item.upc or "",
            photo_url=catalog_item.photo_url or "",
            price=catalog_item.price or 0.0,
            category=catalog_item.category or "",
            brand=catalog_item.brand or "",
        ),
        quantity=inventory_entry.quantity if inventory_entry else None,
        low_stock_trigger=inventory_entry.low_stock_trigger if inventory_entry else None,
    )
