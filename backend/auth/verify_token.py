import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, Header

def verify_token(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        
        id_token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # You can also return uid or email if needed
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")