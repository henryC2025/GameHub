from pymongo import MongoClient
import requests

client = MongoClient("mongodb://127.0.0.1:27017")
db = client['gamesDB']  
collection = db['video_games']  
api_key = 'f198f7794178443292bcb8e9668da05e'

def get_game_cover(api_key, game_name):
    base_url = 'https://api.rawg.io/api/games'
    params = {'key': api_key, 'search': game_name}

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        results = data.get('results', [])

        if results:
            cover_url = results[0].get('background_image', '')
            return cover_url

    return None

def updateImages():
    for document in collection.find({"image_url": "your_default_image_url"}):
        game_name = document['name']
        api_key = 'f198f7794178443292bcb8e9668da05e'

        image_url = get_game_cover(api_key, game_name)

        collection.update_many(
            {'name': game_name, 'image_url': 'your_default_image_url'},
            {'$set': {'image_url': image_url}}
        )

    print("Image URLs updated for selected games.")

updateImages()