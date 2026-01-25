
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Time
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class Class(Base):
    __tablename__ = "classes"
    
    class_id = Column(Integer, primary_key=True, autoincrement=True)
    class_name = Column(String(20), nullable=False)
    academic_year = Column(Integer, nullable=True) # Year type in MySQL, Integer in SQLite is fine
    class_teacher_id = Column(Integer, ForeignKey("faculty.faculty_id"), nullable=True)
    room_number = Column(String(10), nullable=True)
    strength = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    class_teacher = relationship("Faculty", back_populates="classes_managed")
    students = relationship("Student", back_populates="assigned_class")
    timetable_entries = relationship("Timetable", back_populates="class_")
    allocations = relationship("SubjectAllocation", back_populates="class_")


class Subject(Base):
    __tablename__ = "subjects"
    
    subject_id = Column(Integer, primary_key=True, autoincrement=True)
    subject_name = Column(String(50), nullable=False)
    subject_code = Column(String(10), unique=True, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=True)
    credits = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    department = relationship("Department", back_populates="subjects")
    timetable_entries = relationship("Timetable", back_populates="subject")
    allocations = relationship("SubjectAllocation", back_populates="subject")

class SubjectAllocation(Base):
    __tablename__ = "subject_allocations"

    allocation_id = Column(Integer, primary_key=True, autoincrement=True)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("faculty.faculty_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    class_ = relationship("Class", back_populates="allocations")
    subject = relationship("Subject", back_populates="allocations")
    teacher = relationship("Faculty", back_populates="allocations")
class Timetable(Base):
    __tablename__ = "timetable"
    
    timetable_id = Column(Integer, primary_key=True, autoincrement=True)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    # Teacher is derived from SubjectAllocation(class, subject) -> teacher
    day_of_week = Column(Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), nullable=True)
    period_number = Column(Integer, nullable=True)
    start_time = Column(Time, nullable=True) # Str in sqlite
    end_time = Column(Time, nullable=True)
    room_number = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    class_ = relationship("Class", back_populates="timetable_entries")
    subject = relationship("Subject", back_populates="timetable_entries")

