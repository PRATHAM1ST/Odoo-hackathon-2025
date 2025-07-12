from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    name: str
    location: Optional[str] = None
    profile_photo: Optional[str] = None
    skills_offered: List[str]
    skills_wanted: List[str]
    availability: List[str]  # e.g., ["weekends", "evenings"]
    is_public: bool
    rating: Optional[float] = None