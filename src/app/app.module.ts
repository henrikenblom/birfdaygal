import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule, MatIconModule, MatToolbarModule} from '@angular/material';
import { TwinsComponent } from './twins/twins.component';
import { QuizComponent } from './quiz/quiz.component';
import { MusicQuizComponent } from './music-quiz/music-quiz.component';
import { MenuComponent } from './menu/menu.component';
import { PeopleComponent } from './people/people.component';

const appRoutes: Routes = [
  {path: 'twins', component: TwinsComponent, data: {'active-link': 'twins'}},
  {path: 'quiz', component: QuizComponent, data: {'active-link': 'quiz'}},
  {path: 'music-quiz', component: MusicQuizComponent, data: {'active-link': 'music-quiz'}},
  {path: 'menu', component: MenuComponent, data: {'active-link': 'menu'}},
  {path: 'people', component: PeopleComponent, data: {'active-link': 'people'}},
  {path: '**', redirectTo: '/music-quiz', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    TwinsComponent,
    QuizComponent,
    MusicQuizComponent,
    MenuComponent,
    PeopleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
