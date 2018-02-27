import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {GuessState, Guest, InteractionEvent, InteractionEventType, PlayerStats, Track} from './declarations';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.recordInteraction = functions.firestore
  .document('guests/{userId}')
  .onUpdate(event => {

    const currentGuestData = <Guest> event.data.data();
    const previousGuestData = <Guest> event.data.previous.data();
    const userId = event.params.userId;
    let retval: Promise<any>;

    if (currentGuestData.photo_url !== previousGuestData.photo_url)
      retval = addInteractionEvent(userId, InteractionEventType.SET_PROFILE_PHOTO);

    if (currentGuestData.willAttend && !previousGuestData.willAttend)
      retval = addInteractionEvent(userId, InteractionEventType.SET_STATUS_WILL_ATTEND);

    if (!currentGuestData.willAttend && previousGuestData.willAttend)
      retval = addInteractionEvent(userId, InteractionEventType.SET_STATUS_WILL_NOT_ATTEND);

    if (currentGuestData.isLoggedIn && !previousGuestData.isLoggedIn)
      retval = addInteractionEvent(userId, InteractionEventType.LOGGED_IN);

    if (!currentGuestData.isLoggedIn && previousGuestData.isLoggedIn)
      retval = addInteractionEvent(userId, InteractionEventType.LOGGED_OUT);

    if (currentGuestData.formComplete && !previousGuestData.formComplete)
      retval = addInteractionEvent(userId, InteractionEventType.COMPLETED_SIGNUP);

    return retval;

  });

function addInteractionEvent(userId: string, eventType: InteractionEventType) {
  const interactionEvent: InteractionEvent = {
    userId: userId,
    type: InteractionEventType[eventType],
    time: new Date()
  };
  return db.collection('interaction_events').doc('' + interactionEvent.time.getTime()).set(interactionEvent);
}

exports.musicQuizResetGuesses = functions.firestore
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

exports.musizQuizHandleGuess = functions.firestore
  .document('musicquiz/guesses/users/{userId}')
  .onUpdate(event => {

    const guessState = <GuessState> event.data.data();

    if (guessState.guessWasCorrect) {

      let playerStats: PlayerStats = musicQuizAddReward({points: 0, responses: 0, tens: 0}, guessState.reward);
      const userId = event.params.userId;
      const statsRef = db.collection('musicquiz').doc('scoreboard').collection('stats').doc(userId);

      return statsRef.get()
        .then(doc => {
          if (doc.exists) {
            playerStats = musicQuizAddReward(<PlayerStats> doc.data(), guessState.reward);
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

function musicQuizAddReward(playerStats: PlayerStats, reward: number): PlayerStats {
  playerStats.points += reward;
  playerStats.responses++;
  if (reward === 10) {
    playerStats.tens++;
  }
  return playerStats;
}
