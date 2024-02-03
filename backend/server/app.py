from flask import Flask, make_response, jsonify, request, session, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import requests
import rembg
from PIL import Image, ExifTags
import numpy as np
import easygui as eg
# from dotenv import dotenv_values
from models import db, Garment, Category
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

# route to fetch weather data
@app.route('/api/weather', methods=['GET'])
def get_weather():
    try:
        response = requests.get('http://api.weatherapi.com/v1/forecast.json?key=62e3a1c990dc4e80a8f151242240102&q=new york&days=1&aqi=no&alerts=no')
        return jsonify(response.json())
    except Exception as e:
        return jsonify(error=str(e)), 500

#route to remove background from images
@app.route('/api/remove-background', methods=['GET'])
def remove_background():
    try:
        image_path = './acne.JPG'
        input_image = Image.open(image_path)
        input_array = np.array(input_image)

        output_array = rembg.remove(input_array)
        output_image = Image.fromarray(output_array)

        # Get the orientation tag from the EXIF metadata
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break

        # Apply the rotation to the output image if the input image has an orientation tag
        if input_image._getexif() is not None and orientation in input_image._getexif():
            if input_image._getexif()[orientation] == 3:
                output_image = output_image.rotate(180, expand=True)
            elif input_image._getexif()[orientation] == 6:
                output_image = output_image.rotate(270, expand=True)
            elif input_image._getexif()[orientation] == 8:
                output_image = output_image.rotate(90, expand=True)

        output_image.save('output_image.png')

        return send_file('output_image.png', mimetype='image/png')
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 500


if __name__  == '__main__':
    app.run(port=5555, debug=True)

