from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.reportRoutes import router as report_router

app = FastAPI()

# 👇 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(report_router, prefix="/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "Human Rights MIS - Reports Module"}
