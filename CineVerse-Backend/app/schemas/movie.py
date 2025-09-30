from pydantic import BaseModel
from typing import List, Optional


class MovieBase(BaseModel):
    id: str
    title: str
    description: str
    releaseYear: int
    duration: str
    rating: float
    genres: List[str] = []
    moods: List[str] = []
    poster_path: str = ""


class MovieListResponse(BaseModel):
    success: bool = True
    data: List[MovieBase]


class MovieDetailResponse(BaseModel):
    success: bool = True
    data: MovieBase


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
