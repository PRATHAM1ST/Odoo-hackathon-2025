from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(login_request: LoginRequest):
    url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUFSzVnvqvA5rrvmYGvxpayJaQ3KlanpI"
    payload = {
        "email": login_request.email,
        "password": login_request.password,
        "returnSecureToken": True
    }
    res = requests.post(url, json=payload)
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return res.json()  # returns idToken, refreshToken, etc.

class ResetPasswordRequest(BaseModel):
    email: str

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUFSzVnvqvA5rrvmYGvxpayJaQ3KlanpI"
    payload = {
        "requestType": "PASSWORD_RESET",
        "email": req.emai
    }
    res = requests.post(url, json=payload)
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to send reset link")
    return {"message": "Password reset email sent"}