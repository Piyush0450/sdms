from flask import Blueprint, jsonify
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Student, Attendance, Result

bp = Blueprint('student', __name__, url_prefix='/api/student')

@bp.get('/<sid>/profile')
def profile(sid):
    with SessionLocal() as db:
        s = db.scalars(select(Student).where(Student.student_id==sid)).first()
        if not s: return jsonify({}), 404
        return jsonify({'student_id': s.student_id, 'name': s.name, 'roll_no': s.roll_no, 'department': s.department, 'semester': s.semester, 'dob': s.dob})

@bp.get('/<sid>/attendance')
def attendance(sid):
    with SessionLocal() as db:
        rows = db.scalars(select(Attendance).where(Attendance.student_id==sid)).all()
        return jsonify([{'student_id': r.student_id, 'subject': r.subject, 'date': r.date, 'status': r.status} for r in rows])

@bp.get('/<sid>/results')
def results(sid):
    with SessionLocal() as db:
        rows = db.scalars(select(Result).where(Result.student_id==sid)).all()
        return jsonify([{'student_id': r.student_id, 'subject': r.subject, 'exam_type': r.exam_type, 'marks': r.marks} for r in rows])
