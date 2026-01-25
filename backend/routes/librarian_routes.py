from flask import Blueprint, jsonify, request
from sqlalchemy import select, func
from database.connection import SessionLocal
from models.user import Librarian, Student
from models.library import BookIssue, LibraryBook
from datetime import date, datetime

bp = Blueprint('librarian', __name__, url_prefix='/api/librarian')

@bp.get('/book-issues')
def get_book_issues():
    """Get all book issues with student details and calculated fines"""
    try:
        with SessionLocal() as db:
            # Get all book issues with joins
            issues = db.query(BookIssue, Student.name, LibraryBook.title).join(
                Student, BookIssue.student_id == Student.student_id
            ).join(
                LibraryBook, BookIssue.book_id == LibraryBook.book_id
            ).all()
            
            result = []
            today = date.today()
            
            for issue, student_name, book_title in issues:
                # Calculate fine if overdue
                fine = 0
                if issue.status == 'Issued' and issue.due_date:
                    if isinstance(issue.due_date, str):
                        due = datetime.strptime(issue.due_date, '%Y-%m-%d').date()
                    elif isinstance(issue.due_date, datetime):
                        due = issue.due_date.date()
                    else:
                        due = issue.due_date
                    
                    if today > due:
                        days_overdue = (today - due).days
                        fine = days_overdue * 5  # ₹5 per day
                
                result.append({
                    'issue_id': issue.issue_id,
                    'student_name': student_name,
                    'book_title': book_title,
                    'issue_date': str(issue.issue_date),
                    'due_date': str(issue.due_date),
                    'return_date': str(issue.return_date) if issue.return_date else None,
                    'status': issue.status,
                    'fine': fine
                })
            
            return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.post('/return-book/<int:issue_id>')
def return_book(issue_id):
    """Mark a book as returned"""
    try:
        with SessionLocal() as db:
            issue = db.query(BookIssue).filter(BookIssue.issue_id == issue_id).first()
            if not issue:
                return jsonify({'error': 'Book issue not found'}), 404
            
            issue.status = 'Returned'
            issue.return_date = date.today()
            db.commit()
            
            return jsonify({'ok': True, 'message': 'Book returned successfully'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
