import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs/Observable';
import {Guest} from '../../../functions/src/declarations';
import {MatSnackBar} from '@angular/material';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  authenticating = false;

  constructor(public authService: AuthService,
              public router: Router,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.doPostLoginNavigation();
    }
  }

  onPINInputChange($event) {
    const pin = $event.target.value;
    if (pin.length === 4) {
      this.authenticating = true;
      this.authService.login(+pin).subscribe(userId => {
        this.authenticating = false;
        $event.target.value = '';
        if (userId === null) {
          this.snackBar.open('Fel PIN-kod. Försök igen.', '', {
            duration: 3000
          });
        } else {
          this.doPostLoginNavigation();
        }
      });
    } else if (pin.length > 4) {
      $event.target.value = pin.substring(0, 4);
    }
  }

  doPostLoginNavigation() {
    this.router.navigateByUrl('/signup');
  }
}
