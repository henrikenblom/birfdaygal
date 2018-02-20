import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {GuessState, InitialGuessState, PlayerStats, Track} from '../../../../functions/src/declarations';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-music-quiz',
  templateUrl: './music-quiz.component.html'
})
export class MusicQuizComponent implements OnInit {

  currentTrack: Track;
  currentArtistInformation: ArtistInformation;
  playerStats: PlayerStats;
  responseOptions: string[];
  quizRunning = false;
  guessState: GuessState = new InitialGuessState();
  stateSynced = false;
  guessable = true;
  randomImageIndex = 1;

  constructor(private db: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.initializeState();
    this.fetchCurrentTrack();
  }

  guess(artist: string) {
    this.guessState = {
      guessWasCorrect: this.currentTrack.artist_name === artist,
      haveGuessed: true,
      reward: this.currentTrack.reward
    };
    this.db.collection('musicquiz')
      .doc('guesses')
      .collection('users')
      .doc(this.authService.userId)
      .set(this.guessState);
  }

  private fetchCurrentTrack() {
    this.db.collection('musicquiz')
      .doc<Track>('current_track')
      .valueChanges()
      .forEach(track => {
        const update = this.currentTrack === undefined || this.currentTrack.name !== track.name;
        this.currentTrack = track;
        this.quizRunning = this.currentTrack.is_playing;
        this.randomImageIndex = Math.floor(Math.random() * (16 - 1 + 1)) + 1;
        if (update) {
          this.guessable = true;
          this.guessState.haveGuessed = false;
          this.fetchCurrentArtistInformation();
        }
      });
  }

  private fetchCurrentArtistInformation() {
    this.db.collection('musicquiz')
      .doc('artists')
      .collection('played')
      .doc<ArtistInformation>(this.currentTrack.artist_id)
      .valueChanges()
      .forEach(artistInformation => {
        if (artistInformation !== null) {
          this.currentArtistInformation = artistInformation;
          this.responseOptions = artistInformation.related_artists;
          this.responseOptions[2] = artistInformation.name;
          this.shuffle(this.responseOptions);
          this.guessable = true;
        } else {
          this.responseOptions = [];
          this.guessable = false;
        }
      });
  }

  private initializeState() {
    const docReference = this.db.collection('musicquiz')
      .doc('guesses')
      .collection('users')
      .doc(this.authService.userId);
    const statsReference = this.db.collection('musicquiz')
      .doc('scoreboard')
      .collection('stats')
      .doc(this.authService.userId);

    docReference.ref.get()
      .then(doc => {
        this.guessState.haveGuessed = doc.exists;
        if (doc.exists) {
          this.guessState.guessWasCorrect = doc.data()['correct'];
        } else {
          docReference.set(new InitialGuessState());
        }
        this.stateSynced = true;
      }).then(() => this.fetchState());

    statsReference.ref.get()
      .then(doc => {
        if (!doc.exists) {
          docReference.set({points: 0, responses: 0, tens: 0});
        }
      }).then(() => this.fetchPlayerStats());

  }

  private fetchPlayerStats() {
    const statsReference = this.db.collection('musicquiz')
      .doc('scoreboard')
      .collection('stats')
      .doc<PlayerStats>(this.authService.userId)
      .valueChanges()
      .forEach(stats => {
        this.playerStats = stats;
      });
  }

  private fetchState() {
    this.db.collection('musicquiz')
      .doc('guesses')
      .collection('users')
      .doc<GuessState>(this.authService.userId)
      .valueChanges()
      .forEach(guessState => {
        if (guessState !== null) {
          this.guessState.haveGuessed = guessState.haveGuessed;
          this.guessState.guessWasCorrect = guessState.guessWasCorrect;
        }
      });
  }

  private shuffle(array: string[]): string[] {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
