from flask import Flask, send_from_directory
from flask_cors import CORS
from database.connection import Base, engine
from models import user, academic, department, activity, finance, library  # noqa: F401
from routes.auth_routes import bp as auth_bp
from routes.admin_routes import bp as admin_bp
from routes.faculty_routes import bp as faculty_bp
from routes.student_routes import bp as student_bp
from routes.dashboard_routes import bp as dashboard_bp
from routes.librarian_routes import bp as librarian_bp

def create_app():
    app = Flask(__name__, static_folder=None)
    # CORS(app) # Allow all origins by default (simpler for dev)
    CORS(app, origins=[
        "http://localhost:5173",
        "https://sdmsapp.netlify.app"
    ])

    @app.route("/", methods=["GET"])
    def root():
        return {
            "ok": True,
            "message": "Backend running successfully"
        }

    # Create tables
    Base.metadata.create_all(bind=engine)

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(faculty_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(librarian_bp)

    @app.get('/api/health')
    def health():
        return {'ok': True}

    @app.errorhandler(404)
    def not_found(e):
        return {'ok': False, 'error': 'Resource not found'}, 404

    @app.errorhandler(500)
    def internal_error(e):
        return {'ok': False, 'error': 'Internal server error'}, 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
