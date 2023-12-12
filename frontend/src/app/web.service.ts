import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class WebService 
{
    game_list : any;
    private game_id : any;
    private query : any;

    constructor(private http: HttpClient) {}

    getCountOfGames()
    {
        return this.http.get(
            'http://localhost:5000/api/v1.0/games/count'
        );
    }

    getGames(page : number)
    {
        return this.http.get(
            'http://localhost:5000/api/v1.0/games?pn=' + page
        );
    }

    getGame(id : any)
    {
        this.game_id = id;
        return this.http.get(
            "http://localhost:5000/api/v1.0/games/" + id
        );
    }

    searchGame(query : any)
    {
        this.query = query

        return this.http.get(
            'http://localhost:5000/api/v1.0/games/search?query=' + query
        );
    }

    getComments(id : any)
    {

    }

    addComment(data : any)
    {
        let addCommentData = new FormData();
        addCommentData.append("user_id", data.id)
        addCommentData.append("username", data.username);
        addCommentData.append("comment", data.comment);

        return this.http.post('http://localhost:5000/api/v1.0/games/' + this.game_id + '/comments', addCommentData);
    }

    editCommment(gameID : any, commentID : any)
    {

    }

    deleteComment(id : any)
    {

    }

    addLike(id : any)
    {

    }

    addDislike(id : any)
    {

    }
}