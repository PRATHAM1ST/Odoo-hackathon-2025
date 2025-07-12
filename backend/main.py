from fastapi import FastAPI
from firebase_config.firebase_admin_init import db

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Skill Swap Backend is running."}