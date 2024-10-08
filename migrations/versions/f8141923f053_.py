"""empty message

Revision ID: f8141923f053
Revises: 0ac39b140a1c
Create Date: 2024-09-17 15:09:43.883531

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f8141923f053'
down_revision = '0ac39b140a1c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorite_people', schema=None) as batch_op:
        batch_op.create_unique_constraint('unique_user_people_favorite', ['user_id', 'people_id'])

    with op.batch_alter_table('favorite_planets', schema=None) as batch_op:
        batch_op.create_unique_constraint('unique_user_planet_favorite', ['user_id', 'planet_id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorite_planets', schema=None) as batch_op:
        batch_op.drop_constraint('unique_user_planet_favorite', type_='unique')

    with op.batch_alter_table('favorite_people', schema=None) as batch_op:
        batch_op.drop_constraint('unique_user_people_favorite', type_='unique')

    # ### end Alembic commands ###
