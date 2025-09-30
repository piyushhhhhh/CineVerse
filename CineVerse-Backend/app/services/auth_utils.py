
def verify_password(plain_password: str, db_password: str) -> bool:
    return plain_password == db_password
