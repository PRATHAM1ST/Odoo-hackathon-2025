from firebase_config.firebase_admin_init import db
from models.feedback import Feedback

def submit_feedback(feedback: Feedback):
    fb_ref = db.collection("feedback").document()
    fb_ref.set(feedback.dict())
    update_user_rating(feedback.to_user)

def get_user_feedback(user_id: str):
    query = db.collection("feedback").where("to_user", "==", user_id)
    return [doc.to_dict() for doc in query.stream()]

def update_user_rating(user_id: str):
    query = db.collection("feedback").where("to_user", "==", user_id)
    feedbacks = [doc.to_dict() for doc in query.stream()]
    if feedbacks:
        avg_rating = sum(f["rating"] for f in feedbacks) / len(feedbacks)
        db.collection("users").document(user_id).update({"rating": round(avg_rating, 2)})