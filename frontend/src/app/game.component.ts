import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@auth0/auth0-angular";

@Component({
    selector : 'game',
    templateUrl : 'game.component.html',
    styleUrls : ['game.component.css']
})

export class GameComponent
{
    constructor(public webService : WebService,
                public route : ActivatedRoute,
                public formBuilder : FormBuilder,
                public authService : AuthService) {}

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
}