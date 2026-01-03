from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from database.connection import Base

class Class(Base):
    __tablename__ = "class"
    id = Column(Integer, primary_key=True, autoincrement=True)
    grade = Column(String(20), nullable=False)  # e.g., "10", "Grade 5"
    section = Column(String(10), nullable=False)  # e.g., "A", "B"
    class_teacher_id = Column(Integer, ForeignKey("faculty.id"), nullable=True)

    # Relationships
    students = relationship("Student", back_populates="assigned_class")
    allocations = relationship("SubjectAllocation", back_populates="class_")

class Subject(Base):
    __tablename__ = "subject"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)

    # Relationships
    allocations = relationship("SubjectAllocation", back_populates="subject")

class SubjectAllocation(Base):
    """Mapping table for Class + Subject + Teacher"""
    __tablename__ = "subject_allocation"
    id = Column(Integer, primary_key=True, autoincrement=True)
    class_id = Column(Integer, ForeignKey("class.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subject.id"), nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=False)

    # Relationships
    class_ = relationship("Class", back_populates="allocations")
    subject = relationship("Subject", back_populates="allocations")
    faculty = relationship("Faculty", back_populates="allocations")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.id"), index=True, nullable=False)
    # Linking to allocation to know which subject/class context (optional, but good for specific subject attendance)
    # OR per-day attendance (school level).
    # Requirement: "Teacher: Mark... attendance (daily, weekly)". Usually daily is for class, subject-wise is for college.
    # User Request: "Mark student attendance (daily)". "Subject-wise average marks" suggests subject context exists.
    # Let's support Subject-wise attendance or Daily.
    # For a general school dash, usually it's "Morning/Daily Attendance". 
    # But "Subject-wise marks" suggests detailed subject handling.
    # I'll stick to a simple "Date + Status" linked to Student. If subject-wise is needed, we add subject_id.
    # The existing model had `subject` column. I will keep `subject_id` to be safe/flexible.
    subject_id = Column(Integer, ForeignKey("subject.id"), nullable=True) 
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    status = Column(String(10), nullable=False)  # Present, Absent, Late

    student = relationship("Student", back_populates="attendance_records")
    subject = relationship("Subject")

class Result(Base):
    __tablename__ = "result"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.id"), index=True, nullable=False)
    subject_id = Column(Integer, ForeignKey("subject.id"), nullable=False)
    exam_type = Column(String(50), nullable=False) # Midterm, Final
    marks_obtained = Column(Float, nullable=False)
    total_marks = Column(Float, nullable=False)
    date = Column(String(10), nullable=True)

    student = relationship("Student", back_populates="results")
    subject = relationship("Subject")
