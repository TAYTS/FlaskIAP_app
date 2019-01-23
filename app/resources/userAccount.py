from flask import request, make_response, jsonify
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required, create_access_token, set_access_cookies, unset_jwt_cookies
from models.user import UserModel


class UserRegistration(Resource):
    def post(self):
        username = request.form.get("username", "")
        password = request.form.get("password", "")

        user = UserModel(
            username=username,
            password=password
        )
        try:
            user.save_to_db()
            return {"status": 1}, 201
        except:
            return {"status": 0}, 500


class UserLogin(Resource):
    def post(self):
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        data = {"access_token": ""}

        if (username and password):
            user = UserModel.query.filter_by(
                username=username,
                password=password
            ).first()
            if user:
                access_token = create_access_token(identity=username)
                data["access_token"] = access_token
                resp = make_response(jsonify(data))
                set_access_cookies(resp, access_token)
                return resp
        return data, 401


class UserLogout(Resource):
    def post(self):
        resp = make_response(jsonify({"logout": True}))
        unset_jwt_cookies(resp)
        return resp
