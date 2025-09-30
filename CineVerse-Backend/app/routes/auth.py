from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.user import UserCreate, UserLogin, UserResponse, ErrorResponse, UserBase, UserUpdateFavorites
from app.services import data_service
from app.services.auth_utils import verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=UserResponse, responses={401: {"model": ErrorResponse}})
async def login(user_credentials: UserLogin):
    """
    Authenticates a user.
    """
    db_user = data_service.get_user_by_email(user_credentials.email)
    if not db_user or not verify_password(user_credentials.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    user_data = UserBase(
        id=db_user.id,
        email=db_user.email,
        name=db_user.name,
        favorites=db_user.favorites
    )
    return UserResponse(data=user_data)


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, responses={400: {"model": ErrorResponse}})
async def signup(user: UserCreate):
    """
    Creates a new user.
    """
    db_user = data_service.get_user_by_email(user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    try:
        new_user = data_service.create_user(
            name=user.name, email=user.email, password=user.password)
        user_data = UserBase(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name,
            favorites=new_user.favorites
        )
        return UserResponse(data=user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/users/{user_id}/favorites", response_model=UserResponse, responses={404: {"model": ErrorResponse}})
async def update_favorites(user_id: str, favorites_data: UserUpdateFavorites):
    """
    Updates a user's list of favorite movie IDs.
    """
    updated_user = data_service.update_user_favorites(
        user_id, favorites_data.favorites)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user_data = UserBase(
        id=updated_user.id,
        email=updated_user.email,
        name=updated_user.name,
        favorites=updated_user.favorites
    )
    return UserResponse(data=user_data)
