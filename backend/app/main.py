from fastapi import FastAPI
from app.routes.caseRoutes import router as case_router
from app.routes.analyticsRoutes import router as analytics_router
from app.routes.IndividualRoutes import router as Individual_router
from app.routes.reportRoutes import router as report_router

from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Human Rights MIS")
app.mount("/files", StaticFiles(directory="files"), name="files")

origins = [
    "http://localhost:3009",  
    "http://127.0.0.1:3009"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(case_router)
app.include_router(analytics_router)
app.include_router(Individual_router)
app.include_router(report_router, prefix="/reports", tags=["Reports"])
