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
    user_id : any;
    public isAuthenticated: boolean = false;
    editingComment: any = null; // Track which comment is being edited
    editedCommentText: string = ''; // Store edited comment text

    constructor(public authService : AuthService,
                public sharedService : SharedService,
                public webService : WebService,
                public router : Router) {}

    ngOnInit()
    {
        this.sharedService.authUserCompleted.subscribe(() =>
        {
            this.getAuthUserComments();
        });

        this.authService.isAuthenticated$.subscribe((isAuthenticated) =>
        {
            if (isAuthenticated)
            {
                this.sharedService.authUser();
                this.getAuthUserComments();
            }
        });

        console.log(this.comments)
    }

    getAuthUserComments()
    {
        this.user_id = this.sharedService.getUserId()
        console.log("TESITNG USERID: " + this.user_id)
        if(this.user_id)
        {
            console.log("TESITNG USERID" + this.user_id)
            this.comments = this.webService
                .getUserComments(this.user_id);

            this.isAuthenticated = true;

            console.log("Is Authenticated: " + this.user_id)

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

                this.webService.editComment(game_id, comment_id, promptData).subscribe({
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
}