from bson import json_util
import json
from app.database import individuals_collection

def get_all_victims_controller():
    victims_cursor = individuals_collection.find({"type": "victim"})
    victims_json_str = json_util.dumps(list(victims_cursor))  # Serialize with bson support
    victims = json.loads(victims_json_str)  # Convert JSON string back to Python dict/list
    return victims
