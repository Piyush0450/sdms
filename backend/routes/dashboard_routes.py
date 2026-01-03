from flask import Blueprint, jsonify, request
from sqlalchemy import select, func, case
from database.connection import SessionLocal
from models.user import Student, Faculty, Admin
from models.academic import Attendance, Result, Class, Subject, SubjectAllocation

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.get('/student/<sid>/stats')
def student_stats(sid):
    try:
        with SessionLocal() as db:
            student = db.scalars(select(Student).where(Student.student_id == sid)).first()
            if not student:
                return jsonify({'error': 'Student not found'}), 404
            
            # 1. Overall Attendance %
            total_days = db.scalar(select(func.count(Attendance.id)).where(Attendance.student_id == student.id))
            present_days = db.scalar(select(func.count(Attendance.id)).where(Attendance.student_id == student.id, Attendance.status == 'present'))
            
            attendance_pct = 0
            if total_days and total_days > 0:
                attendance_pct = round((present_days / total_days) * 100, 1)

            # 2. Avg Marks
            avg_marks = db.scalar(select(func.avg(Result.marks_obtained)).where(Result.student_id == student.id))
            avg_marks = round(avg_marks, 1) if avg_marks else 0

            # 3. Recent Attendance (Last 7 records)
            recent_att = db.scalars(
                select(Attendance).where(Attendance.student_id == student.id).order_by(Attendance.date.desc()).limit(7)
            ).all()
            # Reverse to show chronological in graph
            recent_att_data = [{'date': r.date, 'status': r.status} for r in reversed(recent_att)]

            return jsonify({
                'attendance_percentage': attendance_pct,
                'avg_marks': avg_marks,
                'recent_attendance': recent_att_data,
                'total_exams': db.scalar(select(func.count(Result.id)).where(Result.student_id == student.id))
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.get('/teacher/<fid>/stats')
def teacher_stats(fid):
    try:
        with SessionLocal() as db:
            faculty = db.scalars(select(Faculty).where(Faculty.faculty_id == fid)).first()
            if not faculty:
                return jsonify({'error': 'Faculty not found'}), 404

            # 1. Total Students taught (via SubjectAllocation -> Class -> Students)
            # This is a bit complex JOIN.
            # Allocation -> Class -> Student
            # distinct students
            
            # Find allocations for this faculty
            allocations = db.scalars(select(SubjectAllocation).where(SubjectAllocation.faculty_id == faculty.id)).all()
            class_ids = [a.class_id for a in allocations]
            
            total_students = 0
            if class_ids:
                total_students = db.scalar(
                    select(func.count(Student.id)).where(Student.class_id.in_(class_ids))
                ) or 0

            # 2. Today's Attendance (Aggregate of all students in his classes)
            # Assuming we check for today's date? Or just return general stats?
            # Let's return Monthly Attendance Trend (Last 30 days) for his classes.
            
            # 3. Class Performance (Avg marks per class he teaches)
            class_performance = []
            for alloc in allocations:
                # Get class name
                cls = db.scalars(select(Class).where(Class.id == alloc.class_id)).first()
                sub = db.scalars(select(Subject).where(Subject.id == alloc.subject_id)).first()
                
                if cls and sub:
                    # Avg marks for this subject in this class
                    avg = db.scalar(
                        select(func.avg(Result.marks_obtained))
                        .join(Student)
                        .where(Student.class_id == cls.id, Result.subject_id == sub.id)
                    )
                    class_performance.append({
                        'class': f"{cls.grade}-{cls.section}",
                        'subject': sub.name,
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
            total_students = db.scalar(select(func.count(Student.id))) or 0
            total_teachers = db.scalar(select(func.count(Faculty.id))) or 0
            
            # Attendance Overview (Overall Present vs Absent for all time or today?)
            # Let's do Overall for chart
            present = db.scalar(select(func.count(Attendance.id)).where(Attendance.status == 'present')) or 0
            absent = db.scalar(select(func.count(Attendance.id)).where(Attendance.status == 'absent')) or 0
            total_att = present + absent
            
            att_rate = 0
            if total_att > 0:
                att_rate = round((present / total_att) * 100, 1)

            # Enrollment Growth (Monthly Cumulative)
            # SQLite: strftime('%Y-%m', joining_date)
            growth_data = []
            try:
                # Group by Month
                monthly_counts = db.execute(
                    select(func.strftime('%Y-%m', Student.joining_date).label('month'), func.count(Student.id))
                    .where(Student.joining_date != None)
                    .group_by('month')
                    .order_by('month')
                ).all()
                
                # Calculate Cumulative
                cumulative = 0
                for month_str, count in monthly_counts:
                    cumulative += count
                    # Parse month string just for label 'Jan', 'Feb' etc
                    # format: YYYY-MM
                    if month_str:
                         from datetime import datetime
                         m_date = datetime.strptime(month_str, '%Y-%m')
                         m_label = m_date.strftime('%b') # Jan, Feb
                         growth_data.append({'n': m_label, 'Students': cumulative})
            except Exception as e:
                print(f"Growth Graph Error: {e}")
                growth_data = [] # Fallback to empty if date issue

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
