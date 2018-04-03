import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PartyComponent} from '../party/party.component';
import {AuthGuard} from '../auth-guard.service';
import {QuizComponent} from '../party/quiz/quiz.component';
import {MusicQuizComponent} from '../party/music-quiz/music-quiz.component';
import {TwinsComponent} from '../party/twins/twins.component';
import {PeopleComponent} from '../party/people/people.component';

const partyRoutes: Routes = [{
  path: 'party',
  component: PartyComponent,
  canActivate: [AuthGuard],
  children: [
    {path: 'twins', component: TwinsComponent, data: {'active-link': 'twins'}},
    {path: 'quiz', component: QuizComponent, data: {'active-link': 'quiz'}},
    {path: 'music-quiz', component: MusicQuizComponent, data: {'active-link': 'music-quiz'}},
    {path: 'people', component: PeopleComponent, data: {'active-link': 'people'}},
    {path: '**', redirectTo: 'music-quiz', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(partyRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class PartyRoutingModule {
}
