from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, ForeignKey
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func

# Definitions of tables and associated schema constructs
metadata = MetaData()

# A Flask SQLAlchemy extension
db = SQLAlchemy(metadata=metadata)

garments_outfits = db.Table('garments_outfits',
    db.Column('garment_id', db.Integer, db.ForeignKey('garment_table.id'), primary_key=True),
    db.Column('outfit_id', db.Integer, db.ForeignKey('outfit_table.id'), primary_key=True),
    db.Column('x_position', db.Integer),
    db.Column('y_position', db.Integer),
    db.Column('width', db.Integer),
    db.Column('height', db.Integer)
)

class Garment(db.Model, SerializerMixin):
    __tablename__ = 'garment_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    brand = db.Column(db.String(100))
    color = db.Column(db.String)
    garment_image = db.Column(db.String)
    size = db.Column(db.String)
    price = db.Column(db.Integer)

    season = db.Column(db.String)
    occasion = db.Column(db.String)

    category_id = db.Column(db.Integer, db.ForeignKey('category_table.id'))


    category = db.relationship("Category", back_populates="garment")
    outfits = db.relationship('Outfit', secondary=garments_outfits, back_populates='garments', lazy='dynamic')

    serialize_rules = ["-category", "-outfits"]

    def __repr__(self):
        return f"<Book {self.id}: {self.name}, {self.brand}, {self.color}, {self.garment_image}, {self.size}, {self.price}, {self.season}, {self.occasion}, {self.category}, {self.category_id}>"

class Outfit(db.Model, SerializerMixin):
    __tablename__ = 'outfit_table'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, default=func.now())
    garments = db.relationship('Garment', secondary=garments_outfits, back_populates='outfits', lazy='dynamic')

    serialize_rules = ["-garments"]

    def __repr__(self):
        return f"<Outfit {self.id}: {self.date}>"


class Category(db.Model, SerializerMixin):
    __tablename__ = 'category_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)

    garment = db.relationship("Garment", back_populates="category")

    serialize_rules = ["-garments"]

    def __repr__(self):
        return f"<Category {self.id}: {self.name}>"
    


# class Weather(db.Model, SerializerMixin):
#     __tablename__ = 'weather_table'

#     id = db.Column(db.Integer, primary_key=True)
#     weather = db.Column(db.String)
#     max_tempf = db.Column(db.Integer)
#     min_tempf = db.Column(db.Integer)
#     max_tempc = db.Column(db.Integer)
#     min_tempc = db.Column(db.Integer)
#     weather_img = db.Column(db.String)

    # def __repr__(self):
    #     return f"<Category {self.id}: {self.weather}, {self.max_tempf}, {self.min_tempf}, {self.max_tempc}, {self.min_tempc}, {self.weather_img}>"