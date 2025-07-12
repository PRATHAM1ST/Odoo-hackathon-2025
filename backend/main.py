from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user_router, swap_router,feedback_router


app = FastAPI(title="Skill Swap Platform API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(swap_router.router)
app.include_router(feedback_router.router)

@app.get("/")
def read_root():
    return {"message": "Skill Swap Backend is running."}

# @app.get("/me")
# def get_my_profile(user_data=Depends(verify_token)):
#     return {"user": user_data}