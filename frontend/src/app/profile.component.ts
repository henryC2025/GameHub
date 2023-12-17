import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";
import { SharedService } from "./shared.service";
import { WebService } from "./web.service";

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})

export class ProfileComponent
{
    comments : any = [];
    game_list : any = [];
    liked_game_info : any = [];
    disliked_game_info : any = [];
    user_id : any;
    user_likes : any = [];
    user_dislikes : any = [];
    user_likes_dislikes : any = [];
    public isAuthenticated: boolean = false;

    game_name : any = [];
    game_platform : any = [];
    game_image : any = [];

    constructor(public authService : AuthService,
                public sharedService : SharedService,
                public webService : WebService,
                public router : Router) {}

    ngOnInit()
    {
        this.sharedService.authUserCompleted.subscribe(() =>
        {
            this.getAuthUserComments();
            console.log(this.user_id);
            this.getUserLikesDislikes(this.user_id)
        });

        this.authService.isAuthenticated$.subscribe((isAuthenticated) =>
        {
            if (isAuthenticated)
            {
                this.sharedService.authUser();
                this.getAuthUserComments();
                this.getUserLikesDislikes(this.user_id)
            }
        });
    }

    getAuthUserComments()
    {
        this.user_id = this.sharedService.getUserId()
        if(this.user_id)
        {
            this.comments = this.webService
                .getUserComments(this.user_id);

            this.isAuthenticated = true;
        }
        else
        {
            console.log("Not authenticated!")
        }

    }

    deleteComment(game_id : any, comment_id : any)
    {
        if(game_id && comment_id)
        {
            const prompt = window.confirm("Are you sure you want to delete?")
            if(prompt)
            {
                this.webService.deleteComment(game_id, comment_id).subscribe({
                    next: (response) =>
                    {
                      console.log(response);
                      this.getAuthUserComments();
                      window.alert("Comment deleted")
                    },
                    error: (error) =>
                    {
                      console.error('Error information:', error);
                    }}
                  );
            }   
        }
    }

    editComment(game_id : any, comment_id : any)
    {
        if(game_id && comment_id)
        {
            const prompt = window.prompt("Enter new comment")
            if(prompt)
            {
                const promptData = prompt;

                const requestData = { 'comment': promptData };

                this.webService.editComment(game_id, comment_id, requestData).subscribe({
                    next: (response) =>
                    {
                      console.log(response);
                      this.getAuthUserComments();
                      window.alert("Comment edited")
                    },
                    error: (error) =>
                    {
                      console.error('Error information:', error);
                    }}
                  );
            }   
        }
    }

    getUserLikesDislikes(user_id : any)
    {
        if(user_id)
        {
            this.webService.getLikesDislikesFromUser(user_id).subscribe({
                next: (response : any) =>
                {
                    this.user_likes = response[0].games_user_likes || [];
                    this.user_dislikes = response[0].games_user_dislikes || [];
                    console.log(this.user_likes)
                    console.log(this.user_dislikes)

                    this.webService.getGamesByIds(this.user_likes).subscribe(data =>
                    {
                        this.liked_game_info = data
                    });

                    this.webService.getGamesByIds(this.user_dislikes).subscribe(data =>
                    {
                        this.disliked_game_info = data
                    });

                    console.log(this.liked_game_info)
                },
                error: (error) =>
                {
                  console.error('Error information:', error);
                }}
            );
        }
    }

    getUserLikesGamesInfo(gameId: string): any
    {
      if (Array.isArray(this.liked_game_info))
      {
        const filtered_games = this.liked_game_info.filter((game_list) =>
            game_list.some((game:any) => game._id === gameId)
        );
    
        if (filtered_games.length > 0)
        {
          const liked_games = filtered_games[0].filter((game : any) => game._id === gameId);
          return liked_games.length > 0 ? liked_games[0].name + ' - ' + liked_games[0].platform : null;
        }
      }
      return null;
    }

    getUserDislikesGamesInfo(gameId: string): any
    {
      if (Array.isArray(this.disliked_game_info))
      {
        const filtered_games = this.disliked_game_info.filter((game_list) =>
            game_list.some((game:any) => game._id === gameId)
        );
    
        if (filtered_games.length > 0)
        {
          const disliked_games = filtered_games[0].filter((game : any) => game._id === gameId);
          return disliked_games.length > 0 ? disliked_games[0].name + ' - ' + disliked_games[0].platform  : null;
        }
      }
      return null;
    }

    deleteUserLike(game_id : any, user_id : any)
    {
        if(game_id && user_id)
        {
            const prompt = window.confirm("Are you sure you want to remove this like?")
            if(prompt)
            {
                this.webService.removeUserLikeFromGame(game_id, user_id).subscribe({
                    next: (response) =>
                    {
                      this.getUserLikesDislikes(user_id);
                      window.alert("Like removed")
                    },
                    error: (error) =>
                    {
                      console.error('Error information:', error);
                    }}
                  );
            }   
        }
    }

    deleteUserDislike(game_id : any, user_id : any)
    {
        if(game_id && user_id)
        {
            const prompt = window.confirm("Are you sure you want to remove this dislike?")
            if(prompt)
            {
                this.webService.removeUserDislikeFromGame(game_id, user_id).subscribe({
                    next: (response) =>
                    {
                      this.getUserLikesDislikes(user_id);
                    },
                    error: (error) =>
                    {
                      console.error('Error information:', error);
                    }}
                  );
            }   
        }
    }

}