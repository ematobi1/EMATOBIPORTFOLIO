from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
import os

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
contacts_collection = db.contacts
skills_collection = db.skills
projects_collection = db.projects
experience_collection = db.experience
analytics_collection = db.analytics
project_views_collection = db.project_views
newsletter_collection = db.newsletter
settings_collection = db.settings
personal_info_collection = db.personal_info

async def init_database():
    """Initialize database with indexes and default data"""
    try:
        # Create indexes for better performance
        await users_collection.create_index([("email", ASCENDING)], unique=True)
        await contacts_collection.create_index([("created_at", DESCENDING)])
        await contacts_collection.create_index([("is_read", ASCENDING)])
        await skills_collection.create_index([("category", ASCENDING), ("order", ASCENDING)])
        await projects_collection.create_index([("featured", DESCENDING), ("order", ASCENDING)])
        await experience_collection.create_index([("order", ASCENDING)])
        await analytics_collection.create_index([("created_at", DESCENDING)])
        await analytics_collection.create_index([("visitor_id", ASCENDING)])
        await project_views_collection.create_index([("project_id", ASCENDING)])
        await newsletter_collection.create_index([("email", ASCENDING)], unique=True)
        await settings_collection.create_index([("key", ASCENDING)], unique=True)
        
        # Initialize default personal info if not exists
        existing_info = await personal_info_collection.find_one()
        if not existing_info:
            default_personal_info = {
                "name": "Emmanuel Tobi",
                "title": "Full Stack Developer",
                "tagline": "Building the future, one line of code at a time",
                "bio": "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies or contributing to open-source projects.",
                "location": "San Francisco, CA",
                "email": "emmanuel.tobi@example.com",
                "phone": "+1 (555) 123-4567",
                "linkedin": "https://linkedin.com/in/emmanueltobi",
                "github": "https://github.com/emmanueltobi",
                "website": "https://emmanueltobi.dev"
            }
            await personal_info_collection.insert_one(default_personal_info)
        
        # Initialize default site settings
        default_settings = [
            {"key": "site_title", "value": "Emmanuel Tobi - Full Stack Developer", "description": "Main site title"},
            {"key": "site_description", "value": "Professional portfolio of Emmanuel Tobi", "description": "Site meta description"},
            {"key": "email_notifications", "value": "true", "description": "Enable email notifications for contact form"},
            {"key": "analytics_enabled", "value": "true", "description": "Enable visitor analytics tracking"},
            {"key": "newsletter_enabled", "value": "true", "description": "Enable newsletter subscription"}
        ]
        
        for setting in default_settings:
            existing_setting = await settings_collection.find_one({"key": setting["key"]})
            if not existing_setting:
                await settings_collection.insert_one(setting)
        
        print("✅ Database initialized successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

async def get_collection_stats():
    """Get collection statistics for dashboard"""
    try:
        stats = {}
        
        # Get counts for each collection
        stats["users"] = await users_collection.count_documents({})
        stats["contacts"] = await contacts_collection.count_documents({})
        stats["skills"] = await skills_collection.count_documents({})
        stats["projects"] = await projects_collection.count_documents({})
        stats["experience"] = await experience_collection.count_documents({})
        stats["analytics"] = await analytics_collection.count_documents({})
        stats["project_views"] = await project_views_collection.count_documents({})
        stats["newsletter"] = await newsletter_collection.count_documents({})
        
        return stats
        
    except Exception as e:
        print(f"❌ Error getting collection stats: {e}")
        return {}

# Utility functions for database operations
async def get_paginated_results(collection, query={}, sort_field="created_at", sort_order=DESCENDING, page=1, limit=10):
    """Get paginated results from a collection"""
    try:
        skip = (page - 1) * limit
        
        # Get total count
        total = await collection.count_documents(query)
        
        # Get paginated results
        cursor = collection.find(query).sort(sort_field, sort_order).skip(skip).limit(limit)
        results = await cursor.to_list(length=limit)
        
        return {
            "items": results,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting paginated results: {e}")
        return {
            "items": [],
            "total": 0,
            "page": page,
            "pages": 0,
            "limit": limit
        }

async def close_database():
    """Close database connection"""
    client.close()