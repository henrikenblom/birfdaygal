import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {ApplicationState} from '../../../functions/src/declarations';
import {routerTransition} from '../animations';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  animations: [routerTransition]
})
export class PartyComponent implements OnInit {

  stateSynced = false;
  userId: number;
  partyStarted = false;
  activeLink = '';

  constructor(private router: Router, private db: AngularFirestore) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const parts = event.urlAfterRedirects.split('/');
        this.activeLink = parts[parts.length - 1];
      }
    });
  }

  ngOnInit(): void {
    this.fetchState();
  }

  private fetchState() {
    this.db.collection('general')
      .doc<ApplicationState>('state')
      .valueChanges()
      .forEach(state => {
        this.partyStarted = state.partyStarted;
        this.stateSynced = true;
      });
  }

}
