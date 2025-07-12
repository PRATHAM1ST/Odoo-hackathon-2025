from fastapi import APIRouter, Query
from database.skills_db import get_skill_suggestions

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("/suggest")
def suggest_skills(q: str = Query(...)):
    return {"suggestions": get_skill_suggestions(q)}