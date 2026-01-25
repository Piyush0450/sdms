from flask import Blueprint, jsonify, request
from sqlalchemy import select, func, case
from database.connection import SessionLocal
from models.user import Student, Faculty, Admin, Librarian
from models.academic import Class, Subject, SubjectAllocation
from models.activity import Attendance, Mark as Result
from models.library import BookIssue
from datetime import date, datetime

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.get('/student/<string:student_uid>/stats')
def student_stats(student_uid):
    try:
        with SessionLocal() as db:
            student = db.scalars(select(Student).where(Student.student_uid == student_uid)).first()
            if not student:
                return jsonify({'error': 'Student not found'}), 404
            
            # 1. Overall Attendance %
            total_days = db.scalar(select(func.count(Attendance.attendance_id)).where(Attendance.student_id == student.student_id))
            present_days = db.scalar(select(func.count(Attendance.attendance_id)).where(Attendance.student_id == student.student_id, Attendance.status == 'Present'))
            
            attendance_pct = 0
            if total_days and total_days > 0:
                attendance_pct = round((present_days / total_days) * 100, 1)

            # 2. Avg Marks
            avg_marks = db.scalar(select(func.avg(Result.marks_obtained)).where(Result.student_id == student.student_id))
            avg_marks = round(avg_marks, 1) if avg_marks else 0

            # 3. Recent Attendance (Last 7 records)
            recent_att = db.scalars(
                select(Attendance).where(Attendance.student_id == student.student_id).order_by(Attendance.attendance_date.desc()).limit(7)
            ).all()
            # Reverse to show chronological in graph
            recent_att_data = [{'date': str(r.attendance_date), 'status': r.status} for r in reversed(recent_att)]

            return jsonify({
                'attendance_percentage': attendance_pct,
                'avg_marks': avg_marks,
                'recent_attendance': recent_att_data,
                'total_exams': db.scalar(select(func.count(Result.mark_id)).where(Result.student_id == student.student_id))
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/stats')
def get_stats():
    try:
        with SessionLocal() as db:
            counts = {}
            # Admin count
            counts['admin'] = db.query(Admin).count()
            
            # Faculty count
            counts['faculty'] = db.query(Faculty).count()
            
            # Student count
            counts['student'] = db.query(Student).count()
            
            # Class count
            counts['class'] = db.query(Class).count()

            return jsonify({'ok': True, 'data': counts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/faculty/<string:f_uid>/stats') # Use string UID
def faculty_stats(f_uid):
    try:
        with SessionLocal() as db:
            faculty = db.scalars(select(Faculty).where(Faculty.faculty_uid == f_uid)).first()
            if not faculty:
                return jsonify({'error': 'Faculty not found'}), 404

            # 1. Total Students taught (via SubjectAllocation -> Class -> Students)
            # Find allocations for this faculty
            allocations = db.scalars(select(SubjectAllocation).where(SubjectAllocation.teacher_id == faculty.faculty_id)).all() # Field in allocation is still teacher_id (FK to faculty)
            class_ids = [a.class_id for a in allocations]
            
            total_students = 0
            if class_ids:
                total_students = db.query(Student).filter(Student.class_id.in_(class_ids)).count()

            # 3. Class Performance (Avg marks per class he teaches)
            class_performance = []
            for alloc in allocations:
                # Get class name
                cls = db.scalars(select(Class).where(Class.class_id == alloc.class_id)).first()
                sub = db.scalars(select(Subject).where(Subject.subject_id == alloc.subject_id)).first()
                
                if cls and sub:
                    # Avg marks for this subject in this class
                    avg = db.scalar(
                        select(func.avg(Result.marks_obtained))
                        .join(Student)
                        .where(Student.class_id == cls.class_id, Result.subject_id == sub.subject_id)
                    )
                    class_performance.append({
                        'class': f"{cls.class_name}",
                        'subject': sub.subject_name,
                        'avg_marks': round(avg, 1) if avg else 0
                    })

            return jsonify({
                'total_students': total_students,
                'classes_count': len(allocations),
                'class_performance': class_performance
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/admin/stats')
def admin_stats():
    try:
        with SessionLocal() as db:
            total_students = db.scalar(select(func.count(Student.student_id))) or 0
            total_teachers = db.scalar(select(func.count(Faculty.faculty_id))) or 0
            
            # Attendance Overview 
            present = db.scalar(select(func.count(Attendance.attendance_id)).where(Attendance.status == 'Present')) or 0
            absent = db.scalar(select(func.count(Attendance.attendance_id)).where(Attendance.status == 'Absent')) or 0
            total_att = present + absent
            
            att_rate = 0
            if total_att > 0:
                att_rate = round((present / total_att) * 100, 1)

            # Enrollment Growth 
            growth_data = [] # Simplify for now
            return jsonify({
                'total_students': total_students,
                'total_teachers': total_teachers,
                'attendance_rate': att_rate,
                'attendance_distribution': [
                    {'name': 'Present', 'value': present},
                    {'name': 'Absent', 'value': absent}
                ],
                'enrollment_growth': growth_data
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/librarian/<string:librarian_uid>/stats')
def librarian_stats(librarian_uid):
    try:
        with SessionLocal() as db:
            librarian = db.scalars(select(Librarian).where(Librarian.librarian_uid == librarian_uid)).first()
            if not librarian:
                return jsonify({'error': 'Librarian not found'}), 404
            
            # Total books issued
            total_issued = db.scalar(select(func.count(BookIssue.issue_id)).where(BookIssue.status == 'Issued')) or 0
            
            # Total books returned
            total_returned = db.scalar(select(func.count(BookIssue.issue_id)).where(BookIssue.status == 'Returned')) or 0
            
            # Overdue books and total fines
            today = date.today()
            all_issues = db.query(BookIssue).filter(BookIssue.status == 'Issued').all()
            
            overdue_count = 0
            total_fines = 0
            
            for issue in all_issues:
                if issue.due_date:
                    if isinstance(issue.due_date, str):
                        due = datetime.strptime(issue.due_date, '%Y-%m-%d').date()
                    elif isinstance(issue.due_date, datetime):
                        due = issue.due_date.date()
                    else:
                        due = issue.due_date
                    
                    if today > due:
                        overdue_count += 1
                        days_overdue = (today - due).days
                        total_fines += days_overdue * 5
            
            return jsonify({
                'total_issued': total_issued,
                'total_returned': total_returned,
                'overdue_books': overdue_count,
                'total_fines': total_fines
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
