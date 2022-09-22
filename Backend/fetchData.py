from asyncio.windows_events import NULL
from functools import wraps
from lib2to3.pgen2.token import EQUAL
import profile
from flask import * 
from flask_cors import CORS
from bottle import response
from uuid import uuid4
import jwt
import datetime
import sqlite3
from functools import wraps
import json


con = sqlite3.connect('./data.db')
columnName = []
arrToJson = [];
encodeData = '';


def sql_fetch(con):
    cursorObj = con.cursor()
    datum = cursorObj.execute('SELECT * FROM buildings')
    for column in datum.description:
        columnName.append(column[0])   
    rows = cursorObj.fetchall()    
    for row in rows:
        oj = {}
        for index,item in enumerate(row):
            oj[columnName[index]] = item   
        arrToJson.append(oj)

euiColumnName = []
euiArrToJson = [];
def  eui_fetch(con):
    cursorObj = con.cursor()
    average_eui = cursorObj.execute("""\
    SELECT 
        type, 
        round(avg(eui),3) AS `average_eui` 
        FROM 
        (
            SELECT 
            `t`.`OSEBuildingID` AS `id`, 
            `t`.`PrimaryPropertyType` AS `type`, 
            `t2`.`electricity` / `t1`.`gfa` AS `eui` 
            FROM 
            `buildings` t 
            LEFT JOIN (
                SELECT 
                `OSEBuildingID` AS `id`, 
                SUM(`PropertyUseTypeGFA`) AS `gfa` 
                FROM 
                `buildings_gfa` 
                GROUP BY
                `OSEBuildingID`
            ) t1 ON `t`.`OSEBuildingID` = `t1`.`id` 
            LEFT JOIN (
                SELECT 
                `OSEBuildingID` AS id, 
                value AS `electricity` 
                FROM 
                metrics 
                WHERE 
                metric = 'Electricity'
            ) t2 ON `t`.`OSEBuildingID` = `t2`.`id`
        ) 
        GROUP BY
        `type`""")
    for column in average_eui.description:
        euiColumnName.append(column[0])
    data = cursorObj.fetchall()
    for row in data:
        oj = {}
        for index,item in enumerate(row):
            oj[euiColumnName[index]] = item   
        euiArrToJson.append(oj)
    con.commit()
    con.close()



sql_fetch(con)
eui_fetch(con)



app = Flask(__name__)
CORS(app)

@app.route('/api/list/', methods=['GET'])
def data_page():
    return jsonify(arrToJson)

@app.route('/api/eui/', methods=['GET'])
def eui_data():
    return jsonify(euiArrToJson)    



userprofile = {'username': "admin", 'password': "password" }

@app.route('/api/signin/', methods=['POST'])
def postInput():
    value = request.get_json()
    username = value['username']
    password = value['password']
    
    if (not username or not password):
        return Response(json.dumps({'error': 'Username or Password required.'}), status=400, mimetype="application/json")
    elif  (username != userprofile["username"] or password != userprofile["password"]):
        return Response(json.dumps({'error': 'Username or Password is Wrong.'}), status=401, mimetype="application/json")
    else:
        encodeData = {'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}
        encoded_jwt = jwt.encode(encodeData, "secret", algorithm="HS256")
        
        return Response(json.dumps({'user': userprofile, 'token': encoded_jwt}), status=200, mimetype="application/json")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')

        print(token)
        if not token:
            return jsonify({'message': 'Token is missing!'}),403
        try:
            data = jwt.decode(token, "secret", algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid'}),403
        return f(*args,**kwargs)
    return decorated

@app.route('/verifyToken')
@token_required
def verify():
    token = request.args.get('token')
    return Response(json.dumps({'user': userprofile, 'token': token}), status=200, mimetype="application/json")

if __name__ == '__main__':
    app.run(port=5000)

