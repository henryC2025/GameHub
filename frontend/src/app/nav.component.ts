import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";

@Component({
    selector: 'navigator',
    templateUrl: 'nav.component.html',
    styleUrls: []
})

export class NavComponent 
{
    constructor(public authService : AuthService,
                public router : Router) {}
}