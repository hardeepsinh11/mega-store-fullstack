from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker,declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")
# 1. Engine 
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 4. Dependency (દરેક API માં કામ લાગશે)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()