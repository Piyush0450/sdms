
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Numeric
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class LibraryBook(Base):
    __tablename__ = "library_books"
    
    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    author = Column(String(100), nullable=True)
    isbn = Column(String(20), unique=True, nullable=True)
    category = Column(String(50), nullable=True)
    publisher = Column(String(100), nullable=True)
    publish_year = Column(Integer, nullable=True) # Year in mysql, Int in sqlite
    total_copies = Column(Integer, nullable=True)
    # available_copies is derived from total_copies - count(issued)
    shelf_number = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    issues = relationship("BookIssue", back_populates="book")

class BookIssue(Base):
    __tablename__ = "book_issues"
    
    issue_id = Column(Integer, primary_key=True, autoincrement=True)
    book_id = Column(Integer, ForeignKey("library_books.book_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    issue_date = Column(DateTime, nullable=True) # Date in mysql
    due_date = Column(DateTime, nullable=True)
    return_date = Column(DateTime, nullable=True)
    fine_amount = Column(Numeric(8, 2), nullable=True)
    status = Column(Enum('Issued', 'Returned', 'Overdue'), nullable=True)
    issued_by = Column(Integer, ForeignKey("faculty.faculty_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    book = relationship("LibraryBook", back_populates="issues")
    student = relationship("Student", back_populates="book_issues")
    issuer = relationship("Faculty")
