from flask import Blueprint, jsonify, request
from sqlalchemy import select
from database.connection import SessionLocal
from models.user import Admin, Faculty, Student, Librarian, User
from utils.id_generator import next_id

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.get('/faculty')
def list_faculty():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Faculty)).all()
            # Map faculty_id to frontend props. Return UID as ID for consistency with other routes.
            return jsonify([{'faculty_id': r.faculty_uid, 'name': r.name, 'email': r.email, 'department': r.department_id, 'subject': '', 'dob': str(r.date_of_birth)} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.post('/faculty')
def add_faculty():
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            # Generate faculty UID
            existing = [x[0] for x in db.execute(select(Faculty.faculty_uid)).all() if x[0]]
            faculty_uid = next_id('F', existing)
            
            from datetime import datetime
            dob = None
            if data.get('dob'):
                try:
                    dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
                except:
                    pass
            
            f = Faculty(
                faculty_uid=faculty_uid,
                name=data.get('name',''),
                email=data.get('email', 'temp@mail.com'),
                date_of_birth=dob,
                phone=data.get('phone'),
                gender=data.get('gender'),
                address=data.get('address'),
                department_id=data.get('department_id')
            )
            db.add(f)
            db.commit()
            db.refresh(f)
            
            # Add to User table for authentication
            if f.email and f.email != 'temp@mail.com':
                user = User(
                    email=f.email,
                    role='faculty',
                    related_id=f.faculty_uid
                )
                db.add(user)
                db.commit()
            
            return jsonify({'ok': True, 'faculty_id': f.faculty_uid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.delete('/faculty/<int:faculty_id>')
def delete_faculty(faculty_id):
    try:
        with SessionLocal() as db:
            f = db.scalar(select(Faculty).where(Faculty.faculty_id == faculty_id))
            if not f: return jsonify({'ok': False, 'error': 'Not found'}), 404
            db.delete(f); db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.put('/faculty/<int:faculty_id>')
def update_faculty(faculty_id):
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            f = db.scalar(select(Faculty).where(Faculty.faculty_id == faculty_id))
            if not f: return jsonify({'ok': False, 'error': 'Not found'}), 404
            if 'name' in data: f.name = data['name']
            if 'email' in data: f.email = data['email']
            db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.get('/students')
def list_students():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Student)).all()
            # Return student_uid as the identifier
            return jsonify([{'student_id': r.student_uid, 'name': r.name, 'roll_no': r.phone, 'department': '', 'semester': '', 'dob': str(r.date_of_birth), 'email': r.email} for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.post('/students')
def add_student():
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            # Generate student UID
            existing = [x[0] for x in db.execute(select(Student.student_uid)).all() if x[0]]
            student_uid = next_id('S', existing)
            
            from datetime import datetime
            dob = None
            if data.get('dob'):
                try:
                    dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
                except:
                    pass
            
            s = Student(
                student_uid=student_uid,
                name=data.get('name',''),
                email=data.get('email', ''),
                phone=data.get('roll_no', '') or data.get('phone', ''),
                date_of_birth=dob,
                gender=data.get('gender'),
                address=data.get('address'),
                class_id=data.get('class_id')
            )
            db.add(s)
            db.commit()
            db.refresh(s)
            
            # Add to User table for authentication
            if s.email:
                user = User(
                    email=s.email,
                    role='student',
                    related_id=s.student_uid
                )
                db.add(user)
                db.commit()
            
            return jsonify({'ok': True, 'student_id': s.student_uid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.delete('/students/<int:student_id>')
def delete_student(student_id):
    try:
        with SessionLocal() as db:
            s = db.scalar(select(Student).where(Student.student_id == student_id))
            if not s: return jsonify({'ok': False, 'error': 'Not found'}), 404
            db.delete(s); db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.put('/students/<int:student_id>')
def update_student(student_id):
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            s = db.scalar(select(Student).where(Student.student_id == student_id))
            if not s: return jsonify({'ok': False, 'error': 'Not found'}), 404
            if 'name' in data: s.name = data['name']
            if 'email' in data: s.email = data['email']
            db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

# Super admin only
@bp.post('/admins')
def add_admin():
    try:
        data = request.get_json() or {}
        role = data.get('caller_role')
        if role != 'super_admin':
            return jsonify({'ok': False, 'error': 'Forbidden'}), 403
        with SessionLocal() as db:
            existing = [x[0] for x in db.execute(select(Admin.admin_id)).all() if x[0]]
            aid = next_id('A', existing)
            dob_val = data.get('dob','01/01/2000')
            email = data.get('email', f'{aid}@school.edu')
            
            # Changed: No password, added email
            a = Admin(
                admin_id=aid,
                name=data.get('name',''),
                username=data.get('username',''),
                dob=dob_val,
                role='admin',
                email=email
            )
            db.add(a)
            db.commit()
            
            # Add to User table for authentication
            user = User(
                email=email,
                role='admin',
                related_id=aid
            )
            db.add(user)
            db.commit()
            
            return jsonify({'ok': True, 'admin_id': aid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.delete('/admins/<admin_id>')
def delete_admin(admin_id):
    try:
        with SessionLocal() as db:
            a = db.scalar(select(Admin).where(Admin.admin_id == admin_id))
            if not a: return jsonify({'ok': False, 'error': 'Not found'}), 404
            if a.role == 'super_admin': return jsonify({'ok': False, 'error': 'Cannot delete super admin'}), 403
            db.delete(a); db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.put('/admins/<admin_id>')
def update_admin(admin_id):
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            a = db.scalar(select(Admin).where(Admin.admin_id == admin_id))
            if not a: return jsonify({'ok': False, 'error': 'Not found'}), 404
            if 'name' in data: a.name = data['name']
            if 'username' in data: a.username = data['username']
            if 'dob' in data: a.dob = data['dob']
            db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.get('/admins')
def list_admins():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Admin)).all()
            return jsonify([{'admin_id': r.admin_id, 'name': r.name, 'username': r.username, 'dob': r.dob} for r in rows if r.role != 'super_admin'])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Librarian Management (Admin/Super Admin only)
@bp.get('/librarians')
def list_librarians():
    try:
        with SessionLocal() as db:
            rows = db.scalars(select(Librarian)).all()
            return jsonify([{
                'librarian_id': r.librarian_uid,
                'name': r.name,
                'email': r.email,
                'phone': r.phone,
                'dob': str(r.date_of_birth) if r.date_of_birth else None,
                'joining_date': str(r.joining_date) if r.joining_date else None
            } for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.post('/librarians')
def add_librarian():
    try:
        data = request.get_json() or {}
        caller_role = data.get('caller_role')
        
        # Only admin and super_admin can add librarians
        if caller_role not in ['admin', 'super_admin']:
            return jsonify({'ok': False, 'error': 'Forbidden: Only admins can add librarians'}), 403
        
        with SessionLocal() as db:
            # Generate librarian UID
            existing = [x[0] for x in db.execute(select(Librarian.librarian_uid)).all() if x[0]]
            lib_uid = next_id('L', existing)
            
            from datetime import datetime
            dob = None
            if data.get('dob'):
                try:
                    dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
                except:
                    pass
            
            joining = None
            if data.get('joining_date'):
                try:
                    joining = datetime.strptime(data['joining_date'], '%Y-%m-%d').date()
                except:
                    pass
            
            # Create librarian
            librarian = Librarian(
                librarian_uid=lib_uid,
                name=data.get('name', ''),
                email=data.get('email', ''),
                phone=data.get('phone', ''),
                date_of_birth=dob,
                gender=data.get('gender'),
                address=data.get('address'),
                joining_date=joining
            )
            db.add(librarian)
            db.commit()
            db.refresh(librarian)
            
            # Add to User table for authentication
            user = User(
                email=librarian.email,
                role='librarian',
                related_id=librarian.librarian_uid
            )
            db.add(user)
            db.commit()
            
            return jsonify({'ok': True, 'librarian_id': lib_uid})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.delete('/librarians/<librarian_uid>')
def delete_librarian(librarian_uid):
    try:
        with SessionLocal() as db:
            lib = db.scalar(select(Librarian).where(Librarian.librarian_uid == librarian_uid))
            if not lib:
                return jsonify({'ok': False, 'error': 'Librarian not found'}), 404
            
            # Also delete from User table
            user = db.scalar(select(User).where(User.email == lib.email))
            if user:
                db.delete(user)
            
            db.delete(lib)
            db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@bp.put('/librarians/<librarian_uid>')
def update_librarian(librarian_uid):
    try:
        data = request.get_json() or {}
        with SessionLocal() as db:
            lib = db.scalar(select(Librarian).where(Librarian.librarian_uid == librarian_uid))
            if not lib:
                return jsonify({'ok': False, 'error': 'Librarian not found'}), 404
            
            if 'name' in data:
                lib.name = data['name']
            if 'email' in data:
                # Update email in both Librarian and User tables
                old_email = lib.email
                lib.email = data['email']
                user = db.scalar(select(User).where(User.email == old_email))
                if user:
                    user.email = data['email']
            if 'phone' in data:
                lib.phone = data['phone']
            
            db.commit()
            return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500
