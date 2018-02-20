import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {GuessState, InitialPlayerStats, PlayerStats, Track} from './declarations';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.resetGuesses = functions.firestore
  .document('musicquiz/current_track')
  .onUpdate(event => {

    const newTrack = <Track> event.data.data();
    const previousTrack = <Track> event.data.previous.data();

    if (newTrack.name !== previousTrack.name) {
      const reference = db.collection('musicquiz').doc('guesses').collection('users');
      const query = reference.orderBy('__name__');
      return new Promise((resolve, reject) => {
        query.get()
          .then((snapshot) => {

            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
              batch.set(doc.ref, {haveGuessed: false, guessWasCorrect: false});
            });

            return batch.commit().then(() => {
              return;
            });

          }).then((numDeleted) => {
          resolve();
          return;
        })
          .catch(reject);
      });
    } else {
      return event;
    }

  });

exports.addReward = functions.firestore
  .document('musicquiz/guesses/users/{userId}')
  .onUpdate(event => {

    const guessState = <GuessState> event.data.data();

    if (guessState.guessWasCorrect) {

      let playerStats: PlayerStats = addReward({points: 0, responses: 0, tens: 0}, guessState.reward);
      const userId = event.params.userId;
      const statsRef = db.collection('musicquiz').doc('scoreboard').collection('stats').doc(userId);

      return statsRef.get()
        .then(doc => {
          if (doc.exists) {
            playerStats = addReward(<PlayerStats> doc.data(), guessState.reward);
            statsRef.update(playerStats);
          } else {
            statsRef.set(playerStats);
          }
        })
        .catch(err => {
          console.log(err);
        });

    } else {
      return event;
    }

  });

function addReward(playerStats: PlayerStats, reward: number): PlayerStats {
  playerStats.points += reward;
  playerStats.responses++;
  if (reward === 10) {
    playerStats.tens++;
  }
  return playerStats;
}
