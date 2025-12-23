from sqlalchemy import Column, Integer, String, Date, Enum
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
    subject = Column(String(50))
    dob = Column(String(10))
    password = Column(String(100))

class Student(Base):
    __tablename__ = "student"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    roll_no = Column(String(20), unique=True)
    department = Column(String(50))
    semester = Column(String(10))
    dob = Column(String(10))
    password = Column(String(100))

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), index=True)
    subject = Column(String(50))
    date = Column(String(10))  # YYYY-MM-DD
    status = Column(String(10))  # present/absent

class Result(Base):
    __tablename__ = "result"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), index=True)
    subject = Column(String(50))
    exam_type = Column(String(20))
    marks = Column(String(10))
