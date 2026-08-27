from pydantic import BaseModel

# User 
class UserCreate(BaseModel):
    name: str
    email: str 
    phone: str 
    password: str
    
    is_admin: bool=False

# Product 
class ProductCreate(BaseModel):
    name: str
    category: str
    price: int
    stock: int
    description: str
    image_url: str