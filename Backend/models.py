from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

# This is the base class all your models will inherit from
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    wants_notif = Column(Boolean, default=True)

    # Relationship: A user can be part of multiple inventories
    inventories = relationship("InventoryUser", back_populates="user")


class InventoryUser(Base):
    """
    This is your junction table connecting Users to Inventories.
    We make it a full model because your diagram specified a unique 'inv_user_id' PK.
    """
    __tablename__ = "inventory_users"

    inv_user_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    inventory_id = Column(Integer, ForeignKey("inventories.inventory_id"), nullable=False)

    # Relationships to link back to the parent tables
    user = relationship("User", back_populates="inventories")
    inventory = relationship("Inventory", back_populates="users")


class Inventory(Base):
    __tablename__ = "inventories"

    inventory_id = Column(Integer, primary_key=True, index=True)
    inventory_name = Column(String, nullable=False)

    # Relationships
    users = relationship("InventoryUser", back_populates="inventory")
    entries = relationship("InventoryEntry", back_populates="inventory")


class Item(Base):
    """
    The 'Global Catalog' of items.
    """
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, index=True, nullable=False)
    desc = Column(String)
    price = Column(Float)
    upc = Column(String, unique=True, index=True) # Unique so we don't have duplicate barcodes
    photo_url = Column(String)
    category = Column(String)
    brand = Column(String)

    # Relationship: An item can appear in many different inventory entries
    inventory_entries = relationship("InventoryEntry", back_populates="item")


class InventoryEntry(Base):
    """
    The actual physical stock of an item inside a specific inventory.
    """
    __tablename__ = "inventory_entries"

    entry_id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventories.inventory_id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.item_id"), nullable=False)
    
    quantity = Column(Integer, default=0)
    low_stock_trigger = Column(Integer, default=5) # Default alert threshold

    # Relationships to easily grab the inventory or the item details
    inventory = relationship("Inventory", back_populates="entries")
    item = relationship("Item", back_populates="inventory_entries")