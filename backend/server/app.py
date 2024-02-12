from flask import Flask, make_response, jsonify, request, session, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import requests
import rembg
from PIL import Image, ExifTags, ImageOps
import numpy as np
import easygui as eg
from werkzeug.utils import secure_filename
# from dotenv import dotenv_values
from models import db, Garment, Category, Outfit, garments_outfits
import base64
import io
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
@app.route('/api/remove-background', methods=['POST'])
def remove_background():
    try:
        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify(error='No file part'), 400
        file = request.files['file']

        # If the user does not select a file, the browser might
        # submit an empty file part without a filename, check this
        if file.filename == '':
            return jsonify(error='No selected file'), 400

        # Save the uploaded file
        filename = secure_filename(file.filename)
        image_path = os.path.join('./', filename)
        file.save(image_path)

        input_image = Image.open(image_path)

        input_image = ImageOps.exif_transpose(input_image)
        input_array = np.array(input_image)

        output_array = rembg.remove(input_array)
        output_image = Image.fromarray(output_array)

        # Convert the output image to a Base64 string
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue())
        img_str = img_str.decode('ascii')

        return jsonify({"url": img_str})
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 500
    
#route to save garment to database
@app.route('/api/save-item', methods=['POST'])
def save_item():

    try:
        data = request.get_json()
        # print(data['file'])
        
        garment = Garment(
            name = data['itemName'],
            brand = data['brand'],
            color = data['color'],
            size = data['size'],
            price = data['price'],
            garment_image = data['file']
        )

        db.session.add(garment)
        db.session.commit()

        return jsonify({"message": "Item saved successfully"})
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 500

#route to fetch all garments from database to display
@app.route('/api/get-garments', methods=['GET'])
def get_garments():
    try:
        garments = Garment.query.all()
        garments_list = [garment.to_dict() for garment in garments]
        return jsonify(garments_list)
    except Exception as e:
        return jsonify(error=str(e)), 500



if __name__  == '__main__':
    app.run(port=5555, debug=True)

