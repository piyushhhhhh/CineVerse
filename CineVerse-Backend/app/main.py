from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, movies

app = FastAPI(title="CineVerse API")

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(movies.router, prefix="/api", tags=["Movies"])


@app.get("/", tags=["Root"])
async def main():
    return {"message": "Welcome to the CineVerse API"}
