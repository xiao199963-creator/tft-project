import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

LOCAL_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def get_allowed_origins() -> list[str]:
    configured_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
    origins = [origin.strip() for origin in configured_origins.split(",") if origin.strip()]
    return origins or LOCAL_ALLOWED_ORIGINS


def create_app(allowed_origins: list[str] | None = None) -> FastAPI:
    app = FastAPI(title="TFT Meta Analytics API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins or get_allowed_origins(),
        allow_methods=["GET"],
        allow_headers=["*"],
    )
    app.include_router(router)

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app

app = create_app()
