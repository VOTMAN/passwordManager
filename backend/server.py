import os
import bcrypt
from cryptography.fernet import Fernet
import psycopg2
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": [r"http://localhost:5173/*", r"http://tauri.localhost/*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# CORS(app)

def getDbConn():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"), 
        dbname=os.getenv("DB_NAME"), 
        user=os.getenv("DB_USER"), 
        password=os.getenv("DB_PASS"), 
        port=os.getenv("DB_PORT"),
    )
    return conn
    # cur = conn.cursor()

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
encrypt_key = str(os.getenv("ENCRYPT_KEY"))
key = str(encrypt_key).encode()


jwt = JWTManager(app)


def createTables():
    conn = getDbConn()
    with conn.cursor() as cur:
        cur.execute("""CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        hashed_pass TEXT NOT NULL
    );""")
        
        cur.execute("""CREATE TABLE IF NOT EXISTS passwords (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        website VARCHAR(255) NOT NULL,
        w_user VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );""")

        conn.commit()

@app.route("/api/reg", methods=["POST"])

def registerUsers():
    conn = getDbConn()
    with conn.cursor() as cur:
        try:
            createTables()
            data = request.json
            username = data.get('username')
            password = data.get('password')

            # conn = getDbConnection()
            # cur = conn.cursor()

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
    conn = getDbConn()
    with conn.cursor() as cur:
        try:
            createTables()
            data = request.json
            username = data.get("username")
            password = data.get("password")

            # conn = getDbConnection()
            # cur = conn.cursor()

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
        
        except Exception as e:
            return jsonify({"error": "Internal Server Error"}), 500        

@app.route("/api/protected", methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_user = current_user), 200


@app.route("/api/setPassword", methods=['POST'])
@jwt_required()
def setPassword():
    user_id = get_jwt_identity()
    data = request.json
    wb = data.get('websiteName')
    wu = data.get('websiteUser')
    wp = data.get('websitePassword')

    conn = getDbConn()
    with conn.cursor() as cur:
        try:
            cipher = Fernet(key)
            encrypted_pass = cipher.encrypt(wp.encode())
            
            cur.execute("INSERT INTO passwords (user_id, website, w_user, password) VALUES (%s, %s, %s, %s)", (user_id, wb, wu, encrypted_pass.decode()))

            conn.commit()
            return jsonify({"message": "Password Inserted"}), 201
        
        except Exception as e:
            return jsonify({"error" : "Internal Server Error", "details": e}), 500
        

@app.route("/api/getPasswords", methods=['GET'])
@jwt_required()
def getPasswords():
    conn = getDbConn()
    with conn.cursor() as cur:
        try:
            user_id = get_jwt_identity()
            cipher = Fernet(key)
            cur.execute("SELECT id, website, w_user, password FROM passwords WHERE user_id = %s", (user_id,))
            data = cur.fetchall()
            processed = []
            for item in data:
                new_item = list(item)
                new_item[3] = (cipher.decrypt(new_item[3])).decode()
                processed.append(tuple(new_item))

            return jsonify({"message": "Passwords Retrieved", "data": processed}), 200
        except Exception as e:
            print(e)
            return jsonify({"error" : "Internal Server Error"}), 500

@app.route("/api/deletePassword", methods=['DELETE'])
@jwt_required()
def deletePassword():
    conn = getDbConn()
    with conn.cursor() as cur:
        try:
            to_be_deleted_id = request.json.get("id")
            cur.execute("SELECT * FROM passwords WHERE id = %s", (to_be_deleted_id,))
            passExists = cur.fetchone()

            if not passExists:
                return jsonify({"error": "Password does not exist"}), 401

            cur.execute("DELETE FROM passwords WHERE id = %s", (to_be_deleted_id,))
            conn.commit()

            return jsonify({"message": "Password Deleted"}), 200

        except Exception as e:
            print(e)
            return jsonify({"error": "Internal Server Error"}), 500
        
        finally:
            cur.close()
            conn.close()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")