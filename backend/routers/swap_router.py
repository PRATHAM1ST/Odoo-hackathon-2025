from fastapi import APIRouter, HTTPException
from models.swap import SwapRequest
from database import swap_db
from database.skills_db import add_skill_if_new
from firebase_config.firebase_admin_init import db
from auth.verify_token import verify_token
from fastapi import Depends

router = APIRouter(prefix="/swaps", tags=["Swaps"])

@router.post("/")
def request_swap(swap: SwapRequest):
    swap_id = swap_db.create_swap_request(swap)
    return {"message": "Swap request created", "swap_id": swap_id}

@router.post("/swaps/", dependencies=[Depends(verify_token)])
def create_swap(swap: SwapRequest):
    # Add both skills to the central collection
    add_skill_if_new(swap.offered_skill)
    add_skill_if_new(swap.requested_skill)

    # Save swap
    swap.created_at = datetime.utcnow()
    doc_ref = db.collection("swaps").document()
    doc_ref.set(swap.dict())
    return {"message": "Swap request created", "id": doc_ref.id}

@router.get("/sent/{user_id}")
def sent_swaps(user_id: str):
    return {"swaps": swap_db.get_user_swaps(user_id, mode="sent")}

@router.get("/received/{user_id}")
def received_swaps(user_id: str):
    return {"swaps": swap_db.get_user_swaps(user_id, mode="received")}

@router.put("/{swap_id}/status/{status}")
def update_status(swap_id: str, status: str):  # status: accepted or rejected
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    swap_db.update_swap_status(swap_id, status)
    return {"message": f"Swap {status}"}

@router.delete("/{swap_id}")
def delete_swap_request(swap_id: str):
    swap_db.delete_swap(swap_id)
    return {"message": "Swap request deleted"}