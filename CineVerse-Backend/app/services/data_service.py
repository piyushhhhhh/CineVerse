import json
import os
import uuid
from typing import List, Optional, Dict, Any
from app.models.user import User
from app.models.movie import Movie
from app.config import USERS_FILE, MOVIES_FILE

# --- Data Loading/Saving Helpers ---


def load_data(file_path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(file_path):
        return []
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_data(file_path: str, data: List[Dict[str, Any]]):
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

# --- User Service Functions ---


def get_users() -> List[User]:
    users_data = load_data(USERS_FILE)
    return [User(**user_data) for user_data in users_data]


def save_users(users: List[User]):
    users_data = [user.__dict__ for user in users]
    save_data(USERS_FILE, users_data)


def get_user_by_email(email: str) -> Optional[User]:
    users = get_users()
    for user in users:
        if user.email == email:
            return user
    return None


def get_user_by_id(user_id: str) -> Optional[User]:
    users = get_users()
    for user in users:
        if user.id == user_id:
            return user
    return None


def create_user(name: str, email: str, password: str) -> User:
    users = get_users()
    if get_user_by_email(email):
        raise ValueError("Email already registered")

    new_user_id = str(uuid.uuid4())
    new_user = User(
        id=new_user_id,
        name=name,
        email=email,
        password=password,
        favorites=[]
    )
    users.append(new_user)
    save_users(users)
    return new_user


def update_user_favorites(user_id: str, favorites: List[str]) -> Optional[User]:
    users = get_users()
    user_found = False
    updated_user = None
    for i, user in enumerate(users):
        if user.id == user_id:
            users[i].favorites = favorites
            updated_user = users[i]
            user_found = True
            break
    if user_found:
        save_users(users)
        return updated_user
    return None

# --- Movie Service Functions ---


def get_movies() -> List[Movie]:
    movies_data = load_data(MOVIES_FILE)
    return [Movie(**movie_data) for movie_data in movies_data]


def get_movie_by_id(movie_id: str) -> Optional[Movie]:
    movies = get_movies()
    for movie in movies:
        if movie.id == movie_id:
            return movie
    return None


def search_movies(query: str) -> List[Movie]:
    query = query.lower()
    movies = get_movies()
    return [
        movie for movie in movies
        if query in movie.title.lower() or query in movie.description.lower()
    ]


def get_movies_by_genre(genre_name: str) -> List[Movie]:
    genre_name = genre_name.lower()
    movies = get_movies()
    return [movie for movie in movies if genre_name in [g.lower() for g in movie.genres]]


def get_movies_by_mood(mood_name: str) -> List[Movie]:
    mood_name = mood_name.lower()
    movies = get_movies()
    return [movie for movie in movies if mood_name in [m.lower() for m in movie.moods]]


def get_recommended_movies(user_id: str, mood: Optional[str] = None) -> List[Movie]:
    # --- VERY Basic Recommendation Logic ---
    # In a real app, use collaborative filtering, content-based, or hybrid models.
    # This example: returns movies from favorite genres, optionally filtered by mood.

    user = get_user_by_id(user_id)
    all_movies = get_movies()

    if not user:
        return sorted(all_movies, key=lambda m: m.rating, reverse=True)[:10]

    recommended = []
    user_fav_genres = set()
    user_fav_movies = set(user.favorites)

    # Get genres from user's favorite movies
    for movie_id in user.favorites:
        movie = get_movie_by_id(movie_id)
        if movie:
            user_fav_genres.update([g.lower() for g in movie.genres])

    # Recommend movies from favorite genres (excluding already favorited ones)
    for movie in all_movies:
        if movie.id not in user_fav_movies:
            movie_genres_lower = set([g.lower() for g in movie.genres])
            if user_fav_genres.intersection(movie_genres_lower):
                # Optional mood filter
                if mood:
                    mood_lower = mood.lower()
                    if mood_lower in [m.lower() for m in movie.moods]:
                        recommended.append(movie)
                else:
                    recommended.append(movie)

    # If few recommendations based on genre, add top-rated ones
    if len(recommended) < 5:
        top_rated = sorted(
            [m for m in all_movies if m.id not in user_fav_movies and m not in recommended],
            key=lambda m: m.rating, reverse=True
        )
        needed = 10 - len(recommended)
        recommended.extend(top_rated[:needed])

    # Optional: Shuffle or further refine recommendations
    import random
    random.shuffle(recommended)

    return recommended[:20]  # Limit recommendations
