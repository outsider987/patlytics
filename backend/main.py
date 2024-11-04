from fastapi import FastAPI
from config import cors_settings
from fastapi.middleware.cors import CORSMiddleware
from routes import infringement_router, health_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    **cors_settings
)

# Include routers
app.include_router(health_router)
app.include_router(infringement_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
