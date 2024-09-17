from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/people', methods=['GET'])
def get_people():
    people = People.query.all()
    all_people = list(map(lambda x: x.serialize(), people))
    return jsonify(all_people), 200

@api.route('/people/<int:people_id>', methods=['GET'])
def get_person(people_id):
    person = People.query.get(people_id)
    if not person:
        return jsonify({"message": "Person not found"}), 404
    return jsonify(person.serialize()), 200

@api.route('/planets', methods=['GET'])
def get_planets():
    planets = Planet.query.all()
    all_planets = list(map(lambda x: x.serialize(), planets))
    return jsonify(all_planets), 200

@api.route('/planets/<int:planet_id>', methods=['GET'])
def get_planet(planet_id):
    planet = Planet.query.get(planet_id)
    if not planet:
        return jsonify({"message": "Planet not found"}), 404
    return jsonify(planet.serialize()), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    all_users = list(map(lambda x: x.serialize(), users))
    return jsonify(all_users), 200

@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    favorite_planets = list(map(lambda planet: planet.serialize(), user.favorite_planets))
    favorite_people = list(map(lambda person: person.serialize(), user.favorite_people))
    favorites = {
        "favorite_planets": favorite_planets,
        "favorite_people": favorite_people
    }
    return jsonify(favorites), 200

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    user_query = User.query.filter_by(email=email)
    user = user_query.first()
    if user is None:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    if user.email != email or user.password != password:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)

@api.route("/current-user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    if current_user_id is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401
    user_query = User.query.get(current_user_id)
    if user_query is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401
    user = user_query.serialize()
    return jsonify(current_user=user), 200

@api.route('/signup', methods=['POST'])
def create_user():
    data = request.json
    if 'email' not in data or 'password' not in data:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email ya registrado"}), 400
    new_user = User(email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"user": new_user.serialize()}), 200


def get_favorite_item_and_list(type, id, user):
    if type == "people":
        item = People.query.get(id)
        favorite_list = user.favorite_people
    elif type == "planet":
        item = Planet.query.get(id)
        favorite_list = user.favorite_planets
    else:
        return None, None
    return item, favorite_list


@api.route('/favorite/<string:type>/<int:id>', methods=['POST', 'DELETE'])
@jwt_required()
def handle_favorite(type, id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    item, favorite_query = get_favorite_item_and_list(type, id, user)
    if not item:
        return jsonify({"msg": "Elemento no encontrado"}), 404
    if request.method == "POST":
        if item not in favorite_query:
            favorite_query.append(item)
            db.session.commit()
        return jsonify({"msg": "Favorito agregado exitosamente"}), 201
    elif request.method == "DELETE":
        if item in favorite_query:
            favorite_query.remove(item)
            db.session.commit()
        return jsonify({"msg": "Favorito eliminado exitosamente"}), 200
