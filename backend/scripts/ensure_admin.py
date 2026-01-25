"""
Simple script to add a super admin user for Firebase authentication.
This runs on every deployment to ensure the admin user exists.
"""
from database.connection import Base, engine, SessionLocal
from models.user import User, Admin
from sqlalchemy import select

def ensure_admin_user():
    """Ensure the super admin user exists in the database."""
    
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as db:
        # Check if super admin user already exists
        existing_user = db.scalars(
            select(User).where(User.email == "piyushchaurasiya348@gmail.com")
        ).first()
        
        if existing_user:
            print("✅ Super admin user already exists")
            return
        
        # Check if admin record exists
        existing_admin = db.scalars(
            select(Admin).where(Admin.admin_id == "A_001")
        ).first()
        
        if not existing_admin:
            # Create admin record
            admin = Admin(
                admin_id="A_001",
                name="Super Admin",
                username="admin",
                role="super_admin",
                dob="01/01/2000",
                email="piyushchaurasiya348@gmail.com"
            )
            db.add(admin)
            db.flush()
            print("✅ Created Admin record")
        
        # Create user record for Firebase auth
        user = User(
            email="piyushchaurasiya348@gmail.com",
            role="super_admin",
            related_id="A_001"
        )
        db.add(user)
        db.commit()
        print("✅ Created User record for Firebase authentication")
        print("   📧 Email: piyushchaurasiya348@gmail.com")

if __name__ == "__main__":
    ensure_admin_user()
