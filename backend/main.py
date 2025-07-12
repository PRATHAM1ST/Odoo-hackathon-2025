from fastapi import FastAPI
from routers import user_router, swap_router,feedback_router,skills_router
from routers import auth_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.include_router(user_router.router)
app.include_router(swap_router.router)
app.include_router(feedback_router.router)
app.include_router(skills_router.router)
app.include_router(auth_router.router)

@app.get("/")
def read_root():
    return {"message": "Skill Swap Backend is running."}

# @app.get("/me")
# def get_my_profile(user_data=Depends(verify_token)):
#     return {"user": user_data}