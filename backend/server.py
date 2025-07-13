from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

# Load environment variables FIRST
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import our modules AFTER loading environment
from database import init_database, close_database
from auth import create_admin_user
from portfolio_api import router as portfolio_router
from auth_api import router as auth_router

# Create the main app
app = FastAPI(
    title="Emmanuel Tobi Portfolio API",
    description="Backend API for Emmanuel Tobi's developer portfolio",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(portfolio_router)
app.include_router(auth_router)

# Create a simple health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Emmanuel Tobi Portfolio API is running",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/api/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Emmanuel Tobi's Portfolio API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "auth": "/api/auth/",
            "portfolio": "/api/",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and create admin user on startup"""
    try:
        # Initialize database
        await init_database()
        
        # Create admin user
        await create_admin_user()
        
        print("🚀 Emmanuel Tobi Portfolio API started successfully")
        print("📊 Admin Dashboard: http://localhost:8001/docs")
        print("🔐 Default Admin: admin@emmanueltobi.dev / admin123")
        
    except Exception as e:
        print(f"❌ Error during startup: {e}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    try:
        await close_database()
        print("✅ Database connection closed")
    except Exception as e:
        print(f"❌ Error during shutdown: {e}")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Endpoint not found", "message": "The requested resource was not found"}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return {"error": "Internal server error", "message": "Something went wrong on our end"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)