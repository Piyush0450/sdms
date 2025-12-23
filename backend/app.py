from flask import Flask, send_from_directory
from flask_cors import CORS
from database.connection import Base, engine
from models import user  # noqa: F401
from routes.auth_routes import bp as auth_bp
from routes.admin_routes import bp as admin_bp
from routes.faculty_routes import bp as faculty_bp
from routes.student_routes import bp as student_bp

def create_app():
    app = Flask(__name__, static_folder=None)
    CORS(app)

    # Create tables
    Base.metadata.create_all(bind=engine)

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(faculty_bp)
    app.register_blueprint(student_bp)

    @app.get('/api/health')
    def health():
        return {'ok': True}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
