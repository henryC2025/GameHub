from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson import ObjectId
import datetime
import uuid
import jwt
import bcrypt
from functools import wraps
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://127.0.0.1:27017')
db = client['gamesDB']  
collection = db['video_games']  
users = db['users']
blacklist = db['blacklist']

domain = 'dev-lj7ac84a7apx1w1e.us.auth0.com'
clientID = 'V1vpytxkkPCX6I2Aebhi0jGowtyH8rf8'
clientSecret = 'n2Gdz0jvJjCNekH9jUup8329_uHjnl4FhrqyAO3AAf9VESK0mLJ0rY0k7QBu8Bzv'

app.config['SECRET_KEY'] = 'mysecret'

def admin_acquired(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])
        if data['admin']:
            return func(*args, **kwargs)
        else:
            return make_response(jsonify({'message' : 'Admin access required'}), 401)
    return admin_required_wrapper

def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        #token = request.args.get('token')
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message' : 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except: 
            return jsonify({'message' : 'Token is invalid'}), 401
        
        bl_token = blacklist.find_one({'token' : token})
        if bl_token is not None:
            return make_response(jsonify({'message' : 'Token has been cancelled'}), 401)


        return func(*args, **kwargs)
    
    return jwt_required_wrapper

@app.route('/api/v1.0/logout', methods=["GET"])
@jwt_required
def logout():
    token = request.headers['x-access-token']
    blacklist.insert_one({"token" : token})
    return make_response(jsonify({'message' : 'Logout sucessful'}), 200)

@app.route('/api/v1.0/login', methods=['GET'])
def login():
    auth = request.authorization

    if auth: 
        user = users.find_one({'username' : auth.username})
        if user is not None:
            if bcrypt.checkpw(bytes(auth.password, 'UTF-8'), user["password"]):
                token = jwt.encode(
                {
                    'user' : auth.username,
                    'admin' : user["admin"],
                    'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
                }, app.config['SECRET_KEY'])
                return make_response(jsonify({'token' : token.decode('UTF-8')}), 200)
            else:
                return make_response(jsonify({'message' : 'Bad password'}), 401)
        else:
            return make_response(jsonify({'message' : 'Bad username'}), 401)

    return make_response(jsonify({'Message' : 'Authentication required'}), 401)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# Get all games
@app.route('/api/v1.0/games', methods=['GET'])
def get_all_games():

    page_num, page_size = 1, 10
    if request.args.get('pn'): 
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    page_start = (page_size * (page_num - 1))

    video_games_list = []

    for game in db.video_games.find().skip(page_start).limit(page_size):
        game['_id'] = str(game['_id'])
        for comment in game.get('comments', []):
            comment['_comment_id'] = str(comment['_comment_id'])
        video_games_list.append(game)

    return make_response(jsonify(video_games_list), 200)

# Get a game by id
@app.route('/api/v1.0/games/<string:id>', methods=['GET'])
def get_game_by_id(id):
    video_game = db.video_games.find_one({'_id': ObjectId(id)})

    if video_game:
        video_game['_id'] = str(video_game['_id'])
        for comment in video_game.get('comments', []):
            comment['_comment_id'] = str(comment['_comment_id'])

        return make_response(jsonify(video_game), 200)
    else:
        return make_response(jsonify({'message': 'Game not found'}), 404)

# Search games by name
@app.route('/api/v1.0/games/search', methods=['GET'])
def search_games():
    query = request.args.get('query', '')

    regex_pattern = f'.*{query}.*'
    query_filter = {'name': {'$regex': regex_pattern, '$options': 'i'}}

    matching_games = db.video_games.find(query_filter)

    matching_games_list = []
    for game in matching_games:
        game['_id'] = str(game['_id']) 
        matching_games_list.append(game)

    return make_response(jsonify(matching_games_list), 200)

