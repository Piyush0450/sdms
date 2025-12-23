from flask import Blueprint, jsonify, request
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Admin, Faculty, Student
from utils.id_generator import next_id

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.get('/faculty')
def list_faculty():
    with SessionLocal() as db:
        rows = db.scalars(select(Faculty)).all()
        return jsonify([{'faculty_id': r.faculty_id, 'name': r.name, 'department': r.department, 'subject': r.subject} for r in rows])

@bp.post('/faculty')
def add_faculty():
    data = request.get_json() or {}
    with SessionLocal() as db:
        existing = [x[0] for x in db.execute(select(Faculty.faculty_id)).all()]
        fid = next_id('F', existing)
        f = Faculty(faculty_id=fid, name=data.get('name',''), department=data.get('department',''), subject=data.get('subject',''), dob=data.get('dob',''), password=data.get('dob',''))
        db.add(f); db.commit()
        return jsonify({'ok': True, 'faculty_id': fid})

@bp.get('/students')
def list_students():
    with SessionLocal() as db:
        rows = db.scalars(select(Student)).all()
        return jsonify([{'student_id': r.student_id, 'name': r.name, 'roll_no': r.roll_no, 'department': r.department, 'semester': r.semester} for r in rows])

@bp.post('/students')
def add_student():
    data = request.get_json() or {}
    with SessionLocal() as db:
        existing = [x[0] for x in db.execute(select(Student.student_id)).all()]
        sid = next_id('S', existing)
        s = Student(student_id=sid, name=data.get('name',''), roll_no=data.get('roll_no',''), department=data.get('department',''), semester=str(data.get('semester','')), dob=data.get('dob',''), password=data.get('dob',''))
        db.add(s); db.commit()
        return jsonify({'ok': True, 'student_id': sid})

# Super admin only
@bp.post('/admins')
def add_admin():
    data = request.get_json() or {}
    role = data.get('caller_role')
    if role != 'super_admin':
        return jsonify({'ok': False, 'error': 'Forbidden'}), 403
    with SessionLocal() as db:
        existing = [x[0] for x in db.execute(select(Admin.admin_id)).all() if x[0]]
        aid = next_id('A', existing)
        a = Admin(admin_id=aid, name=data.get('name',''), username=data.get('username',''), dob=data.get('dob',''), role='admin', password=data.get('dob',''))
        db.add(a); db.commit()
        return jsonify({'ok': True, 'admin_id': aid})
