from flask import Blueprint, jsonify, request
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Attendance, Result, Student

bp = Blueprint('faculty', __name__, url_prefix='/api/faculty')

@bp.post('/attendance')
def mark_attendance():
    data = request.get_json() or {}
    subject = data.get('subject')
    date = data.get('date')
    status_map = data.get('statusMap', {})

    with SessionLocal() as db:
        for sid, status in status_map.items():
            db.add(Attendance(student_id=sid, subject=subject, date=date, status=status))
        db.commit()
    return jsonify({'ok': True})

@bp.post('/results')
def save_results():
    data = request.get_json() or {}
    subject = data.get('subject')
    exam_type = data.get('examType')
    marks_map = data.get('marksMap', {})

    with SessionLocal() as db:
        for sid, marks in marks_map.items():
            db.add(Result(student_id=sid, subject=subject, exam_type=exam_type, marks=str(marks)))
        db.commit()
    return jsonify({'ok': True})
