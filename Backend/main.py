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

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()

barcodeLookupApiKey = os.getenv("BARCODELOOKUPAPIKEY")

class ProductUPC(BaseModel):
    upc : str

class ProductDetails(BaseModel):
    item_name: str
    desc: str
    price: str
    upc: str
    photo_url: str
    category: str
    brand: str


class UserCreate(BaseModel):
    username: str
    password: str
    wants_notif: bool = True # Defaults to True if the mobile app doesn't send it

# --- SIMPLIFIED SECURITY CONSTANTS ---
SECRET_KEY = "openinventory-super-secret-key" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300 # Set to 5 hours so you don't get logged out while testing

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTHENTICATION ROUTES ---
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
        password_hash=user_data.password, # Saving plain text directly!
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
    if not user or user.password_hash != form_data.password:
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


# --- ROUTE PROTECTION DEPENDENCY ---

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

# --- TEST ROUTES ---

@app.get("/")
def read_root():
    return {"message": "OpenInventory API is running!"}

@app.get("/my-profile")
def get_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Hello {current_user.username}, you are securely logged in!",
        "wants_notifications": current_user.wants_notif
    }

@app.post("/getproductdetails")
def getProductDetails(Request : ProductUPC):
        reqUpc = Request.upc
        requestParameters = {'barcode' : reqUpc, 'geo':'us' ,'formatted': 'y', 'key': barcodeLookupApiKey}
        response = httpx.get("https://api.barcodelookup.com/v3/products", params=requestParameters)

        try:
            responsejson = response.json()
        except:
            raise HTTPException(status_code=502,
            detail="Barcode API returned invalid JSON, are you sure you sent the right UPC?")

        product = responsejson.get("products", [None])[0]
        
        if product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        
        priceExtract = product.get("stores", [{}])[0].get("price", "0.00")
        img = product.get("images", [None])[0]
        categoryString = product["category"].split('>')
        cat = categoryString[0].strip()
        
        
        productDetails = ProductDetails(item_name=product["title"], desc=product["description"], price=priceExtract, upc=reqUpc, photo_url= img, category=cat, brand=product["brand"])

        return productDetails
    