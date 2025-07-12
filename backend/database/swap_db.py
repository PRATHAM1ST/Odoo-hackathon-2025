from firebase_config.firebase_admin_init import db
from models.swap import SwapRequest
from typing import List

def create_swap_request(swap: SwapRequest):
    swap_ref = db.collection("swaps").document()
    swap_ref.set(swap.dict())
    return swap_ref.id

def get_user_swaps(user_id: str, mode: str = "sent"):
    swaps_ref = db.collection("swaps")
    query = swaps_ref.where("sender_id" if mode == "sent" else "recipient_id", "==", user_id)
    return [doc.to_dict() | {"id": doc.id} for doc in query.stream()]

def update_swap_status(swap_id: str, status: str):
    doc_ref = db.collection("swaps").document(swap_id)
    doc_ref.update({"status": status})

def delete_swap(swap_id: str):
    db.collection("swaps").document(swap_id).delete()