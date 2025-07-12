from fastapi import APIRouter, HTTPException, Depends
from models.user import UserProfile
from database.firestore import get_user_by_id, update_user, search_users, create_user
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

@router.put("/{user_id}")
def update_user_profile(user_id: str, profile: UserProfile):  # Add Depends(verify_token) later
    update_user(user_id, profile.dict())
    return {"message": "Profile updated"}

@router.get("/")
def search_public_users(skill: str = None, availability: str = None):
    results = search_users(skill, availability)
    return {"results": results}