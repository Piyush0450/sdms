from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base

class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    username = Column(String(50), unique=True)
    role = Column(String(20), default="admin")  # super_admin or admin
    dob = Column(String(10))  # store as DD/MM/YYYY for simplicity
    password = Column(String(100))

class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(Integer, primary_key=True, autoincrement=True)
    faculty_id = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    department = Column(String(50))
    subject = Column(String(50)) # Legacy column, keeping for safety
    dob = Column(String(10))
    password = Column(String(100))

    # Relationships
    allocations = relationship("SubjectAllocation", back_populates="faculty")

class Student(Base):
    __tablename__ = "student"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), unique=True, index=True) # e.g. "S123"
    name = Column(String(100))
    roll_no = Column(String(20), unique=True)
    department = Column(String(50))
    semester = Column(String(10))
    dob = Column(String(10))
    password = Column(String(100))
    
    # New Fields
    class_id = Column(Integer, ForeignKey("class.id"), nullable=True)
    joining_date = Column(Date)

    # Relationships
    assigned_class = relationship("Class", back_populates="students")
    attendance_records = relationship("Attendance", back_populates="student")
    results = relationship("Result", back_populates="student")
