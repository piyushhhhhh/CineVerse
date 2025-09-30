from typing import List


class User:
    def __init__(self, id: str, name: str, email: str, password: str, favorites: List[str]):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.favorites = favorites if favorites is not None else []
