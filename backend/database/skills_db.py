from firebase_config.firebase_admin_init import db

def get_skill_suggestions(query: str):
    query = query.lower()
    all_skills = db.collection("skills").stream()
    return [doc.id for doc in all_skills if doc.id.startswith(query)]

def add_skill_if_new(skill: str):
    skill = skill.lower()
    doc_ref = db.collection("skills").document(skill)
    if not doc_ref.get().exists:
        doc_ref.set({})