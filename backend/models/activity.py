
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Numeric
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class Attendance(Base):
    __tablename__ = "attendance"
    
    attendance_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)
    attendance_date = Column(DateTime, nullable=True) # Date in mysql
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=True) # Add Subject ID
    status = Column(Enum('Present', 'Absent', 'Leave'), nullable=True)
    reason = Column(String(200), nullable=True) # text in schema
    recorded_by = Column(Integer, ForeignKey("faculty.faculty_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    subject = relationship("Subject") # Add relationship
    class_ = relationship("Class") # No explicit back_populates needed on class for now
    recorder = relationship("Faculty")

class Mark(Base):
    __tablename__ = "marks"
    
    mark_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)
    exam_type = Column(Enum('Midterm', 'Final', 'Quiz', 'Assignment'), nullable=True)
    marks_obtained = Column(Numeric(5, 2), nullable=True)
    max_marks = Column(Numeric(5, 2), default=100.00)
    # percentage and grade are derived from marks_obtained and max_marks
    exam_date = Column(DateTime, nullable=True) # Date
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="marks")
    subject = relationship("Subject")
    class_ = relationship("Class")
