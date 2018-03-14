import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TwinsService} from '../../twins.service';
import {Guest} from '../../../../functions/src/declarations';
import {AuthService} from '../../auth.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-twins',
  templateUrl: './twins.component.html'
})
export class TwinsComponent {

  DEFAULT_PHOTO_URL = '../assets/SVG/party_animals/1.svg';
  @ViewChild('nativeInput')
  nativeInputFile: ElementRef;
  comparing = false;
  comparisonDone = false;
  foundTwin = false;
  foundPrankster = false;
  unrecognized = false;
  twinPhotoUrl = this.DEFAULT_PHOTO_URL;
  twinName = '';
  likeness = 0;

  constructor(private twinService: TwinsService,
              private db: AngularFirestore,
              public authService: AuthService) {
  }

  acquireFromCamera() {
    this.nativeInputFile.nativeElement.click();
  }

  reset() {
    this.comparing = false;
    this.comparisonDone = false;
    this.foundTwin = false;
    this.foundPrankster = false;
    this.twinPhotoUrl = this.DEFAULT_PHOTO_URL;
    this.twinName = '';
    this.likeness = 0;
    this.unrecognized = false;
  }

  onNativeInputFileSelect($event): void {
    if ($event.target.files && $event.target.files[0]) {
      this.comparing = true;
      this.twinService.compareByPhoto($event.target.files[0])
        .then(comparisonResult => {
          this.comparing = false;
          this.comparisonDone = true;
          if (comparisonResult.status === 'OK') {
            this.updateTwinPhotoUrl(comparisonResult.twin_id);
            this.likeness = comparisonResult.likeness;
            this.foundTwin = true;
          } else if (comparisonResult.status === 'PRANK_TRY') {
            this.updateTwinPhotoUrl(comparisonResult.identified_user_id);
            this.foundPrankster = true;
          } else {
            this.unrecognized = true;
          }
        });
    }
  }

  updateTwinPhotoUrl(userId: string) {
    this.db.collection('guests').doc<Guest>(userId).valueChanges()
      .forEach(guest => {
        if (guest.photo_url) {
          this.twinPhotoUrl = guest.photo_url;
        }
        this.twinName = guest.name;
      });
  }
}
