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

        return jsonify({'ok': False, 'error': 'Email not registered in SDMS. Contact admin.'}), 403

    except Exception as e:
        print(f"Auth Error: {e}")
        return jsonify({'ok': False, 'error': f"Server Error: {str(e)}"}), 500
