import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load .env variables
load_dotenv()

# Load path from .env
firebase_creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

# Initialize Firebase Admin SDK
cred = credentials.Certificate(firebase_creds_path)
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()