import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {ApplicationState, Guest} from '../../../functions/src/declarations';
import 'rxjs/add/operator/switchMap';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialog} from '@angular/material';
import {SafeUrl} from '@angular/platform-browser';
import {ProfileImageUploadService} from '../profile-image-upload.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  @ViewChild('nativeInput')
  nativeInputFile: ElementRef;
  guest: Guest;
  userId: string;
  signupPeriod = false;
  docReference: AngularFirestoreDocument<Guest>;
  previewUrl: SafeUrl = '../../assets/no_profile.png';
  profileImageStatus = 'NOT_SET';
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  awaitingImageEvaluation = false;
  faceError = {
    NO_FACE: 'Det gick tyvärr inte att hitta något ansikte i bilden.',
    TOO_MANY_FACES: 'Det är fler än en person i bilden.',
    NO_FULL_FACE: 'Det gick inte att hitta något tydligt ansikte i bilden.'
  };
  faceAdvice = {
    NO_FACE: 'Ta en selfie med frontkameran eller be lillebror, PT:n eller frugan ta en med den bakre. (Kameran alltså)',
    TOO_MANY_FACES: 'Tyvärr får du försöka skiljas från mormor, syrran eller chefen när du knäpper den här selfien.',
    NO_FULL_FACE: 'Se till att fota rakt framifrån, att hela ansiktet är med och att ljuset är tillräckligt.'
  };

  constructor(private _formBuilder: FormBuilder,
              public router: Router,
              private db: AngularFirestore,
              private profileImageUploadService: ProfileImageUploadService,
              public dialog: MatDialog,
              public authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl('/party');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  selectFile() {
    this.nativeInputFile.nativeElement.click();
  }

  setWillAttend(response: boolean): Promise<void> {
    this.guest.formComplete = false;
    this.guest.willAttend = response;
    this.guest.hasResponded = true;
    return this.updateGuest();
  }

  setFormComplete(complete: boolean): Promise<void> {
    this.guest.formComplete = complete;
    return this.updateGuest();
  }

  addDietRestriction(event: MatChipInputEvent): Promise<void> {
    const input = event.input;
    const value = event.value;
    if (this.guest.dietRestrictions === undefined) {
      this.guest.dietRestrictions = [];
    }
    if ((value || '').trim()) {
      value.split(/[\s,.]+/).forEach(item => {
        this.guest.dietRestrictions.push({name: item.trim().toLocaleLowerCase()});
      });
    }
    if (input) {
      input.value = '';
    }
    return this.updateGuest();
  }

  removeDietRestriction(diet: any): Promise<any> {
    const index = this.guest.dietRestrictions.indexOf(diet);
    if (index >= 0) {
      this.guest.dietRestrictions.splice(index, 1);
    }
    return this.docReference.update(this.guest);
  }

  onPhoneNumberBlur($event): Promise<any> {
    this.guest.phonenumber = $event.target.value;
    return this.updateGuest();
  }

  onNativeInputFileSelect($event): void {
    if ($event.target.files && $event.target.files[0]) {
      this.awaitingImageEvaluation = true;
      this.profileImageUploadService.postFile($event.target.files[0])
        .then(response => {
          if (response.status === 'OK') {
            this.previewUrl = response.url;
            this.guest.photo_url = response.url;
            this.guest.landmarked_photo_url = response.landmarked_url;
            this.guest.landmark_url = response.landmark_url;
            this.guest.thumbnail_url = response.thumbnail_url;
            this.updateGuest();
          } else {
            this.openFaceErrorDialog(response.status);
          }
          this.profileImageStatus = response.status;
        })
        .catch(c => console.error(c));
    }
  }

  openFaceErrorDialog(status: string) {
    const dialogRef = this.dialog.open(FaceErrorDialogComponent, {
      data: {error: this.faceError[status], advice: this.faceAdvice[status]}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.awaitingImageEvaluation = false;
    });
  }

  private fetchGuestInfo(): Promise<void> {
    this.docReference = this.db.collection('guests').doc<Guest>(this.userId);
    return this.docReference.valueChanges()
      .forEach(guest => {
        this.guest = guest;
        if (this.guest.photo_url !== undefined) {
          this.previewUrl = this.guest.photo_url;
          this.profileImageStatus = 'OK';
        }
      });
  }

  private updateGuest(): Promise<any> {
    return this.docReference.update(this.guest);
  }

  private fetchState() {
    this.db.collection('general')
      .doc<ApplicationState>('state')
      .valueChanges()
      .forEach(state => this.signupPeriod = state.signupPeriod);
  }

}

@Component({
  selector: 'app-face-error-dialog',
  templateUrl: './app-face-error-dialog.html',
})
export class FaceErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
