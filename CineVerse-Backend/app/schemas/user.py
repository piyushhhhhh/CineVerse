from pydantic import BaseModel, EmailStr
from typing import List


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdateFavorites(BaseModel):
    favorites: List[str]


class UserBase(BaseModel):
    id: str
    email: EmailStr
    name: str
    favorites: List[str] = []


class UserResponse(BaseModel):
    success: bool = True
    data: UserBase


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
