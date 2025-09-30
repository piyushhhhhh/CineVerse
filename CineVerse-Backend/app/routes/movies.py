from fastapi import APIRouter, HTTPException, Query, Depends, status
from app.schemas.movie import MovieListResponse, MovieDetailResponse, ErrorResponse, MovieBase
from app.services import data_service
from app.preprocessing import load_data, preprocess_data
from app.model import train_model
from random import choice
from fastapi import Body
import os
import ast
from openai import OpenAI
from fastapi import HTTPException
from dotenv import load_dotenv
from rapidfuzz import process, fuzz
import re
import json
import pandas as pd

router = APIRouter(prefix="/movies", tags=["Movies"])

load_dotenv()
movies, ratings = load_data()
movies_processed, ratings_processed = preprocess_data(movies, ratings)
model, movies_pivot, movies_sparse = train_model(
    movies_processed, ratings_processed)


@router.get("", response_model=MovieListResponse)
async def get_all_movies():
    """
    Retrieves a list of all movies.
    """
    movies = data_service.get_movies()
    print(movies)
    return MovieListResponse(data=[MovieBase(**m.__dict__) for m in movies])


@router.get("/{movie_id}", response_model=MovieDetailResponse, responses={404: {"model": ErrorResponse}})
async def get_movie_by_id(movie_id: str):
    """
    Retrieves details for a specific movie by its ID.
    """
    movie = data_service.get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found",
        )
    return MovieDetailResponse(data=MovieBase(**movie.__dict__))


@router.get("/search/{query}", response_model=MovieListResponse)
async def search_movies(query: str):
    """
    Searches for movies matching the query string.
    """
    movies = data_service.search_movies(query)
    return MovieListResponse(data=[MovieBase(**m.__dict__) for m in movies])


@router.get("/genre/{genre_name}", response_model=MovieListResponse)
async def get_movies_by_genre(genre_name: str):
    """
    Retrieves movies belonging to a specific genre.
    """
    movies = data_service.get_movies_by_genre(genre_name)
    return MovieListResponse(data=[MovieBase(**m.__dict__) for m in movies])


@router.get("/mood/{mood_name}", response_model=MovieListResponse)
async def get_movies_by_mood(mood_name: str):
    """
    Retrieves movies matching a specific mood.
    """
    movies = data_service.get_movies_by_mood(mood_name)
    return MovieListResponse(data=[MovieBase(**m.__dict__) for m in movies])


@router.get("/recommended/{user_id}", response_model=MovieListResponse)
async def get_recommended_movies(user_id: str):
    """
    Retrieves recommended movies for a user, optionally filtered by mood.
    """
    user = data_service.get_user_by_id(user_id)
    if not user:
        pass

    movies = data_service.get_recommended_movies(user_id)
    return MovieListResponse(data=[MovieBase(**m.__dict__) for m in movies])


@router.get("/ai/recommendations/{movie_name}", response_model=MovieListResponse)
async def get_recommendations(movie_name: str):

    # Fuzzy match movie_name to closest in movies_pivot
    all_titles = list(movies_pivot.index)
    match, score, _ = process.extractOne(
        movie_name, all_titles, scorer=fuzz.ratio)
    if score < 60:  # threshold for match, can be adjusted
        raise HTTPException(status_code=404, detail="No similar movie found.")

    # Get KNN recommendations for the matched movie
    _, suggestions_id = model.kneighbors(
        movies_pivot.loc[match].values.reshape(1, -1))
    movie_list = list(movies_pivot.index[suggestions_id[0]])

    # Prepare full metadata for each recommended movie
    recommended_movies = []
    for rec_title in movie_list:
        # Find movie row in movies (original DataFrame)
        movie_row = movies[movies['original_title'] == rec_title]
        if movie_row.empty:
            continue
        row = movie_row.iloc[0]
        # Some fields may need conversion/handling if missing
        try:
            release_year = int(str(row['release_date'])[:4]) if pd.notnull(
                row['release_date']) else 0
        except Exception:
            release_year = 0
        # Genres parsing (assume genres is a stringified list of dicts)
        genres = []
        try:
            genres_list = ast.literal_eval(
                row['genres']) if pd.notnull(row['genres']) else []
            genres = [g['name'] for g in genres_list if 'name' in g]
        except Exception:
            genres = []
        movie_data = {
            'id': str(row['id']),
            'title': row['original_title'],
            'description': row['overview'] if pd.notnull(row['overview']) else '',
            'releaseYear': release_year,
            'duration': str(row['runtime']) if 'runtime' in row and pd.notnull(row['runtime']) else '',
            'rating': float(row['vote_average']) if 'vote_average' in row and pd.notnull(row['vote_average']) else 0.0,
            'genres': genres,
            'moods': [],
            'poster_path': row['poster_path'] if pd.notnull(row['poster_path']) and 'http' in row['poster_path'] else '',
        }
        recommended_movies.append(MovieBase(**movie_data))

    return MovieListResponse(data=recommended_movies)


@router.post("/ai-search", response_model=MovieListResponse)
async def ai_search(prompt: str = Body(..., embed=True)):
    """
    Accepts a user prompt and returns a list of movies generated by OpenRouter.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, detail="OpenRouter API key not set in environment variable OPENROUTER_API_KEY.")
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    system_message = (
        "You are a helpful movie recommendation assistant. "
        "Given a user's prompt, return a JSON array of up to 10 movies, each with the following fields: "
        "id (string), title (string), description (string), releaseYear (number), duration (string), rating (number), "
        "genres (array of strings), moods (array of strings). "
        "Do not include any explanation, only the JSON array."
    )
    user_message = f"User prompt: {prompt}"
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-prover-v2:free",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1200,
            temperature=0.7,
        )
        # Defensive check for response structure
        if not hasattr(response, "choices") or not response.choices or not hasattr(response.choices[0], "message") or not hasattr(response.choices[0].message, "content"):
            raise HTTPException(
                status_code=500,
                detail=f"OpenRouter API returned unexpected response: {response}"
            )
        content = response.choices[0].message.content
        if content is None:
            raise HTTPException(
                status_code=500,
                detail=f"OpenRouter API returned a response with no content: {response}"
            )
        content = content.strip()
        # Attempt to extract JSON array from the response
        try:
            code_block_match = re.search(
                r"```(?:json)?\s*([\s\S]+?)\s*```", content)
            if code_block_match:
                content = code_block_match.group(1)
            movies_list = json.loads(content)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to parse OpenRouter response as JSON: {str(e)}. Response was: {content}")
        # Validate and convert to MovieBase
        movie_objs = []
        for m in movies_list:
            try:
                movie_objs.append(MovieBase(**m))
            except Exception:
                continue  # Skip invalid items
        return MovieListResponse(data=movie_objs)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"OpenRouter API error: {str(e)}")
