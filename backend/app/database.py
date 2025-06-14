<<<<<<< HEAD
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["human_rights_mis"]
=======
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["human_rights_monitor"]
cases_collection = db["cases"]
case_status_history_collection = db["case_status_history"]
individuals_collection = db["individuals"]
incident_collection = db["incident_reports"]
evidence_collection = db["report_evidence"]
>>>>>>> 418cd1b0 (update the README file and change the location add to be by a map)
