import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game.component';
import { GamesComponent } from './games.component';
import { Navigation, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { WebService } from './web.service';
import { NavComponent } from './nav.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { SharedService } from './shared.service';
import { AuthComponent } from './auth.component';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from '@auth0/auth0-angular';

var routes : any = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'games',
    component: GamesComponent
  },
  {
    path: 'games/:id',
    component: GameComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
]

@NgModule({
  declarations: [
    AppComponent, 
    GameComponent,
    GamesComponent,
    HomeComponent,
    NavComponent, 
    AuthComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-lj7ac84a7apx1w1e.us.auth0.com',
      clientId: 'V1vpytxkkPCX6I2Aebhi0jGowtyH8rf8',
      authorizationParams: {
        redirect_uri: 'http://localhost:4200/'
      }
    })
  ],
  providers: [WebService, SharedService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
