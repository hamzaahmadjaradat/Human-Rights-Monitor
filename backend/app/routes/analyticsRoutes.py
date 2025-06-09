from fastapi import APIRouter
from app.controllers.analyticsController import get_timeline_analytics_controller
from app.controllers.analyticsController import get_geodata_analytics_controller
from app.controllers.analyticsController import get_violations_analytics_controller
from fastapi.responses import FileResponse
from app.controllers.analyticsController import generate_pdf_report
from app.controllers.analyticsController import generate_excel_report

router = APIRouter(prefix="/cases/analytics", tags=["Case Analytics"])

@router.get("/timeline")
def get_timeline():
    return get_timeline_analytics_controller()



@router.get("/geodata")
def get_geodata():
    return get_geodata_analytics_controller()


@router.get("/violations")
def get_violations():
    return get_violations_analytics_controller()

@router.get("/analytics/export/pdf")
def export_pdf():
    pdf_path = generate_pdf_report()
    return FileResponse(pdf_path, media_type="application/pdf", filename="analytics_report.pdf")

@router.get("/analytics/export/excel")
def export_excel():
    excel_path = generate_excel_report()
    return FileResponse(excel_path, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="analytics_report.xlsx")