# Add comment
@app.route('/api/v1.0/games/<string:game_id>/comments', methods=['POST'])
def add_comment(game_id):
    comment_id = ObjectId()
    timestamp = datetime.datetime.utcnow()

    user_id = request.form['userID']
    username = request.form['username']
    comment_text = request.form['comment']

    if username and comment_text:
        new_comment = {
            'user_id' : user_id,
            'username': username,
            '_comment_id': comment_id,
            'comment_text': comment_text,
            'datetime': timestamp,
        }

        collection.update_one(
            {'_id': ObjectId(game_id)},
            {'$push': {'comments': new_comment}}
        )

        return make_response(jsonify({'message': 'Comment added successfully'}), 201)
    else:
        return make_response(jsonify({'error_message': 'Comment could not be added'}), 404)
    
# Delete a comment using the game id and comment id
@app.route('/api/v1.0/games/<string:game_id>/comments/<string:comment_id>', methods=['DELETE'])
def delete_comment(game_id, comment_id):
    result = collection.update_one(
        {'_id': ObjectId(game_id)},
        {'$pull': {'comments': {'_comment_id': ObjectId(comment_id)}}}
    )

    if result.modified_count > 0:
        return make_response(jsonify({'message': 'Comment deleted successfully'}), 200)
    else:
        return make_response(jsonify({'error_message': 'Comment not found or deletion failed'}), 404)

# Edit a comment using the game id and comment id
@app.route('/api/v1.0/games/<string:game_id>/comments/<string:comment_id>', methods=['PUT'])
def edit_comment(game_id, comment_id):
    game = collection.find_one({'_id': ObjectId(game_id)})

    if game:
        for comment in game.get('comments', []):
            # and comment['username'] == request.form['username']
            if str(comment['_comment_id']) == comment_id:
                comment['comment_text'] = request.form['comment']
                comment['datetime'] = datetime.datetime.utcnow()

                collection.update_one({'_id': ObjectId(game_id)}, {'$set': {'comments': game['comments']}})

                new_comment_link = 'http://localhost:5000/api/v1.0/games/' + str(game_id) + '/comments/' + str(comment_id)
                    
                return make_response(jsonify({'url': new_comment_link}), 200)
            else:
                return make_response(jsonify({'error_message': 'Comment not found or user mismatch'}), 404)
    else:
        return make_response(jsonify({'error_message': 'Game ID not found'}), 404)

# Get comment by ID
@app.route('/api/v1.0/games/<string:game_id>/comments/<string:comment_id>', methods=['GET'])
def get_comment(game_id, comment_id):
    game = collection.find_one({'_id': ObjectId(game_id)})

    if game:
        for comment in game.get('comments', []):
            if str(comment['_comment_id']) == comment_id:
                comment['_comment_id'] = str(comment['_comment_id'])
                return make_response(jsonify(comment), 200)

        # If the loop completes without finding a matching comment
        return make_response(jsonify({'error_message': 'Comment not found'}), 404)
    else:
        return make_response(jsonify({'error_message': 'Game not found'}), 404)
    
# Get comments for games
@app.route('/api/v1.0/games/<string:game_id>/comments', methods=['GET'])
def get_game_comments(game_id):
    game = collection.find_one({'_id': ObjectId(game_id)})

    if game:
        comments = game.get('comments', [])
        for comment in comments:
            comment['_comment_id'] = str(comment['_comment_id'])

        return make_response(jsonify({'comments': comments}), 200)
    else:
        return make_response(jsonify({'error_message': 'Game not found'}), 404)


# Get all comments from user
@app.route('/api/v1.0/users/<string:user_id>/comments', methods=['GET'])
def get_user_comments(user_id):

    game = collection.find_one({'comments.user_id' : user_id})

    comments = []
    if game:
        for comment in game.get('comments', []):
            if comment['user_id'] == user_id:
                comments['_comment_id'] = str(comments['_comment_id'])
                comments.append(comment)
    else:
        return make_response(jsonify({'error_message' : 'Game not found'}), 404)
    
    return make_response(jsonify({'comments' : comments}), 200)

