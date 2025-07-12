from fastapi import APIRouter, HTTPException
from models.swap import SwapRequest
from database import swap_db

router = APIRouter(prefix="/swaps", tags=["Swaps"])

@router.post("/")
def request_swap(swap: SwapRequest):
    swap_id = swap_db.create_swap_request(swap)
    return {"message": "Swap request created", "swap_id": swap_id}

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