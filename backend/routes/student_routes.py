from flask import Blueprint, jsonify
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Student
from models.academic import Subject
from models.activity import Attendance, Mark as Result

bp = Blueprint('student', __name__, url_prefix='/api/student')


@bp.get('/<string:student_uid>')
def get_student_profile(student_uid):
    with SessionLocal() as db:
        # Fetch by student_uid string
        student = db.scalars(select(Student).where(Student.student_uid == student_uid)).first()
        
        if not student:
            return jsonify({'ok': False, 'error': 'Student not found'}), 404
        
        # Get related info
        class_name = student.assigned_class.class_name if student.assigned_class else "N/A"
        class_teacher = "N/A"
        if student.assigned_class and student.assigned_class.class_teacher:
            class_teacher = student.assigned_class.class_teacher.name
            
        return jsonify({
            'ok': True,
            'data': {
                'name': student.name,
                'student_id': student.student_uid, # Return the UID as the ID
                'email': student.email,
                'class_name': class_name,
                'class_teacher': class_teacher
            }
        })

@bp.get('/<string:student_uid>/attendance')
def attendance(student_uid):
    try:
        with SessionLocal() as db:
            # Join with Student and Subject to filter by S-ID and get Subject Name
            rows = db.scalars(
                select(Attendance)
                .join(Attendance.student)
                .join(Attendance.subject)
                .where(Student.student_uid == student_uid) # Filter by UID
                .order_by(Attendance.attendance_date.desc())
            ).all()
            return jsonify([{'student_id': r.student.student_uid, 'subject': r.subject.subject_name, 'date': r.attendance_date, 'status': r.status} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/<string:student_uid>/results')
def results(student_uid):
    try:
        with SessionLocal() as db:
            rows = db.scalars(
                select(Result)
                .join(Result.student)
                .join(Result.subject)
                .where(Student.student_uid == student_uid) # Filter by UID
            ).all()
            return jsonify([{'student_id': r.student.student_uid, 'subject': r.subject.subject_name, 'exam_type': r.exam_type, 'marks': r.marks_obtained, 'total': r.max_marks} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
