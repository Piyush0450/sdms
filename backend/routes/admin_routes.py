from flask import Blueprint, jsonify, request
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Admin, Faculty, Student
from utils.id_generator import next_id

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.get('/faculty')
def list_faculty():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Faculty)).all()
            return jsonify([{'faculty_id': r.faculty_id, 'name': r.name, 'department': r.department, 'subject': r.subject, 'dob': r.dob} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.post('/faculty')
def add_faculty():
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            existing = [x[0] for x in db.execute(select(Faculty.faculty_id)).all()]
            fid = next_id('F', existing)
            dob_val = data.get('dob','01/01/2000') # Default DOB
            f = Faculty(faculty_id=fid, name=data.get('name',''), department=data.get('department',''), subject=data.get('subject',''), dob=dob_val, password=dob_val)
            db.add(f); db.commit()
            return jsonify({'ok': True, 'faculty_id': fid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.get('/students')
def list_students():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Student)).all()
            return jsonify([{'student_id': r.student_id, 'name': r.name, 'roll_no': r.roll_no, 'department': r.department, 'semester': r.semester, 'dob': r.dob} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.post('/students')
def add_student():
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            existing = [x[0] for x in db.execute(select(Student.student_id)).all()]
            sid = next_id('S', existing)
            dob_val = data.get('dob','01/01/2000')
            s = Student(student_id=sid, name=data.get('name',''), roll_no=data.get('roll_no',''), department=data.get('department',''), semester=str(data.get('semester','')), dob=dob_val, password=dob_val)
            db.add(s); db.commit()
            return jsonify({'ok': True, 'student_id': sid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

# Super admin only
@bp.post('/admins')
def add_admin():
    try:
        data = request.get_json() or {}
        role = data.get('caller_role')
        if role != 'super_admin':
            return jsonify({'ok': False, 'error': 'Forbidden'}), 403
        with SessionLocal() as db:
            existing = [x[0] for x in db.execute(select(Admin.admin_id)).all() if x[0]]
            aid = next_id('A', existing)
            dob_val = data.get('dob','01/01/2000')
            a = Admin(admin_id=aid, name=data.get('name',''), username=data.get('username',''), dob=dob_val, role='admin', password=dob_val)
            db.add(a); db.commit()
            return jsonify({'ok': True, 'admin_id': aid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.get('/admins')
def list_admins():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Admin)).all()
            return jsonify([{'admin_id': r.admin_id, 'name': r.name, 'username': r.username, 'dob': r.dob} for r in rows if r.role != 'super_admin'])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
