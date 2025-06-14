from datetime import datetime
from collections import Counter, defaultdict
from app.database import cases_collection
from fpdf import FPDF
import pandas as pd

def get_timeline_analytics_controller():
    cases = list(cases_collection.find({}, {"date_occurred": 1}))
    counter = Counter()
    for case in cases:
        date = case.get("date_occurred")
        if date:
            if isinstance(date, str):
                date = datetime.fromisoformat(date)
            date_key = date.strftime("%Y-%m-%d")
            counter[date_key] += 1
    return dict(counter)

def get_geodata_analytics_controller():
    cursor = cases_collection.find({}, {
        "location.country": 1,
        "location.region": 1,
        "location.coordinates": 1
    })

    result = defaultdict(lambda: {
        "count": 0,
        "coordinates": None,
        "country": "",
        "region": ""
    })

    for case in cursor:
        loc = case.get("location", {})
        key = (loc.get("country", "Unknown"), loc.get("region", "Unknown"))
        result[key]["count"] += 1
        result[key]["coordinates"] = loc.get("coordinates", {}).get("coordinates")
        result[key]["country"] = key[0]
        result[key]["region"] = key[1]

    return list(result.values())

def get_violations_analytics_controller():
    cursor = cases_collection.find({}, {"violation_types": 1})
    counter = Counter()
    for case in cursor:
        types = case.get("violation_types", [])
        counter.update(types)
    return dict(counter)




def generate_pdf_report():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Human Rights Analytics Report", ln=True, align='C')
    pdf.output("analytics_report.pdf")
    return "analytics_report.pdf"

def generate_excel_report():
    data = {
        "Violation Type": ["torture", "arbitrary_detention"],
        "Count": [5, 7]
    }
    df = pd.DataFrame(data)
    file_path = "analytics_report.xlsx"
    df.to_excel(file_path, index=False)
    return file_path
