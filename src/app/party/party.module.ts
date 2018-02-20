import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartyRoutingModule} from '../party-routing/party-routing.module';
import {PartyComponent} from './party.component';
import {TwinsComponent} from './twins/twins.component';
import {QuizComponent} from './quiz/quiz.component';
import {MusicQuizComponent} from './music-quiz/music-quiz.component';
import {MenuComponent} from './menu/menu.component';
import {PeopleComponent} from './people/people.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatRippleModule, MatToolbarModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BackgroundImageDirective} from '../background-image.directive';
import {AuthGuard} from '../auth-guard.service';

@NgModule({
  imports: [
    CommonModule,
    PartyRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
  ],
  declarations: [
    PartyComponent,
    TwinsComponent,
    QuizComponent,
    MusicQuizComponent,
    MenuComponent,
    PeopleComponent,
    BackgroundImageDirective
  ],
  providers: [
    AuthGuard
  ]
})
export class PartyModule { }
