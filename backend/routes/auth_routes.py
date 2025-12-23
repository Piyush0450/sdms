from flask import Blueprint, request, jsonify
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Admin, Faculty, Student

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.post('/login')
def login():
    data = request.get_json() or {}
    role = data.get('role')
    uid = data.get('id')
    password = data.get('password')

    with SessionLocal() as db:
        if role == 'super_admin' or role == 'admin':
            q = select(Admin).where((Admin.admin_id==uid) | (Admin.username==uid))
            user = db.scalars(q).first()
            if user and user.password == password:
                eff_role = 'super_admin' if user.role == 'super_admin' else 'admin'
                return jsonify({'ok': True, 'role': eff_role, 'id': user.admin_id or user.username})
        elif role == 'faculty':
            q = select(Faculty).where(Faculty.faculty_id==uid)
            user = db.scalars(q).first()
            if user and user.password == password:
                return jsonify({'ok': True, 'role': 'faculty', 'id': user.faculty_id})
        elif role == 'student':
            q = select(Student).where(Student.student_id==uid)
            user = db.scalars(q).first()
            if user and user.password == password:
                return jsonify({'ok': True, 'role': 'student', 'id': user.student_id})

    return jsonify({'ok': False, 'error': 'Invalid credentials'}), 401
