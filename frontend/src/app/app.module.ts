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
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { SharedService } from './shared.service';

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
  }
]

@NgModule({
  declarations: [
    AppComponent, 
    GameComponent,
    GamesComponent,
    HomeComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-lj7ac84a7apx1w1e.us.auth0.com',
      clientId: 'V1vpytxkkPCX6I2Aebhi0jGowtyH8rf8',
      authorizationParams: {
        redirect_uri: 'http://localhost:4200'
      }
    })
  ],
  providers: [WebService, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
