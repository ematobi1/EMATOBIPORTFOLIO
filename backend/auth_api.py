from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer
from models import User, UserResponse, UserCreate, UserLogin, Token
from auth import create_user, login_user, get_current_user, get_admin_user
from database import users_collection

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """Register new user"""
    try:
        user = await create_user(user_data)
        # Remove password hash from response
        user_dict = user.dict()
        user_dict.pop("password_hash", None)
        return User(**user_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user"""
    try:
        token = await login_user(login_data)
        return token
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging in: {str(e)}")

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    try:
        # Remove password hash from response
        user_dict = current_user.dict()
        user_dict.pop("password_hash", None)
        return User(**user_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user info: {str(e)}")

@router.get("/users")
async def get_users(current_user: User = Depends(get_admin_user)):
    """Get all users (admin only)"""
    try:
        users_data = await users_collection.find({}).to_list(1000)
        users = []
        for user_data in users_data:
            user_dict = user_data.copy()
            user_dict.pop("password_hash", None)  # Remove password hash
            users.append(User(**user_dict))
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    update_data: dict,
    current_user: User = Depends(get_admin_user)
):
    """Update user (admin only)"""
    try:
        # Remove sensitive fields that shouldn't be updated directly
        update_data.pop("password_hash", None)
        update_data.pop("id", None)
        
        if update_data:
            await users_collection.update_one(
                {"id": user_id},
                {"$set": update_data}
            )
        
        user_data = await users_collection.find_one({"id": user_id})
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_dict = user_data.copy()
        user_dict.pop("password_hash", None)
        return User(**user_dict)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_admin_user)
):
    """Delete user (admin only)"""
    try:
        # Prevent admin from deleting themselves
        if user_id == current_user.id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
        result = await users_collection.delete_one({"id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")

@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user)
):
    """Change user password"""
    try:
        from auth import AuthService, authenticate_user
        
        # Verify current password
        authenticated_user = await authenticate_user(current_user.email, current_password)
        if not authenticated_user:
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password
        new_password_hash = AuthService.hash_password(new_password)
        
        # Update password
        await users_collection.update_one(
            {"id": current_user.id},
            {"$set": {"password_hash": new_password_hash}}
        )
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error changing password: {str(e)}")

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (invalidate token on client side)"""
    try:
        # In a real application, you might want to maintain a blacklist of tokens
        # For now, we'll just return a success message
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging out: {str(e)}")

@router.get("/check-admin")
async def check_admin_status(current_user: User = Depends(get_current_user)):
    """Check if current user is admin"""
    try:
        return {
            "is_admin": current_user.role == "admin",
            "role": current_user.role,
            "email": current_user.email
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking admin status: {str(e)}")