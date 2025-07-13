from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List, Optional
from models import *
from database import *
from auth import get_admin_user, get_current_user
from email_service import email_service
import asyncio

router = APIRouter(prefix="/api", tags=["portfolio"])

# Contact Form Endpoints
@router.post("/contact", response_model=ContactSubmission)
async def submit_contact_form(
    contact_data: ContactSubmissionCreate,
    request: Request
):
    """Submit contact form"""
    try:
        # Get client info
        user_agent = request.headers.get("user-agent")
        ip_address = request.client.host
        
        # Create contact submission
        contact = ContactSubmission(
            **contact_data.dict(),
            user_agent=user_agent,
            ip_address=ip_address
        )
        
        # Save to database
        await contacts_collection.insert_one(contact.dict())
        
        # Send emails asynchronously
        asyncio.create_task(email_service.send_contact_notification(contact))
        asyncio.create_task(email_service.send_welcome_email(contact))
        
        return contact
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting contact form: {str(e)}")

@router.get("/contacts", response_model=List[ContactSubmission])
async def get_contacts(
    page: int = 1,
    limit: int = 10,
    is_read: Optional[bool] = None,
    current_user: User = Depends(get_admin_user)
):
    """Get contact submissions (admin only)"""
    try:
        query = {}
        if is_read is not None:
            query["is_read"] = is_read
        
        result = await get_paginated_results(
            contacts_collection,
            query=query,
            page=page,
            limit=limit
        )
        
        return [ContactSubmission(**item) for item in result["items"]]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contacts: {str(e)}")

