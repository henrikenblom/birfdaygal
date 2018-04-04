export interface Track {
  name: string;
  artist_name: string;
  artist_id: string;
  is_playing: boolean;
  reward: number;
  song_start?: Date;
}

export interface PlayerStats {
  points: number;
  tens: number;
  responses: number;
}

export class InitialPlayerStats implements PlayerStats {
  points = 0;
  tens = 0;
  responses = 0;
}

export interface MusicQuizGuess {
  guessWasCorrect: boolean;
  reward: number;
  guessDate: Date;
}

export interface GuessState {
  haveGuessed: boolean;
  guessWasCorrect: boolean;
  reward: number;
}

export interface ApplicationState {
  partyStarted: boolean;
  signupPeriod: boolean;
  musicQuizRunning: boolean;
}

export interface Guest {
  name: string;
  nickname?: string;
  phonenumber?: string;
  photo_url?: string;
  landmarked_photo_url?: string;
  landmark_url?: string;
  thumbnail_url?: string;
  dietRestrictions?: DietRestriction[];
  willAttend: boolean;
  hasResponded: boolean;
  formComplete: boolean;
  isLoggedIn: boolean;
  relationship_description?: string;
  id?: string;
}

export interface DietRestriction {
  name: string;
}

export interface InteractionEvent {
  userId: string;
  type: string;
  time: Date
}

export enum InteractionEventType {
  LOGGED_IN = 0,
  LOGGED_OUT = 1,
  COMPLETED_SIGNUP = 2,
  SET_STATUS_WILL_ATTEND = 3,
  SET_STATUS_WILL_NOT_ATTEND = 4,
  SET_PROFILE_PHOTO = 5
}

export interface QuizQuestion {
  question: string;
  correctAnswer: string;
  firstIncorrectAnswer: string;
  secondIncorrectAnswer: string;
  correctPhrase: string;
  incorrectPhrase: string;
  id?: string;
}

export interface ResponseOption {
  response: string;
  correct: boolean;
}

export interface SMS {
  phoneNumber: string;
  userId: string;
  body: string;
  sent?: boolean;
}
