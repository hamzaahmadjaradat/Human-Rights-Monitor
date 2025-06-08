from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["human_rights_monitor"]
cases_collection = db["cases"]
