from firebase_config.firebase_admin_init import db
from models.user import UserProfile
import uuid

def get_user_by_id(user_id: str):
    doc = db.collection("users").document(user_id).get()
    return doc.to_dict() if doc.exists else None

def create_user(user_data: dict):
    user_id = str(uuid.uuid4())
    user_data['id'] = user_id
    db.collection("users").document(user_id).set(user_data)
    return user_id

def update_user(user_id: str, user_data: dict):
    db.collection("users").document(user_id).set(user_data, merge=True)

def search_users(skill: str = None, availability: str = None):
    users_ref = db.collection("users")
    query = users_ref.where("is_public", "==", True)

    if skill:
        query = query.where("skills_offered", "array_contains", skill)
    if availability:
        query = query.where("availability", "array_contains", availability)

    return [doc.to_dict() for doc in query.stream()]