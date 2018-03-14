import {Component, enableProdMode, OnChanges, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {Guest} from '../../functions/src/declarations';
import {NavigationEnd, Router} from '@angular/router';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  DEFAULT_PHOTO_URL = '../assets/no_profile.png';
  photoUrl = this.DEFAULT_PHOTO_URL;
  hasPhoto = false;
  userName = '';

  constructor(public authService: AuthService,
              private db: AngularFirestore,
              public router: Router) {
    this.router.events
      .filter(event => (event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePhotoUrl();
      });
  }

  updatePhotoUrl() {
    if (this.authService.isLoggedIn) {
      this.db.collection('guests').doc<Guest>(this.authService.userId).valueChanges()
        .forEach(guest => {
          if (guest.photo_url) {
            if (guest.thumbnail_url) {
              this.photoUrl = guest.thumbnail_url;
            } else {
              this.photoUrl = guest.photo_url;
            }
            this.hasPhoto = true;
          }
          this.userName = guest.name;
        });
    }
  }

  doLogout() {
    this.photoUrl = this.DEFAULT_PHOTO_URL;
    this.hasPhoto = false;
    this.authService.logout();
  }
}
