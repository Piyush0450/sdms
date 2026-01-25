
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class Department(Base):
    __tablename__ = "departments"
    
    department_id = Column(Integer, primary_key=True, autoincrement=True)
    department_name = Column(String(50), nullable=False)
    head_of_department = Column(Integer, ForeignKey("faculty.faculty_id", use_alter=True, name="fk_dept_head"), nullable=True) # Will resolve circular dependency via string
    building = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    # Use string for class name to avoid circular import issues if Faculty is imported
    head_teacher = relationship("Faculty", foreign_keys="Department.head_of_department", back_populates="managed_department")
    subjects = relationship("Subject", back_populates="department")
    teachers = relationship("Faculty", foreign_keys="Faculty.department_id", back_populates="department")
