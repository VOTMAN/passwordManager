import bcrypt 
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": r"http://localhost:5173/*"}})

def getDbConnection():
    conn = psycopg2.connect(
        host="localhost", 
        dbname="postgres", 
        user="postgres", 
        password="hxur4752", 
        port=5432,
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
    
    finally:
        cur.close()
        conn.close()


@app.route("/api/login", methods=["GET"])
def loginUsers():
    
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = getDbConnection()
    cur = conn.cursor()

    cur.execute("SELECT username FROM users WHERE username = %s", (username,))
    user_exists = cur.fetchone()

    if not user_exists:
        return jsonify({"error": "User does not exists"}), 409
    
    cur.execute("SELECT hashed_pass from users WHERE username = %s", (username,))
    user_data = cur.fetchone()

    hashed_pass = user_data[0]
    print(hashed_pass)
    if bcrypt.checkpw(password.encode('utf-8'), hashed_pass.encode('utf-8')):
        return jsonify({"message": "Login Success"}), 200
    
    return jsonify({"error": "Incorrect password"}), 401

if __name__ == "__main__":
    app.run(debug=True)