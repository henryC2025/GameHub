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
 
    constructor(public webService : WebService,
                public route : ActivatedRoute,
                public formBuilder : FormBuilder,
                public authService : AuthService,
                public sharedService : SharedService) {}

    // Check if fields are empty
    isUntouched()
    {
        
    }

    isIncomplete()
    {

    }

    isInvalid()
    {

    }

    onSubmit()
    {

    }

    ngOnInit()
    {
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
}