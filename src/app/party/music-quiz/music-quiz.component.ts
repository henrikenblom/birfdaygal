import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ApplicationState, GuessState, PlayerStats, ResponseOption, Track} from '../../../../functions/src/declarations';
import {AuthService} from '../../auth.service';
import {PartyUtils} from '../../../quiz-utils';

@Component({
  selector: 'app-music-quiz',
  templateUrl: './music-quiz.component.html'
})
export class MusicQuizComponent implements OnInit {

  REWARD_ADJUSTMENT_SCALE = 0.2303;
  MAX_RANDOM_IMAGE_INDEX = 16;
  currentTrack: Track;
  currentArtistInformation: ArtistInformation;
  playerStats: PlayerStats;
  responseOptions: ResponseOption[];
  generalStateQuizRunning = false;
  quizRunning = false;
  guessState: GuessState = {guessWasCorrect: false, haveGuessed: false, reward: 0};
  stateSynced = false;
  guessable = true;
  randomImageIndex = 1;

  constructor(private db: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.initializeState();
    this.fetchGeneralState();
    this.fetchCurrentTrack();
  }

  guess(responseOption: ResponseOption) {
    this.guessState = {
      guessWasCorrect: responseOption.correct,
      haveGuessed: true,
      reward: this.adjustReward(this.currentTrack.reward)
    };
    this.responseOptions = [];
    this.db.collection('musicquiz')
      .doc('guesses')
      .collection('users')
      .doc(this.authService.userId)
      .set(this.guessState);
  }

  adjustReward(reward: number) {
    return Math.floor(Math.exp(reward * this.REWARD_ADJUSTMENT_SCALE));
  }

  private fetchCurrentTrack() {
    this.db.collection('musicquiz')
      .doc<Track>('current_track')
      .valueChanges()
      .forEach(track => {
        const update = this.currentTrack === undefined
          || (this.currentTrack.name !== track.name
            || this.currentTrack.artist_id !== track.artist_id);
        this.currentTrack = track;
        this.quizRunning = this.currentTrack.is_playing;
        this.randomImageIndex = PartyUtils.randomizeIndex(this.MAX_RANDOM_IMAGE_INDEX);
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
          this.responseOptions = [];
          this.currentArtistInformation = artistInformation;
          this.responseOptions[0] = {response: artistInformation.name, correct: true};
          this.responseOptions[1] = {response: artistInformation.related_artists[0], correct: false};
          this.responseOptions[2] = {response: artistInformation.related_artists[1], correct: false};
          PartyUtils.shuffleResponses(this.responseOptions);
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
          docReference.set(this.guessState);
        }
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
        this.stateSynced = true;
      });
  }

  private fetchGeneralState() {
    this.db.collection('general')
      .doc<ApplicationState>('state')
      .valueChanges()
      .forEach(state => {
        this.generalStateQuizRunning = state.musicQuizRunning;
      });
  }

}
