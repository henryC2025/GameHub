from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson import ObjectId
import datetime
import jwt
import uuid
import bcrypt
from functools import wraps

app = Flask(__name__)


client = MongoClient('mongodb://127.0.0.1:27017')
db = client['gamesDB']  
collection = db['video_games']  
users = db['users']
blacklist = db['blacklist']

app.config['SECRET_KEY'] = 'mysecret'

user_list = [
          { 
            "name" : "Test User",
            "username" : "test123",  
            "password" : b"test123_",
            "email" : "test123@test.com",
            "admin" : True, 
	        "createdAt" : datetime.datetime.utcnow()
          }
]

for new_user in user_list:
      new_user["password"] = bcrypt.hashpw(new_user["password"], bcrypt.gensalt())
      users.insert_one(new_user)
