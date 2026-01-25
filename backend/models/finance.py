
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Numeric
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class Fee(Base):
    __tablename__ = "fees"
    
    fee_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    fee_type = Column(Enum('Tuition', 'Examination', 'Library', 'Transport', 'Sports'), nullable=True)
    amount = Column(Numeric(10, 2), nullable=True)
    due_date = Column(DateTime, nullable=True) # Date in mysql
    paid_date = Column(DateTime, nullable=True)
    payment_method = Column(Enum('Cash', 'Card', 'Online', 'Cheque'), nullable=True)
    transaction_id = Column(String(50), nullable=True)
    status = Column(Enum('Paid', 'Pending', 'Overdue'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="fees")
