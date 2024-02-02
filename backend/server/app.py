from flask import Flask, make_response, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
# from dotenv import dotenv_values
from models import db, Garment, Category, Weather
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_bcrypt import Bcrypt
# from sqlalchemy.orm.exc import NoResultFound
# from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)
# app.secret_key = "asdfwer243523423asdrwr"
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate = Migrate(app, db)
db.init_app(app)
# bcrypt = Bcrypt(app)

@app.route('/')
def home():
    return '<h1>Welcome to the Virtual Closet Database</h1>'

if __name__  == '__main__':
    app.run(port=5555, debug=True)