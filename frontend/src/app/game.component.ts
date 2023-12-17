import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@auth0/auth0-angular";
import { SharedService } from "./shared.service";

@Component({
    selector : 'game',
    templateUrl : 'game.component.html',
    styleUrls : ['game.component.css']
})

export class GameComponent
{
    game_list : any = []
    comments : any = []
    commentForm : any = []
    like_dislike_list : any = []
    username : any
    email : any
    like_count : any = 0;
    dislike_count : any = 0;
    user_id : any;
    public isAuthenticated: boolean = false;
 
    constructor(public webService : WebService,
                public route : ActivatedRoute,
                public formBuilder : FormBuilder,
                public authService : AuthService,
                public sharedService : SharedService) {}

    // Check if fields are empty
    isUntouched()
    {
        return this.commentForm.controls.comment.pristine;   
    }

    isIncomplete()
    {
        return this.isInvalid("comment") || this.isUntouched()
    }

    isInvalid(control : any)
    {
        return this.commentForm.controls[control].invalid &&
               this.commentForm.controls[control].touched
    }

    submitComment(): void 
    {
        this.authService.user$.subscribe((user) =>
        {
          if (user)
          {
            const userInfo =
            {
              user_id: this.sharedService.getUserId(),
              username: user.nickname,
              comment: this.commentForm.get('comment').value
            };

            console.log(userInfo)
      
            this.webService.addComment(userInfo).subscribe({
              next: (response) =>
              {                
                window.alert("Comment added sucessfully")

                this.comments = this.webService
                  .getComments(this.route.snapshot.params['id']
                );
              },
              error: (error) =>
              {
                console.error('Error sending user information:', error);
              }}
            );
          }
        });
    }

    ngOnInit()
    {
        this.commentForm = this.formBuilder.group(
        {
            comment: ['', Validators.required]
        })

        this.game_list = this.webService
            .getGame(this.route.snapshot.params['id']
        );

        this.comments = this.webService
          .getComments(this.route.snapshot.params['id']
        );

        this.like_dislike_list = this.webService
          .getLikesDislikesFromGame(this.route.snapshot.params['id']
        );

        this.sharedService.authUserCompleted.subscribe(() =>
        {
            this.user_id = this.sharedService.getUserId();
        });

        this.authService.isAuthenticated$.subscribe((isAuthenticated) =>
        {
            if (isAuthenticated)
            {
              const user_id = this.sharedService.getUserId();
              if(user_id)
              {
                this.user_id = user_id;
              }
            }
        });

        this.getLikesDislikes(this.route.snapshot.params['id'])
    }

    getPlatformClass(platform: string): string 
    {
        const platformClass = this.sharedService.getPlatformClass(platform);
        return platformClass;
    }

    getOverlayColor(userReview: number): string 
    {
        if (userReview > 7) 
        {
          return 'green-overlay';
        } 
        else if (userReview < 4) 
        {
          return 'red-overlay';
        } 
        else 
        {
          return 'orange-overlay';
        }
    }

    addLike(user_id : any)
    {
      const game_id = this.route.snapshot.params['id'];

      if(user_id && game_id)
      {
        this.webService.addLike(game_id, user_id).subscribe({
          next: (response : any) =>
          {
            console.log(response)
            this.getLikesDislikes(game_id);
          },
          error: (error) =>
          {
            console.error('Something went wrong adding like:', error);
          }}
        );
      }
      else
      {
        console.log("Looks like some IDs are missing!")
      }
    }

    addDislike(user_id : any)
    {
      const game_id = this.route.snapshot.params['id'];

      if(user_id && game_id)
      {
        this.webService.addDislike(game_id, user_id).subscribe({
          next: (response : any) =>
          {
            console.log(response)
            this.getLikesDislikes(game_id);
          },
          error: (error) =>
          {
            console.error('Something went wrong adding dislike:', error);
          }}
        );
      }
      else
      {
        console.log("Looks like some IDs are missing!")
      }
    }

    getLikesDislikes(game_id : any)
    {
      this.webService.getLikesDislikesFromGame(game_id).subscribe({
        next: (response : any) =>
        {
          const likes = response.likes_dislikes.liked_users.length;
          const dislikes = response.likes_dislikes.disliked_users.length;
          this.like_count = likes
          this.dislike_count = dislikes
        },
        error: (error) =>
        {
          console.error('Something went wrong when getting likes and dislikes:', error);
        }}
      );
    }
}