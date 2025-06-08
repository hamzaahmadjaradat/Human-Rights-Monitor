from fastapi import FastAPI
from app.routes.caseRoutes import router as case_router

app = FastAPI(title="Human Rights MIS")

app.include_router(case_router)
