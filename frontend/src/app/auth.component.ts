import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { WebService } from './web.service';
import { SharedService } from './shared.service';

@Component({
  selector : 'auth',
  templateUrl : 'auth.component.html',
  styleUrls : ['auth.component.css']
})

export class AuthComponent 
{
  constructor(public authService : AuthService,
              public webService : WebService,
              public sharedService : SharedService,
              public router : Router) {}

  ngOnInit()
  {
    this.authUserID();  
  }

  authUserID()
  {
    this.sharedService.authUser().subscribe((isAuthenticated) =>
    {
      if (isAuthenticated)
      {
        this.authService.user$.subscribe((user) =>
        {
          if (user)
          {
            const userData =
            {
              oauth_id: user?.sub,
              username: user?.nickname,
              email: user?.email,
            };
  
            this.webService.authUser(userData).subscribe(
            {
              next: (response) =>
              {
                let responseSTR = JSON.stringify(response);
                const responseObject = JSON.parse(responseSTR);
                const userId = responseObject['user_id'];
  
                this.sharedService.setUserId(userId);
  
                console.log(`user_id: ${userId}`);
                console.log('User information sent successfully:', response);
  
                // Notify that authUser has completed (assuming you have a Subject for this purpose)
                this.sharedService.authUserCompleted.next();
              },
              error: (error) =>
              {
                console.error('Error sending user information:', error);
              },
            });
          }
          else
          {
            console.log('Something went wrong!');
          }
        });
      }
    });
  }

  // authUser()
  // {
  //   this.authService.isAuthenticated$.subscribe((isAuthenticated) => 
  //   {
  //     if (isAuthenticated)
  //     {
  //       this.authService.user$.subscribe((user) => 
  //       {
  //         if (user)
  //         {
  //           const userData = 
  //           {
  //             oauth_id: user?.sub,
  //             username: user?.nickname,
  //             email: user?.email,
  //           };
    
  //           this.webService.authUser(userData).subscribe(
  //           {
  //             next: (response) => 
  //             {
  //               let responseSTR = JSON.stringify(response)
  //               const responseObject = JSON.parse(responseSTR);
  //               const userId = responseObject['user_id'];
                
  //               this.sharedService.setUserId(userId);

  //               console.log(`user_id: ${userId}`);
  //               console.log('User information sent successfully:', response);
  //             },
  //             error: (error) => 
  //             {
  //               console.error('Error sending user information:', error);
  //             }
  //           });
  //         }
  //         else
  //         {
  //           console.log("Something went wrong!")
  //         }
  //       });
  //     }
  //   });
  // }
  
  loginWithRedirect(): void
  {
    this.authService.loginWithRedirect(
    {
        appState: { target: this.router.url }
    })
  }

  logout(): void
  {
    this.authService.logout();
  }
}
