import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class WebService 
{
    game_list : any;
    private game_id: any;

    constructor(private http: HttpClient) {}

    getGames(page : number)
    {
        return this.http.get(
            'http://localhost:5000/api/v1.0/games?pn=' + page
        );
    }

    getGame(id : any)
    {
        this.game_id = id;
        return this.http.get("http://localhost:5000/api/v1.0/games/" + id)
    }

    getComments(id : any)
    {

    }

    addComment(id : any)
    {

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