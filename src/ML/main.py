from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .route import router

app = FastAPI()

# Allow requests from your Next.js frontend (usually running on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust if your frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
