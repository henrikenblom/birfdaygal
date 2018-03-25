import {Component, Input, ViewChild} from '@angular/core';
import {Guest, MusicQuizGuess, PlayerStats, ResponseOption} from '../../../../functions/src/declarations';
import {PartyUtils} from '../../../quiz-utils';
import {AngularFirestore} from 'angularfire2/firestore';
import * as Chartist from 'chartist';
import {ChartistComponent} from 'ng-chartist';

@Component({
  selector: 'app-guest-view',
  templateUrl: './guest-view.component.html'
})
export class GuestViewComponent {

  MAX_RANDOM_IMAGE_INDEX = 9;
  @ViewChild('musicQuizChart')
  musicChartRef: ChartistComponent;
  @Input()
  guest: Guest;
  randomImageIndex = PartyUtils.randomizeIndex(this.MAX_RANDOM_IMAGE_INDEX);
  panelOpenState = false;
  neverOpened = true;
  quizScore = 0;
  quizPerformance = 0;
  quizAnswers = 0;
  musicQuizPlayerStats: PlayerStats = {points: 0, responses: 0, tens: 0};
  musicChartOptions = {
    axisX: {
      offset: 0,
      position: 'end',
      labelOffset: {
        x: 0,
        y: 0
      },
      showLabel: false,
      showGrid: false,
      labelInterpolationFnc: Chartist.noop,
      scaleMinSpace: 30,
      onlyInteger: false
    },
    axisY: {
      offset: 20,
      position: 'start',
      labelOffset: {
        x: 0,
        y: 0
      },
      showLabel: true,
      showGrid: true,
      labelInterpolationFnc: Chartist.noop,
      scaleMinSpace: 20,
      onlyInteger: true
    },
    width: undefined,
    height: 100,
    high: 10,
    low: 0,
    referenceValue: 0,
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    seriesBarDistance: 0,
    stackBars: false,
    stackMode: 'overlap',
    horizontalBars: false,
    distributeSeries: false,
    reverseData: false,
    showGridBackground: false,
    classNames: {
      chart: 'ct-chart-bar',
      horizontalBars: 'ct-horizontal-bars',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      bar: 'ct-bar',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      gridBackground: 'ct-grid-background',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };
  musicChartData = {
    'series': [
      []
    ]
  };

  constructor(private db: AngularFirestore) {
  }

  setPanelOpenState(state: boolean) {
    this.panelOpenState = state;
    if (this.neverOpened) {
      this.neverOpened = false;
      this.fetchMusicQuizScore();
      this.fetchMusicQuizStats();
      this.calculateQuizScore();
    }
  }

  private fetchMusicQuizScore() {
    if (this.guest.id) {
      this.db.collection('musicquiz')
        .doc('scoreboard')
        .collection('stats')
        .doc<PlayerStats>(this.guest.id)
        .valueChanges()
        .forEach(playerStats => {
          if (playerStats) {
            this.musicQuizPlayerStats = playerStats;
          }
        });
    }
  }

  private fetchMusicQuizStats() {
    if (this.guest.id) {
      this.db.collection('musicquiz')
        .doc('history')
        .collection<MusicQuizGuess>(this.guest.id, ref => ref.orderBy('guessDate', 'asc'))
        .valueChanges()
        .forEach(guesses => {
          const series = [];
          for (const guess of guesses) {
            series.push(guess.reward + 0.1);
          }
          this.musicChartData.series = [series];
          if (this.musicChartRef) {
            this.musicChartRef.update({});
          }
        });
    }
  }

  private calculateQuizScore() {
    this.db.collection('quiz')
      .doc(this.guest.id)
      .collection<ResponseOption>('answers')
      .valueChanges()
      .forEach(data => {
        this.quizScore = 0;
        this.quizAnswers = 0;
        for (const answer of data) {
          if (answer.correct) {
            this.quizScore++;
          }
          this.quizAnswers++;
        }
        this.quizPerformance = (this.quizScore / this.quizAnswers) * 100;
      });
  }

}
