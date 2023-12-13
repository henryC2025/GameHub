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
    username : any
    email : any
 
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
              user_id: user.sub,
              username: user.nickname,
              comment: this.commentForm.get('comment').value
            };

            console.log(userInfo)
      
            // this.webService.addComment(userInfo).subscribe(
            //   (response) => {
            //     console.log('User information sent successfully:', response);
            //   },
            //   (error) => {
            //     console.error('Error sending user information:', error);
            //   }
            // );
          }
        });
    }

    ngOnInit()
    {
        this.commentForm = this.formBuilder.group({
            comment: ['', Validators.required]
        })

        this.game_list = this.webService
            .getGame(this.route.snapshot.params['id']
        );

        this.comments = this.webService
            .getComments(this.route.snapshot.params['id']
        );
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
}