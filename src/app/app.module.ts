import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule, MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatProgressBarModule,
  MatRippleModule, MatSnackBarModule,
  MatStepperModule,
  MatToolbarModule
} from '@angular/material';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PartyModule} from './party/party.module';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth.service';
import {LoginRoutingModule} from './login-routing/login-routing.module';
import {PartyRoutingModule} from './party-routing/party-routing.module';
import {FaceErrorDialogComponent, SignUpComponent} from './sign-up/sign-up.component';
import {ProfileImageUploadService} from './profile-image-upload.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FirstnamePipe} from './firstname.pipe';
import {LocalStorageModule} from 'angular-2-local-storage';
import {ServiceWorkerModule} from '@angular/service-worker';

const appRoutes: Routes = [
  {path: 'signup', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    FaceErrorDialogComponent,
    FirstnamePipe
  ],
  entryComponents: [
    FaceErrorDialogComponent
  ],
  imports: [
    PartyModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatDividerModule,
    MatChipsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    LoginRoutingModule,
    PartyRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    LocalStorageModule.withConfig({
      prefix: 'birfday-gal',
      storageType: 'localStorage'
    })
  ],
  providers: [
    AuthService,
    ProfileImageUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
