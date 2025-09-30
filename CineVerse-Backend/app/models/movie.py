from typing import List, Optional


class Movie:
    def __init__(self, id: str, title: str, description: str, releaseYear: int,
                 duration: str, rating: float, genres: List[str], moods: List[str], poster_path: str):
        self.id = id
        self.title = title
        self.description = description
        self.releaseYear = releaseYear
        self.duration = duration
        self.rating = rating
        self.genres = genres if genres is not None else []
        self.moods = moods if moods is not None else []
        self.poster_path = poster_path
