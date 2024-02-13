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
from datetime import datetime
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

@app.route('/save_date', methods=['POST'])
def save_date():
    data = request.get_json()
    date = data.get('date')

    # Convert the date string to a datetime object
    from datetime import datetime
    date = datetime.strptime(date, '%Y-%m-%d')

    new_outfit = Outfit(date=date)
    db.session.add(new_outfit)
    db.session.commit()

    return {'message': 'Date saved successfully'}, 200

@app.route('/add_garment', methods=['POST'])
def add_garment():
    data = request.get_json()
    name = data.get('name')
    brand = data.get('brand')
    color = data.get('color')
    garment_image = data.get('garment_image')
    size = data.get('size')
    price = data.get('price')

    new_garment = Garment(name=name, brand=brand, color=color, garment_image=garment_image, size=size, price=price)
    db.session.add(new_garment)
    db.session.commit()

    return {'message': 'Garment added successfully'}, 200

@app.route('/api/save-outfit', methods=['POST'])
def save_outfit():
    data = request.get_json()
    if not data:
        return {"message": "No input data provided"}, 400
    date_str = data.get('date')
    # Convert the date string to a datetime.date object
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    garment_ids = data.get('garments')
    if not garment_ids:
        return {"message": "No garments provided"}, 400
    garments = Garment.query.filter(Garment.id.in_(garment_ids)).all()
    if not garments:
        return {"message": "Garments not found"}, 404
    outfit = Outfit(date=date, garments=garments)
    db.session.add(outfit)
    db.session.commit()
    return {"message": "Outfit created", "outfit_id": outfit.id}, 201

@app.route('/api/get-outfit', methods=['GET'])
def get_outfit():
    date_str = request.args.get('date')
    if not date_str:
        return {"message": "No date provided"}, 400
    # Convert the date string to a datetime.date object
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    # Query the Outfit table for an outfit with the specified date
    outfit = Outfit.query.filter_by(date=date).first()
    if not outfit:
        return {"message": "Outfit not found"}, 404
    # Access the associated garments
    garments = outfit.garments
    # Now `garments` is a list of Garment objects associated with the outfit
    garments_list = [garment.to_dict() for garment in garments]
    return jsonify(garments_list)

if __name__  == '__main__':
    app.run(port=5555, debug=True)

