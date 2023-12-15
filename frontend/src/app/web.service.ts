import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class WebService 
{
    game_list : any;
    private game_id : any;
    private comment_id : any;
    private comment_text : any;
    private query : any;

    constructor(private http: HttpClient) {}

    authUser(data : any)
    {
        let postData = new FormData();
        postData.append("oauth_id", data.oauth_id);
        postData.append("username", data.username);
        postData.append("email", data.email);

        return this.http.post('http://localhost:5000/api/v1.0/auth', postData);
    }

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
            'http://localhost:5000/api/v1.0/games/' + id
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
        this.game_id = id;
        return this.http.get(
            'http://localhost:5000/api/v1.0/games/' + id + '/comments'
        );
    }
    
    getUserComments(id : any)
    {
        console.log("API link: " + id)
        return this.http.get(
            'http://localhost:5000/api/v1.0/users/' + id + '/comments'
        )
    }

    addComment(data : any)
    {
        let addCommentData = new FormData();
        addCommentData.append("user_id", data.user_id)
        addCommentData.append("username", data.username);
        addCommentData.append("comment", data.comment);

        return this.http.post('http://localhost:5000/api/v1.0/games/' + this.game_id + '/comments', addCommentData);
    }

    editComment(gameID : any, commentID : any, edit_text : any)
    {
        this.game_id = gameID;
        this.comment_id = commentID;

        return this.http.put(
            'http://localhost:5000/api/v1.0/games/' + this.game_id + '/comments/' + this.comment_id, edit_text
        )
    }

    deleteComment(game_id : any, comment_id : any)
    {
        this.comment_id = comment_id;
        this.game_id = game_id;

        return this.http.delete(
            'http://localhost:5000/api/v1.0/games/' + game_id + '/comments/' + comment_id
        )
    }

    addLike(id : any)
    {

    }

    addDislike(id : any)
    {

    }
}