# Add like to a game
@app.route('/api/v1.0/games/<string:game_id>/likes_dislikes/likes', methods=['POST'])
def add_like(game_id):

    game = collection.find_one({'_id' : ObjectId(game_id)})

    if game:
        user_id = request.form.get('user_id')

        if user_id:
            if user_id in game['likes_dislikes']['user_likes']:
                game['likes_dislikes']['user_likes'].remove(user_id)
                action = 'user removed from game likes'
            elif user_id in game['likes_dislikes']['user_dislikes']:
                game['likes_dislikes']['user_dislikes'].remove(user_id)
                action = 'user removed from game dislikes'
            else:
                game['likes_dislikes']['user_likes'].append(user_id)
                action = 'user ID added to game likes'
            
            collection.update_one({"_id": ObjectId(game_id)}, {"$set": {"likes_dislikes": game['likes_dislikes']}})
            return make_response(jsonify({'message': f'User {action} for the game', \
                                          'link' : f'http://localhost/api/v1.0/games/{str(game)}'}), 200)
        else:
            return make_response(jsonify({'error_message' : 'user not found'}), 404)
        
    return make_response(jsonify({'error_message' : 'game not found'}), 404)

# Add a dislike to a game
@app.route('/api/v1.0/games/<string:game_id>/likes_dislikes/dislikes', methods=['POST'])
def dislike_like(game_id):

    game = collection.find_one({'_id': ObjectId(game_id)})

    if game:
        user_id = request.form.get('user_id')

        if user_id:
            if user_id in game['likes_dislikes']['user_dislikes']:
                game['likes_dislikes']['user_dislikes'].remove(user_id)
                action = 'user removed from game dislikes'
            elif user_id in game['likes_dislikes']['user_likes']:
                game['likes_dislikes']['user_likes'].remove(user_id)
                action = 'user removed from game likes'
            else:
                game['likes_dislikes']['user_dislikes'].append(user_id)
                action = 'user ID added to game dislike'
            
            collection.update_one({"_id": ObjectId(game_id)}, {"$set": {"likes_dislikes": game['likes_dislikes']}})
            return make_response(jsonify({'message': f'{action} for the game', \
                                          'link' : f'http://localhost/api/v1.0/games/{str(game)}'}), 200)
        else:
            return make_response(jsonify({'error_message' : 'user not found'}), 404)
        
    return make_response(jsonify({'error_message' : 'game not found'}), 404)

# Get game likes_dislikes
@app.route('/api/v1.0/games/<string:game_id>/likes_dislikes', methods=['GET'])
def get_game_likes_dislikes(game_id):
    game = collection.find_one({'_id' : ObjectId(game_id)})

    if game:
        likes_dislikes = game.get('likes_dislikes', {})

        for user_id in likes_dislikes.get('user_likes', []):
            likes_dislikes['user_likes'] = str(user_id)

        for user_id in likes_dislikes.get('user_dislikes', []):
            likes_dislikes['user_dislikes'] = str(user_id)

        return make_response(jsonify({'likes_dislikes' : likes_dislikes}))
    
    return make_response(jsonify({'error_message' : 'game not found'}), 404)

# Get like and dislikes from a user 
@app.route('/api/v1.0/users/<string:user_id>/likes_dislikes', methods=['GET'])
def get_likes_dislikes_for_user(user_id):

    games_liked = []
    games_disliked = []

    games = collection.find({"likes_dislikes.user_likes": user_id})

    for game in games:
        games_liked.append(str(game['_id']))

    games = collection.find({"likes_dislikes.user_dislikes": user_id})

    for game in games:
        games_disliked.append(str(game['_id']))

    likes_dislikes = {'games_user_likes': games_liked, 'games_user_dislikes': games_disliked}

    return make_response(jsonify({'games_likes_dislikes': likes_dislikes}), 200)


# FAVOURITE GAMES {GAME_ID}

# ADD FAVOURITE GAMES

# DELETE FAVOURITE GAMES

# EDIT FAVOURITE GAMES

# ADD FILTERS FOR VIEW ALL GAMES

if __name__ == '__main__':
    app.run(debug=True)


# BLACKLIST COLLECTION 


# USERS COLLECTION

# user_list = [
#           { 
#             'name' : 'Henry Chan',
#             'username' : 'henry2025',  
#             'password' : b'apple123',
#             'email' : 'herny2025@msn.com',
#             'admin' : True
#           }
#        ]

# for new_staff_user in user_list:
#       new_staff_user['password'] = bcrypt.hashpw(new_staff_user['password'], bcrypt.gensalt())
#       user_list.insert_one(new_staff_user)
