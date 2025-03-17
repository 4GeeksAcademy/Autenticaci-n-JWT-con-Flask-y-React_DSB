"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)
CORS(api)
bcrypt = Bcrypt()
# Allow CORS requests to this API



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Endpoint crear usuario
@api.route('/register', methods=['POST'])
def create_user():
    try:
            user_data = request.get_json()
            print(f"Datos del usuario: {user_data}")
    # validar si el correo ya existe
            if User.query.filter_by(email=user_data["email"]).first():
                print("El correo ya está registrado.")
                return jsonify({"error": "El correo electrónico ya está registrado."}), 400
    
            new_user = User(**user_data)
            new_user.password = bcrypt.generate_password_hash(new_user.password).decode('utf-8')
            db.session.add(new_user)
            db.session.commit()
            print(f"Usuario creado: {new_user.email}")
            access_token = create_access_token(identity=str(new_user.id))
            return jsonify({"msg":"usuario creado con exito","acces_token": access_token}), 200
    except Exception as e:
        print(f"Error al registrar el usuario: {e}")
        return jsonify({"error": "Error al crear el usuario"}), 500

@api.route('/check-email', methods=['POST'])
def check_email():
    body = request.get_json()
    email = body.get('email', None)
    if email is None:
        return {'message': 'Email is required'}, 400

    # Verificar si el correo existe en la base de datos
    user = User.query.filter_by(email=email).first()  # Buscar usuario por correo electrónico
    if user:
        return jsonify({'exists': True})  # El correo ya está registrado
    else:
        return jsonify({'exists': False})  # El correo no está registrado
    
# Endpoint verificar login
@api.route('/login', methods=['POST'])
def login():
    user_data = request.get_json()
    # Busca el usuario por el correo
    user = User.query.filter_by(email=user_data["email"]).first()
    # En caso de que la contraseña es incorrecta o no exista el usuario
    if not user or not bcrypt.check_password_hash(user.password, user_data["password"]):
        return jsonify({"error":"El email no esta registrado o los datos son incorrectos"}), 401
    # Crear el acces token 
    acces_token = create_access_token(identity=str(user.id))
    return jsonify({
        "msg":"Login correcto",
        "acces_token":acces_token, 
        "user":{
        "id": user.id,
        "email":user.email,
        "username":user.username,
    }}), 200

@api.route('/update-profile', methods=['POST'])
@jwt_required()
def updata_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error":"Usuario no encontrado"}),404
    data = request.get_json()

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'photoUrl' in data:
        user.photoUrl = data['photoUrl']
    if 'password' in data and data['password']:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')  # Encriptar nueva contraseña

    db.session.commit() 

    return jsonify({"msg": "Perfil actualizado con éxito", "user": user.serialize()}), 200

# Endpoint para eliminar un usuario
@api.route('/delete-user', methods=['DELETE'])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()  
    user = User.query.get(user_id)  

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404 

    try:
        db.session.delete(user)  
        db.session.commit()  
        return jsonify({"msg": "Usuario eliminado con éxito"}), 200  
    except Exception as e:
        print(f"Error al eliminar el usuario: {e}")
        return jsonify({"error": "Error al eliminar el usuario"}), 500  


# Endpoint listar usuarios
@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    return jsonify({"msg": f'Bienvenido {current_user} a la pagina privada'}), 200

# Endpoint listar usuarios por id
@api.route('/validate', methods=['GET'])
@jwt_required()
def validate():
    create_user = get_jwt_identity()
    return jsonify({"user":f'Token váildo para el usuario {create_user}'}), 200