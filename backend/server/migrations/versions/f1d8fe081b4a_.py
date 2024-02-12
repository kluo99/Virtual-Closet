"""empty message

Revision ID: f1d8fe081b4a
Revises: 391ac499c0b9
Create Date: 2024-02-12 14:13:40.683228

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f1d8fe081b4a'
down_revision = '391ac499c0b9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('garments_outfits', sa.Column('x_position', sa.Integer(), nullable=True))
    op.add_column('garments_outfits', sa.Column('y_position', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('garments_outfits', 'y_position')
    op.drop_column('garments_outfits', 'x_position')
    # ### end Alembic commands ###