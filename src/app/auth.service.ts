import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {AngularFirestore} from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {LocalStorageService} from 'angular-2-local-storage';
import {Guest} from '../../functions/src/declarations';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;
  userId: string;

  constructor(private db: AngularFirestore,
              public router: Router,
              private localStorageService: LocalStorageService) {
    if (this.localStorageService.get('userId')) {
      this.userId = this.localStorageService.get('userId');
      this.isLoggedIn = true;
    }
  }

  login(pin: number): Observable<string> {
    return this.db.collection('guests', ref => ref.where('pin', '==', pin))
      .snapshotChanges()
      .take(1)
      .map(data => {
        if (data.length > 0) {
          this.userId = data[0].payload.doc.id;
          this.setLoggedIn(true, this.userId);
          return this.userId;
        } else {
          return null;
        }
      });
  }

  logout(): void {
    this.setLoggedIn(false, this.userId);
    this.userId = undefined;
    this.router.navigateByUrl('/login');
  }

  private setLoggedIn(loggedIn: boolean, userId: string) {
    if (loggedIn) {
      this.localStorageService.set('userId', userId);
    } else {
      this.localStorageService.remove('userId');
    }
    this.isLoggedIn = loggedIn;
    this.db.collection('guests').doc(userId).update({'isLoggedIn': loggedIn});
  }


}
