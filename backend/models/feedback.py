from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Feedback(BaseModel):
    swap_id: str
    from_user: str
    to_user: str
    rating: float  # between 1.0 to 5.0
    comment: Optional[str] = None
    created_at: datetime = datetime.utcnow()