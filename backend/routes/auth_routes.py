from flask import Blueprint, request, jsonify
from sqlalchemy import select
from database.connection import SessionLocal
# from models.user import Admin, Faculty, Student # Legacy imports removed

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.post('/login')
def login():
    try:
        data = request.get_json() or {}
        id_token = data.get('token')
       
        if not id_token:
             return jsonify({'ok': False, 'error': 'Missing Firebase token'}), 400

        # Verify Token
        from firebase.auth import verify_token
        decoded_token = verify_token(id_token)
        
        if not decoded_token:
            return jsonify({'ok': False, 'error': 'Invalid or expired token'}), 401
            
        email = decoded_token.get('email')
        if not email:
            return jsonify({'ok': False, 'error': 'Token does not contain email'}), 400
            
        print(f"Login attempt for email: {email}")

        with SessionLocal() as db:
            # Unified User Check
            from models.user import User
            user = db.scalars(select(User).where(User.email == email)).first()
            
            if user:
                return jsonify({'ok': True, 'role': user.role, 'id': user.related_id, 'email': user.email})

        return jsonify({'ok': False, 'error': 'Email not registered in SDMS. Contact admin.'}), 403

    except Exception as e:
        print(f"Auth Error: {e}")
        return jsonify({'ok': False, 'error': f"Server Error: {str(e)}"}), 500

@bp.post('/login/credentials')
def login_credentials():
    """Login using username and DOB (date of birth) as password"""
    try:
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')  # This will be DOB
        
        if not username or not password:
            return jsonify({'ok': False, 'error': 'Username and password are required'}), 400
        
        with SessionLocal() as db:
            from models.user import Admin, Faculty, Student, User
            
            # Try to find user in Admin table
            admin = db.scalars(select(Admin).where(Admin.username == username)).first()
            if admin and admin.dob == password:
                # Find corresponding User entry
                user = db.scalars(select(User).where(User.related_id == admin.admin_id)).first()
                if user:
                    return jsonify({
                        'ok': True, 
                        'role': user.role, 
                        'id': user.related_id, 
                        'email': user.email or f"{username}@sdms.local"
                    })
            
            # Try to find user in Faculty table
            faculty = db.scalars(select(Faculty).where(Faculty.faculty_uid == username)).first()
            if faculty and str(faculty.date_of_birth) == password:
                user = db.scalars(select(User).where(User.related_id == faculty.faculty_uid)).first()
                if user:
                    return jsonify({
                        'ok': True, 
                        'role': user.role, 
                        'id': user.related_id, 
                        'email': user.email or f"{username}@sdms.local"
                    })
            
            # Try to find user in Student table
            student = db.scalars(select(Student).where(Student.student_uid == username)).first()
            if student and str(student.date_of_birth) == password:
                user = db.scalars(select(User).where(User.related_id == student.student_uid)).first()
                if user:
                    return jsonify({
                        'ok': True, 
                        'role': user.role, 
                        'id': user.related_id, 
                        'email': user.email or f"{username}@sdms.local"
                    })
            
            return jsonify({'ok': False, 'error': 'Invalid username or password'}), 401
    
    except Exception as e:
        print(f"Credentials Auth Error: {e}")
        return jsonify({'ok': False, 'error': f"Server Error: {str(e)}"}), 500
