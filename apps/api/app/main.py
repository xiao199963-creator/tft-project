from fastapi import FastAPI

from app.routes import router

app = FastAPI(title="TFT Meta Analytics API")
app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
