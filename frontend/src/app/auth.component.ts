// auth.component.ts
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {Auth0Lock} from 'auth0-lock';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['auth.component.css']
})
export class AuthComponent {

  lock = new Auth0Lock('YOUR_AUTH0_CLIENT_ID', 'YOUR_AUTH0_DOMAIN');

  constructor(public auth: AuthService) {}

  login() {
    // Customize the login options as needed
    const options = {
      allowSignUp: true, // Enable registration
      // Other options...
    };

    this.lock.show(options, (err, profile, token) => {
      if (err) {
        console.error(err);
        return;
      }
      // Handle successful login
    });
  }
  
}
