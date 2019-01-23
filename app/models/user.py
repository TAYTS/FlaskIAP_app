from db import db


class UserModel(db.Model):

    __tablename__ = 'USERS'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

    def json(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
