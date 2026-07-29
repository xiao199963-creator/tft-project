from fastapi import FastAPI

app = FastAPI(title="TFT Meta Analytics API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
