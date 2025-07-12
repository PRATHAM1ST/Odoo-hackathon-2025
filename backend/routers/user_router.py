from fastapi import APIRouter, HTTPException, Depends
from models.user import UserProfile
from database.firestore import get_user_by_id, update_user, search_users, create_user
from database.skills_db import add_skill_if_new
from firebase_config.firebase_admin_init import db
from auth.verify_token import verify_token
from fastapi import Depends
# from utils.auth import verify_token  # Uncomment later when auth is working

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def create_user_profile(profile: UserProfile):
    try:
        user_id = create_user(profile.dict())
        return {"message": "User created successfully", "user_id": user_id}
    except Exception as e:
        print(f"Internal Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{user_id}")
def get_user(user_id: str):
    try:
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        print(f"Internal Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/{user_id}", dependencies=[Depends(verify_token)])
def update_user_profile(user_id: str, user_update: UserProfile):
    # Add new skills to the central skills collection
    for skill in user_update.skills_offered + user_update.skills_wanted:
        add_skill_if_new(skill)

    # update Firestore user document
    db.collection("users").document(user_id).set(user_update.dict())
    return {"message": "User profile updated"}

@router.get("/")
def search_public_users(skill: str = None, availability: str = None):
    results = search_users(skill, availability)
    return {"results": results}