@router.put("/contacts/{contact_id}", response_model=ContactSubmission)
async def update_contact(
    contact_id: str,
    update_data: ContactSubmissionUpdate,
    current_user: User = Depends(get_admin_user)
):
    """Update contact submission (admin only)"""
    try:
        # Update contact
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        if update_dict:
            await contacts_collection.update_one(
                {"id": contact_id},
                {"$set": update_dict}
            )
        
        # Get updated contact
        contact_data = await contacts_collection.find_one({"id": contact_id})
        if not contact_data:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return ContactSubmission(**contact_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating contact: {str(e)}")

# Portfolio Content Endpoints
@router.get("/personal-info", response_model=PersonalInfo)
async def get_personal_info():
    """Get personal information"""
    try:
        info = await personal_info_collection.find_one()
        if not info:
            raise HTTPException(status_code=404, detail="Personal info not found")
        return PersonalInfo(**info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching personal info: {str(e)}")

@router.put("/personal-info", response_model=PersonalInfo)
async def update_personal_info(
    update_data: PersonalInfoUpdate,
    current_user: User = Depends(get_admin_user)
):
    """Update personal information (admin only)"""
    try:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            await personal_info_collection.update_one(
                {},
                {"$set": update_dict},
                upsert=True
            )
        
        info = await personal_info_collection.find_one()
        return PersonalInfo(**info)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating personal info: {str(e)}")

@router.get("/skills", response_model=List[Skill])
async def get_skills(category: Optional[str] = None):
    """Get skills"""
    try:
        query = {"is_active": True}
        if category:
            query["category"] = category
        
        skills_data = await skills_collection.find(query).sort("order", 1).to_list(1000)
        return [Skill(**skill) for skill in skills_data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching skills: {str(e)}")

@router.post("/skills", response_model=Skill)
async def create_skill(
    skill_data: SkillCreate,
    current_user: User = Depends(get_admin_user)
):
    """Create skill (admin only)"""
    try:
        skill = Skill(**skill_data.dict())
        await skills_collection.insert_one(skill.dict())
        return skill
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating skill: {str(e)}")

@router.put("/skills/{skill_id}", response_model=Skill)
async def update_skill(
    skill_id: str,
    skill_data: SkillCreate,
    current_user: User = Depends(get_admin_user)
):
    """Update skill (admin only)"""
    try:
        await skills_collection.update_one(
            {"id": skill_id},
            {"$set": skill_data.dict()}
        )
        
        skill_data = await skills_collection.find_one({"id": skill_id})
        if not skill_data:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        return Skill(**skill_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating skill: {str(e)}")

@router.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user: User = Depends(get_admin_user)
):
    """Delete skill (admin only)"""
    try:
        result = await skills_collection.delete_one({"id": skill_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        return {"message": "Skill deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting skill: {str(e)}")

@router.get("/projects", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None):
    """Get projects"""
    try:
        query = {"is_active": True}
        if featured is not None:
            query["featured"] = featured
        
        projects_data = await projects_collection.find(query).sort("order", 1).to_list(1000)
        return [Project(**project) for project in projects_data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

@router.post("/projects", response_model=Project)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_admin_user)
):
    """Create project (admin only)"""
    try:
        project = Project(**project_data.dict())
        await projects_collection.insert_one(project.dict())
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_data: ProjectCreate,
    current_user: User = Depends(get_admin_user)
):
    """Update project (admin only)"""
    try:
        await projects_collection.update_one(
            {"id": project_id},
            {"$set": project_data.dict()}
        )
        
        project_data = await projects_collection.find_one({"id": project_id})
        if not project_data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return Project(**project_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating project: {str(e)}")

@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_admin_user)
):
    """Delete project (admin only)"""
    try:
        result = await projects_collection.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting project: {str(e)}")

@router.get("/experience", response_model=List[Experience])
async def get_experience():
    """Get work experience"""
    try:
        experience_data = await experience_collection.find({"is_active": True}).sort("order", 1).to_list(1000)
        return [Experience(**exp) for exp in experience_data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching experience: {str(e)}")

@router.post("/experience", response_model=Experience)
async def create_experience(
    experience_data: ExperienceCreate,
    current_user: User = Depends(get_admin_user)
):
    """Create experience (admin only)"""
    try:
        experience = Experience(**experience_data.dict())
        await experience_collection.insert_one(experience.dict())
        return experience
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating experience: {str(e)}")

@router.put("/experience/{experience_id}", response_model=Experience)
async def update_experience(
    experience_id: str,
    experience_data: ExperienceCreate,
    current_user: User = Depends(get_admin_user)
):
    """Update experience (admin only)"""
    try:
        await experience_collection.update_one(
            {"id": experience_id},
            {"$set": experience_data.dict()}
        )
        
        exp_data = await experience_collection.find_one({"id": experience_id})
        if not exp_data:
            raise HTTPException(status_code=404, detail="Experience not found")
        
        return Experience(**exp_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating experience: {str(e)}")

@router.delete("/experience/{experience_id}")
async def delete_experience(
    experience_id: str,
    current_user: User = Depends(get_admin_user)
):
    """Delete experience (admin only)"""
    try:
        result = await experience_collection.delete_one({"id": experience_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Experience not found")
        return {"message": "Experience deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting experience: {str(e)}")

# Newsletter Endpoints
@router.post("/newsletter/subscribe")
async def subscribe_newsletter(subscription_data: NewsletterSubscriptionCreate):
    """Subscribe to newsletter"""
    try:
        # Check if already subscribed
        existing = await newsletter_collection.find_one({"email": subscription_data.email})
        if existing:
            if existing.get("is_confirmed"):
                raise HTTPException(status_code=400, detail="Email already subscribed")
            else:
                # Resend confirmation email
                confirmation_token = existing.get("confirmation_token")
                asyncio.create_task(email_service.send_newsletter_confirmation(
                    subscription_data.email,
                    subscription_data.name,
                    confirmation_token
                ))
                return {"message": "Confirmation email resent"}
        
        # Create new subscription
        subscription = NewsletterSubscription(
            **subscription_data.dict(),
            confirmation_token=str(uuid.uuid4())
        )
        
        await newsletter_collection.insert_one(subscription.dict())
        
        # Send confirmation email
        asyncio.create_task(email_service.send_newsletter_confirmation(
            subscription.email,
            subscription.name,
            subscription.confirmation_token
        ))
        
        return {"message": "Please check your email to confirm subscription"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subscribing to newsletter: {str(e)}")

@router.get("/newsletter/confirm")
async def confirm_newsletter_subscription(token: str):
    """Confirm newsletter subscription"""
    try:
        # Find subscription by token
        subscription = await newsletter_collection.find_one({"confirmation_token": token})
        if not subscription:
            raise HTTPException(status_code=404, detail="Invalid confirmation token")
        
        # Update subscription
        await newsletter_collection.update_one(
            {"confirmation_token": token},
            {"$set": {
                "is_confirmed": True,
                "confirmed_at": datetime.utcnow(),
                "confirmation_token": None
            }}
        )
        
        return {"message": "Newsletter subscription confirmed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error confirming subscription: {str(e)}")

@router.get("/newsletter/unsubscribe")
async def unsubscribe_newsletter(token: str):
    """Unsubscribe from newsletter"""
    try:
        # Find subscription by unsubscribe token
        result = await newsletter_collection.update_one(
            {"unsubscribe_token": token},
            {"$set": {"is_active": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Invalid unsubscribe token")
        
        return {"message": "Successfully unsubscribed from newsletter"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error unsubscribing: {str(e)}")

# Analytics Endpoints
@router.post("/analytics/visit")
async def track_visit(
    analytics_data: VisitorAnalyticsCreate,
    request: Request
):
    """Track visitor analytics"""
    try:
        # Check if analytics are enabled
        setting = await settings_collection.find_one({"key": "analytics_enabled"})
        if not setting or setting.get("value") != "true":
            return {"message": "Analytics tracking disabled"}
        
        # Get client info and update the data
        analytics_dict = analytics_data.dict()
        analytics_dict["user_agent"] = request.headers.get("user-agent")
        analytics_dict["ip_address"] = request.client.host
        
        # Create analytics entry
        analytics = VisitorAnalytics(**analytics_dict)
        
        await analytics_collection.insert_one(analytics.dict())
        return {"message": "Visit tracked successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error tracking visit: {str(e)}")

@router.post("/analytics/project-view")
async def track_project_view(
    view_data: ProjectViewCreate,
    request: Request
):
    """Track project view"""
    try:
        # Check if analytics are enabled
        setting = await settings_collection.find_one({"key": "analytics_enabled"})
        if not setting or setting.get("value") != "true":
            return {"message": "Analytics tracking disabled"}
        
        # Get client info and update the data
        view_dict = view_data.dict()
        view_dict["user_agent"] = request.headers.get("user-agent")
        view_dict["ip_address"] = request.client.host
        
        # Create project view entry
        project_view = ProjectView(**view_dict)
        
        await project_views_collection.insert_one(project_view.dict())
        return {"message": "Project view tracked successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error tracking project view: {str(e)}")

@router.get("/analytics/dashboard", response_model=DashboardStats)
async def get_dashboard_analytics(current_user: User = Depends(get_admin_user)):
    """Get dashboard analytics (admin only)"""
    try:
        # Get basic counts
        total_visitors = await analytics_collection.distinct("visitor_id")
        total_contacts = await contacts_collection.count_documents({})
        total_projects = await projects_collection.count_documents({"is_active": True})
        total_newsletter_subscribers = await newsletter_collection.count_documents({"is_confirmed": True})
        
        # Get recent contacts
        recent_contacts_data = await contacts_collection.find({}).sort("created_at", -1).limit(5).to_list(5)
        recent_contacts = [ContactSubmission(**contact) for contact in recent_contacts_data]
        
        # Get popular projects
        popular_projects_pipeline = [
            {"$group": {"_id": "$project_id", "views": {"$sum": 1}}},
            {"$sort": {"views": -1}},
            {"$limit": 5}
        ]
        popular_projects_data = await project_views_collection.aggregate(popular_projects_pipeline).to_list(5)
        
        # Get visitor analytics by day (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        visitor_analytics_pipeline = [
            {"$match": {"created_at": {"$gte": thirty_days_ago}}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "visits": {"$sum": 1},
                "unique_visitors": {"$addToSet": "$visitor_id"}
            }},
            {"$project": {
                "_id": 0,
                "date": "$_id",
                "visits": 1,
                "unique_visitors": {"$size": "$unique_visitors"}
            }},
            {"$sort": {"date": 1}}
        ]
        visitor_analytics_data = await analytics_collection.aggregate(visitor_analytics_pipeline).to_list(30)
        
        return DashboardStats(
            total_visitors=len(total_visitors),
            total_contacts=total_contacts,
            total_projects=total_projects,
            total_newsletter_subscribers=total_newsletter_subscribers,
            recent_contacts=recent_contacts,
            popular_projects=popular_projects_data,
            visitor_analytics=visitor_analytics_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard analytics: {str(e)}")

@router.get("/analytics/contacts", response_model=ContactStats)
async def get_contact_analytics(current_user: User = Depends(get_admin_user)):
    """Get contact analytics (admin only)"""
    try:
        total_submissions = await contacts_collection.count_documents({})
        unread_submissions = await contacts_collection.count_documents({"is_read": False})
        replied_submissions = await contacts_collection.count_documents({"is_replied": True})
        
        # Get recent submissions
        recent_submissions_data = await contacts_collection.find({}).sort("created_at", -1).limit(10).to_list(10)
        recent_submissions = [ContactSubmission(**contact) for contact in recent_submissions_data]
        
        # Get submissions by month (last 12 months)
        from datetime import datetime, timedelta
        twelve_months_ago = datetime.utcnow() - timedelta(days=365)
        
        submissions_by_month_pipeline = [
            {"$match": {"created_at": {"$gte": twelve_months_ago}}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"}
                },
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]
        submissions_by_month_data = await contacts_collection.aggregate(submissions_by_month_pipeline).to_list(12)
        
        return ContactStats(
            total_submissions=total_submissions,
            unread_submissions=unread_submissions,
            replied_submissions=replied_submissions,
            recent_submissions=recent_submissions,
            submissions_by_month=submissions_by_month_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contact analytics: {str(e)}")

@router.get("/settings")
async def get_settings(current_user: User = Depends(get_admin_user)):
    """Get site settings (admin only)"""
    try:
        settings = await settings_collection.find({}).to_list(1000)
        return [SiteSettings(**setting) for setting in settings]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching settings: {str(e)}")

@router.put("/settings/{key}")
async def update_setting(
    key: str,
    value: str,
    current_user: User = Depends(get_admin_user)
):
    """Update site setting (admin only)"""
    try:
        await settings_collection.update_one(
            {"key": key},
            {"$set": {"value": value, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        return {"message": "Setting updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating setting: {str(e)}")