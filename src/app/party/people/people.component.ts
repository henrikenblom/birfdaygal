import {Component, OnInit} from '@angular/core';
import {Guest} from '../../../../functions/src/declarations';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html'
})
export class PeopleComponent implements OnInit {

  guests: Guest[];

  constructor(private db: AngularFirestore) {
  }

  ngOnInit() {
    this.fetchGuests();
  }

  private fetchGuests() {
    this.db.collection<Guest>('guests', ref =>
      ref.orderBy('name', 'asc').where('willAttend', '==', true))
      .valueChanges().forEach(guests => {
      this.guests = guests;
    });
  }

}
