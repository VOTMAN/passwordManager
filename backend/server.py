import bcrypt 
import psycopg2 # type: ignore
from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

def getDbConnection():
    conn = psycopg2.connect(host="localhost", dbname="postgres", user="postgres", password="hxur4752", port=5432)
    return conn


def createTable():
    conn = getDbConnection()
    cur = conn.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                hashed_pass TEXT NOT NULL
    ) 
    """)

    conn.commit()
    cur.close()
    conn.close()

@app.route("/", methods=["POST"])
def setUsers(username='bro', password='hello'):
    conn = getDbConnection()
    cur = conn.cursor()
    salt = bcrypt.gensalt(14)
    
    print(username, password)

    password = password.encode('ascii')
    print(password)

    hashedPassword = bcrypt.hashpw(password, salt)
    print(hashedPassword)
    print(bcrypt.checkpw(password, hashedPassword))

    return jsonify({'msg': 'User inserted Successfully'})

