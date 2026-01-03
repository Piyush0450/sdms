from flask import Blueprint, jsonify, request
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Student
from models.academic import Attendance, Result, Subject

bp = Blueprint('faculty', __name__, url_prefix='/api/faculty')

@bp.post('/attendance')
def mark_attendance():
    try:
        data = request.get_json() or {}
        subject = data.get('subject')
        date = data.get('date')
        status_map = data.get('statusMap', {})

        if not subject or not date:
             return jsonify({'ok': False, 'error': 'Subject and Date are required'}), 400

        with SessionLocal() as db:
            # Resolve Subject (Auto-create for demo resilience if missing, ideally strictly managed)
            sub_obj = db.scalars(select(Subject).where(Subject.name == subject)).first()
            if not sub_obj:
                sub_obj = Subject(name=subject, code=subject[:3].upper()) # Dummy code
                db.add(sub_obj)
                db.flush()

            for sid, status in status_map.items():
                # Resolve Student PK
                stu_obj = db.scalars(select(Student).where(Student.student_id == sid)).first()
                if stu_obj:
                    # Check existing
                    existing = db.scalars(select(Attendance).where(
                        Attendance.student_id == stu_obj.id,
                        Attendance.subject_id == sub_obj.id,
                        Attendance.date == date
                    )).first()
                    
                    if existing:
                        existing.status = status
                    else:
                        db.add(Attendance(student_id=stu_obj.id, subject_id=sub_obj.id, date=date, status=status))
            db.commit()
        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.post('/results')
def save_results():
    try:
        data = request.get_json() or {}
        subject = data.get('subject')
        exam_type = data.get('examType')
        marks_map = data.get('marksMap', {})

        if not subject or not exam_type:
            return jsonify({'ok': False, 'error': 'Subject and Exam Type are required'}), 400

        with SessionLocal() as db:
            # Resolve Subject
            sub_obj = db.scalars(select(Subject).where(Subject.name == subject)).first()
            if not sub_obj:
                sub_obj = Subject(name=subject, code=subject[:3].upper())
                db.add(sub_obj)
                db.flush()

            for sid, marks in marks_map.items():
                # Resolve Student
                stu_obj = db.scalars(select(Student).where(Student.student_id == sid)).first()
                if stu_obj:
                    # Assuming exam_type is passed, marks is string in payload but Float in DB
                    try:
                        m_val = float(marks)
                    except:
                        m_val = 0.0
                    
                    # Check existing result
                    existing = db.scalars(select(Result).where(
                        Result.student_id == stu_obj.id,
                        Result.subject_id == sub_obj.id,
                        Result.exam_type == exam_type
                    )).first()

                    if existing:
                        existing.marks_obtained = m_val
                    else:
                        db.add(Result(student_id=stu_obj.id, subject_id=sub_obj.id, exam_type=exam_type, marks_obtained=m_val, total_marks=100.0))
            db.commit()
        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500
