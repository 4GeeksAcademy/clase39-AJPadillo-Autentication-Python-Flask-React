from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
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

@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def add_favorite_planet(planet_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    planet = Planet.query.get(planet_id)
    if user and planet:
        user.favorite_planets.append(planet)
        db.session.commit()
        return jsonify({"message": "Planet added to favorites"}), 200
    return jsonify({"message": "User or Planet not found"}), 404

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
@jwt_required()
def add_favorite_people(people_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    person = People.query.get(people_id)
    if user and person:
        user.favorite_people.append(person)
        db.session.commit()
        return jsonify({"message": "Person added to favorites"}), 200
    return jsonify({"message": "User or Person not found"}), 404

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite_planet(planet_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    planet = Planet.query.get(planet_id)
    if user and planet:
        user.favorite_planets.remove(planet)
        db.session.commit()
        return jsonify({"message": "Planet removed from favorites"}), 200
    return jsonify({"message": "User or Planet not found"}), 404

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite_people(people_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    person = People.query.get(people_id)
    if user and person:
        user.favorite_people.remove(person)
        db.session.commit()
        return jsonify({"message": "Person removed from favorites"}), 200
    return jsonify({"message": "User or Person not found"}), 404

@api.route("/login", methods=["POST"])
def login():
    # Obtiene el email y password del cuerpo de la solicitud JSON. Si no se proporcionan, se establece como None.
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Verifica si el email o password no fueron proporcionados
    if email is None or password is None:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    # Busca al usuario en la base de datos por su email
    user_query = User.query.filter_by(email=email)
    user = user_query.first()  # Obtiene el primer resultado de la consulta
    # Si no se encuentra el usuario, devuelve un mensaje de error
    if user is None:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    # Verifica que el email y password coincidan con los del usuario en la base de datos
    if user.email != email or user.password != password:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    # Si todo es correcto, crea un token de acceso para el usuario usando su id como identidad
    access_token = create_access_token(identity=user.id)
    # Devuelve el token de acceso como respuesta JSON
    return jsonify(access_token=access_token)

@api.route("/current-user", methods=["GET"])
@jwt_required()  # Requiere que el usuario esté autenticado con JWT
def get_current_user():
    # Obtiene la identidad del usuario actual desde el token JWT
    current_user_id = get_jwt_identity()
    # Verifica si no se encontró la identidad del usuario
    if current_user_id is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401
    # Busca al usuario en la base de datos usando su id
    user_query = User.query.get(current_user_id)
    # Si no se encuentra el usuario, devuelve un mensaje de error
    if user_query is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401
    # Serializa los datos del usuario para enviarlos como JSON
    user = user_query.serialize()
    # Devuelve los datos del usuario actual como respuesta JSON
    return jsonify(current_user=user), 200

@api.route('/signup', methods=['POST'])
def create_user():
    # Obtiene los datos del cuerpo de la solicitud JSON
    data = request.json
    # Crea un nuevo usuario con el email y password proporcionados
    new_user = User(email=data['email'], password=data['password'])
    # Añade el nuevo usuario a la sesión de la base de datos
    db.session.add(new_user)
    # Confirma los cambios en la base de datos (guarda el nuevo usuario)
    db.session.commit()
    # Devuelve los datos del nuevo usuario como respuesta JSON
    return jsonify({"user": new_user.serialize()}), 200
