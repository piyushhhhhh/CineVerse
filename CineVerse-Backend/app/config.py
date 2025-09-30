import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), "data")

USERS_FILE = os.path.join(DATA_DIR, "users.json")
MOVIES_FILE = os.path.join(DATA_DIR, "movies.json")
