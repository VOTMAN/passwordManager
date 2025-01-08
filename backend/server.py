import os
import bcrypt 
import psycopg2
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt


app = Flask(__name__)

CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": r"http://localhost:5173/*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']

jwt = JWTManager(app)

def getDbConnection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"), 
        dbname=os.getenv("DB_NAME"), 
        user=os.getenv("DB_USER"), 
        password=os.getenv("DB_PASS"), 
        port=os.getenv("DB_PORT"),
    )
    
    return conn


@app.route("/api/reg", methods=["POST"])

def registerUsers():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = getDbConnection()
        cur = conn.cursor()

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400
        
        
        cur.execute("SELECT username from users WHERE username = %s", (username,))
        user_exists = cur.fetchone()
        
        if user_exists:
            return jsonify({"error": "The username is already exists"}), 409
        
        hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(14))
        password = None

        cur.execute("INSERT INTO users (username, hashed_pass) VALUES (%s, %s) ", (username, hashedPassword.decode('utf-8'),))
        conn.commit()

        return jsonify({"message": "User has been registered"}), 200
    
    except Exception as e:
    
        print("Error: ", e)
        return jsonify({"error": "Internal Server Error"}), 500
    

@app.route("/api/login", methods=["POST"])

def loginUsers():
    
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = getDbConnection()
    cur = conn.cursor()

    cur.execute("SELECT id, username FROM users WHERE username = %s", (username,))
    userExists = cur.fetchone()

    if not userExists:
        return jsonify({"error": "User does not exists"}), 409
    
    user_id = userExists[0]
    cur.execute("SELECT hashed_pass from users WHERE username = %s", (username,))
    user_data = cur.fetchone()

    hashed_pass = user_data[0]

    if bcrypt.checkpw(password.encode('utf-8'), hashed_pass.encode('utf-8')):
        accessToken = create_access_token(identity=str(user_id), expires_delta=timedelta(minutes=15))
        return jsonify({"message": "Login Success", "access_token": accessToken}), 200
    
    return jsonify({"error": "Login Failed"}), 401

@app.route("/api/protected", methods=['GET'])

@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_user = current_user), 200

@app.route("/api/<username>/getPasswords", methods=['GET'])

@jwt_required()
def getPasswords(username):
    user_id = get_jwt_identity()
    print(user_id)
    print(username)
    return jsonify({"message": "success"})

if __name__ == "__main__":
    app.run(debug=True)