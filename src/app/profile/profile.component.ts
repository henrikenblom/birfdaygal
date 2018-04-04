import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {Guest} from '../../../functions/src/declarations';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {SafeUrl} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {ProfileImageUploadService} from '../profile-image-upload.service';
import {StateService} from '../state.service';
import {TwinsService} from '../twins.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('nativeInput')
  nativeInputFile: ElementRef;
  guest: Guest;
  docReference: AngularFirestoreDocument<Guest>;
  profileImageStatus = 'NOT_SET';
  previewUrl: SafeUrl = '../../assets/batman.jpg';
  awaitingImageEvaluation = false;
  faceError = {
    NO_FACE: 'Det gick tyvärr inte att hitta något ansikte i bilden.',
    TOO_MANY_FACES: 'Det är fler än en person i bilden.',
    NO_FULL_FACE: 'Det gick inte att hitta något tydligt ansikte i bilden.',
    PRANK_TRY: 'Haha, den gubben går inte. Du kan bara ha dig själv som profilbild.'
  };
  faceAdvice = {
    NO_FACE: 'Ta en selfie med frontkameran eller be lillebror, PT:n eller frugan ta en med den bakre. (Kameran alltså)',
    TOO_MANY_FACES: 'Tyvärr får du försöka skiljas från mormor, syrran eller chefen när du knäpper den här selfien.',
    NO_FULL_FACE: 'Se till att fota rakt framifrån, att hela ansiktet är med och att ljuset är tillräckligt.',
    PRANK_TRY: 'Försök att rikta åtminstone en av kameralinserna mot din egen fejja.'
  };

  constructor(public router: Router,
              private authService: AuthService,
              private db: AngularFirestore,
              private profileImageUploadService: ProfileImageUploadService,
              public dialog: MatDialog,
              public stateService: StateService,
              public twinService: TwinsService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.fetchGuestInfo();
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  selectFile() {
    this.nativeInputFile.nativeElement.click();
  }

  onNativeInputFileSelect($event): void {
    if ($event.target.files && $event.target.files[0]) {
      this.awaitingImageEvaluation = true;
      this.twinService.compareByPhoto($event.target.files[0])
        .then(comparisonResult => {
          if (comparisonResult.status === 'PRANK_TRY') {
            this.openFaceErrorDialog('PRANK_TRY');
          } else {
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
        });
    }
  }

  profileEditDone() {
    this.router.navigateByUrl(this.stateService.urlAfterProfileChange);
  }

  private fetchGuestInfo(): Promise<void> {
    this.docReference = this.db.collection('guests').doc<Guest>(this.authService.userId);
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

  openFaceErrorDialog(status: string) {
    const dialogRef = this.dialog.open(ProfileFaceErrorDialogComponent, {
      data: {error: this.faceError[status], advice: this.faceAdvice[status]}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.awaitingImageEvaluation = false;
    });
  }
}

@Component({
  selector: 'app-face-error-dialog',
  templateUrl: '../sign-up/app-face-error-dialog.html',
})
export class ProfileFaceErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
