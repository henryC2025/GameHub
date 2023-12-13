import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector : 'auth',
  templateUrl : 'auth.component.html',
  styleUrls : ['auth.component.css']
})

export class AuthComponent 
{

  constructor(public authService: AuthService,
              public router: Router) {}

  ngOnInit()
  {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => 
    {
      if (isAuthenticated)
      {
        this.onRedirectComplete();
      }
    });

    this.authService.user$.subscribe((user) => 
        {
          if (user)
          {
            const userData = 
            {
              oauth_id: user.sub,
              username: user.nickname,
              email: user.email,
            };

            console.log(userData)
          }
          else
          {
            console.log("Something went wrong!")
          }
        });
  }
  
  loginWithRedirect(): void
  {
    this.authService.loginWithRedirect(
    {
        appState: { target: this.router.url }
    })
  }

  onRedirectComplete(): void
  {
    console.log("hi")
  }

  logout(): void
  {
    this.authService.logout();
  }
}
