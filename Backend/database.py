from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# TODO: Replace with your actual Postgres username, password, and database name
SQLALCHEMY_DATABASE_URL = "postgresql://admin:openPass!!99G1@localhost:5432/inventorydb"

# The engine is the core interface to the database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# This creates a factory for generating new database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)