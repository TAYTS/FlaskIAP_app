from flask import Flask, jsonify, current_app, request, render_template, make_response, redirect, url_for
from flask_login import login_required
from flask_restful import Api
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from resources.userAccount import UserLogin, UserRegistration, UserLogout
from models.user import UserModel
from db import db

app = Flask(__name__)
app.config.from_pyfile("config.py")

api = Api(app)
jwt = JWTManager(app)

api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(UserLogout, '/logout')


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/user")
@jwt_required
def user():
    user = get_jwt_identity()
    return render_template("user.html", username=user)


if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(port=5000)
