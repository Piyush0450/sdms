from database.connection import Base, engine, SessionLocal
from models.user import Admin, Faculty, Student
from models.academic import Class, Subject, SubjectAllocation, Attendance, Result
from sqlalchemy import select
from datetime import datetime, timedelta
import random

def reset_and_seed():
    print("🗑️ Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("🏗️ Creating all tables...")
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        print("🌱 Seeding Users...")
        
        # 1. Admin
        db.add(Admin(admin_id="A_001", name="Super Admin", username="admin", role="super_admin", dob="01/01/2000", password="01/01/2000"))
        
        # 2. Faculty
        f1 = Faculty(faculty_id="F_001", name="Dr. Smith", department="Science", subject="Physics", dob="01/01/1980", password="01/01/1980")
        f2 = Faculty(faculty_id="F_002", name="Prof. Doe", department="Math", subject="Mathematics", dob="01/01/1985", password="01/01/1985")
        db.add_all([f1, f2])
        db.flush()

        # 3. Classes
        c1 = Class(grade="10", section="A")
        c2 = Class(grade="10", section="B")
        db.add_all([c1, c2])
        db.flush()

        # 4. Students
        from datetime import date
        s1 = Student(student_id="S_001", name="Alice", roll_no="101", department="Science", semester="1", dob="01/01/2005", password="01/01/2005", class_id=c1.id, joining_date=date(2024, 1, 15))
        s2 = Student(student_id="S_002", name="Bob", roll_no="102", department="Science", semester="1", dob="01/01/2005", password="01/01/2005", class_id=c1.id, joining_date=date(2024, 2, 20))
        s3 = Student(student_id="S_003", name="Charlie", roll_no="103", department="Math", semester="1", dob="01/01/2005", password="01/01/2005", class_id=c2.id, joining_date=date(2024, 3, 10))
        db.add_all([s1, s2, s3])
        db.flush()

        print("📚 Seeding Academic Data...")
        
        # 5. Subjects
        sub1 = Subject(name="Physics", code="PHY")
        sub2 = Subject(name="Mathematics", code="MAT")
        db.add_all([sub1, sub2])
        db.flush()

        # 6. Allocations
        db.add(SubjectAllocation(class_id=c1.id, subject_id=sub1.id, faculty_id=f1.id))
        db.add(SubjectAllocation(class_id=c1.id, subject_id=sub2.id, faculty_id=f2.id))

        # 7. Attendance
        today = datetime.now()
        for i in range(5):
            d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            db.add(Attendance(student_id=s1.id, subject_id=sub1.id, date=d, status="present"))
            db.add(Attendance(student_id=s1.id, subject_id=sub2.id, date=d, status="present"))
            db.add(Attendance(student_id=s2.id, subject_id=sub1.id, date=d, status="absent" if i%2==0 else "present"))

        # 8. Results
        db.add(Result(student_id=s1.id, subject_id=sub1.id, exam_type="Midterm", marks_obtained=85, total_marks=100))
        db.add(Result(student_id=s1.id, subject_id=sub2.id, exam_type="Midterm", marks_obtained=90, total_marks=100))
        db.add(Result(student_id=s2.id, subject_id=sub1.id, exam_type="Midterm", marks_obtained=75, total_marks=100))

        db.commit()
        print("✅ Database successfully reset and seeded!")
        print("   - Admin: admin / 01/01/2000")
        print("   - Faculty: F_001 / 01/01/1980")
        print("   - Student: S_001 / 01/01/2005")

if __name__ == "__main__":
    reset_and_seed()
