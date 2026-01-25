
from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, Text, DateTime, Numeric
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(20), nullable=False) # 'super_admin', 'admin', 'faculty', 'student', 'librarian'
    related_id = Column(String(50), nullable=False) # stores admin_id variable or teacher_id/student_id as string
    created_at = Column(DateTime, default=datetime.utcnow)

class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    username = Column(String(50), unique=True)
    role = Column(String(20), default="admin")
    dob = Column(String(10)) 
    email = Column(String(100), unique=True)

class Faculty(Base):
    __tablename__ = "faculty"
    
    faculty_id = Column(Integer, primary_key=True, autoincrement=True)
    faculty_uid = Column(String(20), unique=True, index=True) # F_001 format
    name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(Enum('Male', 'Female', 'Other'), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(15), nullable=True)
    address = Column(Text, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.department_id", use_alter=True, name="fk_faculty_department_id"), nullable=True)
    joining_date = Column(Date, nullable=True)
    salary = Column(Numeric(10, 2), nullable=True)
    qualification = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    department = relationship("Department", foreign_keys="Faculty.department_id", back_populates="teachers")
    managed_department = relationship("Department", foreign_keys="Department.head_of_department", back_populates="head_teacher", uselist=False)
    # timetables = relationship("Timetable", secondary="subject_allocations", viewonly=True) # Complex join, accessed via allocations if needed
    allocations = relationship("SubjectAllocation", back_populates="teacher")
    classes_managed = relationship("Class", back_populates="class_teacher")


class Student(Base):
    __tablename__ = "students"
    
    student_id = Column(Integer, primary_key=True, autoincrement=True)
    student_uid = Column(String(20), unique=True, index=True) # S_001 format
    name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(Enum('Male', 'Female', 'Other'), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(15), nullable=True)
    address = Column(Text, nullable=True)
    class_id = Column(Integer, ForeignKey("classes.class_id", use_alter=True, name="fk_student_class_id"), nullable=True)
    admission_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assigned_class = relationship("Class", back_populates="students")
    marks = relationship("Mark", back_populates="student")
    attendance_records = relationship("Attendance", back_populates="student")
    fees = relationship("Fee", back_populates="student")
    book_issues = relationship("BookIssue", back_populates="student")

class Librarian(Base):
    __tablename__ = "librarian"
    
    librarian_id = Column(Integer, primary_key=True, autoincrement=True)
    librarian_uid = Column(String(20), unique=True, index=True) # L_001 format
    name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(Enum('Male', 'Female', 'Other'), nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=True)
    address = Column(Text, nullable=True)
    joining_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
