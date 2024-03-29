"""empty message

Revision ID: 80dd950a666f
Revises: 
Create Date: 2024-02-15 11:17:02.086151

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '80dd950a666f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('category_table',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('outfit_table',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('garment_table',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('brand', sa.String(length=100), nullable=True),
    sa.Column('color', sa.String(), nullable=True),
    sa.Column('garment_image', sa.String(), nullable=True),
    sa.Column('size', sa.String(), nullable=True),
    sa.Column('price', sa.Integer(), nullable=True),
    sa.Column('season', sa.String(), nullable=True),
    sa.Column('occasion', sa.String(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['category_table.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('garments_outfits',
    sa.Column('garment_id', sa.Integer(), nullable=False),
    sa.Column('outfit_id', sa.Integer(), nullable=False),
    sa.Column('x_position', sa.Integer(), nullable=True),
    sa.Column('y_position', sa.Integer(), nullable=True),
    sa.Column('width', sa.Integer(), nullable=True),
    sa.Column('height', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['garment_id'], ['garment_table.id'], ),
    sa.ForeignKeyConstraint(['outfit_id'], ['outfit_table.id'], ),
    sa.PrimaryKeyConstraint('garment_id', 'outfit_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('garments_outfits')
    op.drop_table('garment_table')
    op.drop_table('outfit_table')
    op.drop_table('category_table')
    # ### end Alembic commands ###
