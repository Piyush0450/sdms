from flask import Blueprint, jsonify
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Student
from models.academic import Attendance, Result, Subject

bp = Blueprint('student', __name__, url_prefix='/api/student')

@bp.get('/<sid>/profile')
def profile(sid):
    try:
        with SessionLocal() as db:
            s = db.scalars(select(Student).where(Student.student_id==sid)).first()
            if not s: return jsonify({}), 404
            return jsonify({'student_id': s.student_id, 'name': s.name, 'roll_no': s.roll_no, 'department': s.department, 'semester': s.semester, 'dob': s.dob})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/<sid>/attendance')
def attendance(sid):
    try:
        with SessionLocal() as db:
            # Join with Student and Subject to filter by S-ID and get Subject Name
            rows = db.scalars(
                select(Attendance)
                .join(Attendance.student)
                .join(Attendance.subject)
                .where(Student.student_id == sid)
                .order_by(Attendance.date.desc())
            ).all()
            return jsonify([{'student_id': r.student.student_id, 'subject': r.subject.name, 'date': r.date, 'status': r.status} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/<sid>/results')
def results(sid):
    try:
        with SessionLocal() as db:
            rows = db.scalars(
                select(Result)
                .join(Result.student)
                .join(Result.subject)
                .where(Student.student_id == sid)
            ).all()
            return jsonify([{'student_id': r.student.student_id, 'subject': r.subject.name, 'exam_type': r.exam_type, 'marks': r.marks_obtained, 'total': r.total_marks} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
