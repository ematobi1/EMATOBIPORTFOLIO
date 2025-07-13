from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

# User Authentication Models
class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.USER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Contact Form Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    phone: Optional[str] = None
    company: Optional[str] = None
    project_type: Optional[str] = None
    budget: Optional[str] = None
    is_read: bool = False
    is_replied: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    phone: Optional[str] = None
    company: Optional[str] = None
    project_type: Optional[str] = None
    budget: Optional[str] = None

class ContactSubmissionUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_replied: Optional[bool] = None

# Portfolio Content Models
class Skill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    level: int = Field(ge=0, le=100)
    category: str  # frontend, backend, tools
    icon: str
    description: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SkillCreate(BaseModel):
    name: str
    level: int = Field(ge=0, le=100)
    category: str
    icon: str
    description: Optional[str] = None
    order: int = 0

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    tech: List[str]
    image: str
    github: Optional[str] = None
    demo: Optional[str] = None
    featured: bool = False
    status: str = "completed"  # completed, in_progress, planned
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    client: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    tech: List[str]
    image: str
    github: Optional[str] = None
    demo: Optional[str] = None
    featured: bool = False
    status: str = "completed"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    client: Optional[str] = None
    order: int = 0

class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str
    position: str
    duration: str
    description: str
    achievements: List[str]
    tech: List[str]
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    company_url: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExperienceCreate(BaseModel):
    company: str
    position: str
    duration: str
    description: str
    achievements: List[str]
    tech: List[str]
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    company_url: Optional[str] = None
    order: int = 0

# Analytics Models
class VisitorAnalytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    visitor_id: str
    page: str
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    referrer: Optional[str] = None
    session_id: Optional[str] = None
    time_spent: Optional[int] = None  # in seconds
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VisitorAnalyticsCreate(BaseModel):
    visitor_id: str
    page: str
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    referrer: Optional[str] = None
    session_id: Optional[str] = None
    time_spent: Optional[int] = None

class ProjectView(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    visitor_id: str
    action: str  # view, demo_click, github_click
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectViewCreate(BaseModel):
    project_id: str
    visitor_id: str
    action: str
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

# Newsletter Models
class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = None
    is_active: bool = True
    is_confirmed: bool = False
    confirmation_token: Optional[str] = None
    unsubscribe_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    confirmed_at: Optional[datetime] = None

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# Settings Models
class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: str
    description: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PersonalInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    tagline: str
    bio: str
    location: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    resume_url: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    resume_url: Optional[str] = None

# Dashboard Analytics Response Models
class DashboardStats(BaseModel):
    total_visitors: int
    total_contacts: int
    total_projects: int
    total_newsletter_subscribers: int
    recent_contacts: List[ContactSubmission]
    popular_projects: List[Dict[str, Any]]
    visitor_analytics: List[Dict[str, Any]]

class ContactStats(BaseModel):
    total_submissions: int
    unread_submissions: int
    replied_submissions: int
    recent_submissions: List[ContactSubmission]
    submissions_by_month: List[Dict[str, Any]]