from faker import Faker
from app import app
from models import db, Garment
import json
import random
from sqlalchemy.sql import func

fake = Faker()

def seed_closet(num_garment=20):
    garment_list = []

    for i in range(num_garment):
        garment = Garment(
            name = fake.name(),
            brand = fake.name(),
            color = fake.name(),
            garment_image = fake.image_url(),
            size = fake.name(),
            price = random.randint(10, 100)
        )
        garment_list.append(garment)
    
    db.session.add_all(garment_list)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        # so when you seed it deletes the table
        Garment.query.delete()
        # seed_closet()
        # Garment.
