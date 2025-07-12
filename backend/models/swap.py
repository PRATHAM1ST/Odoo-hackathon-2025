from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

class SwapRequest(BaseModel):
    sender_id: str
    recipient_id: str
    offered_skill: str
    requested_skill: str
    message: Optional[str] = None
    status: Literal["pending", "accepted", "rejected"] = "pending"
    created_at: datetime = datetime.utcnow()