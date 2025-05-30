from fastapi import FastAPI
from app.routers import cases

app = FastAPI()
app.include_router(cases.router)
