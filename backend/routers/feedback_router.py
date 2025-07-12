from fastapi import APIRouter, HTTPException
from models.feedback import Feedback
from database import feedback_db

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/")
def leave_feedback(feedback: Feedback):
    feedback_db.submit_feedback(feedback)
    return {"message": "Feedback submitted"}

@router.get("/user/{user_id}")
def get_feedback_for_user(user_id: str):
    return {"feedback": feedback_db.get_user_feedback(user_id)}