export interface Track {
  name: string;
  artist_name: string;
  artist_id: string;
  is_playing: boolean;
  reward: number;
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

export interface GuessState {
  haveGuessed: boolean;
  guessWasCorrect: boolean;
  reward: number;
}

export class InitialGuessState implements GuessState {
  haveGuessed = false;
  guessWasCorrect = false;
  reward: 0;
}

export interface ApplicationState {
  partyStarted: boolean;
}

export interface Guest {
  name: string;
  nickname?: string;
  phonenumber?: string;
  photo_url?: string;
  landmarked_photo_url?: string;
  landmark_url?: string;
  dietRestrictions?: DietRestriction[];
  willAttend: boolean;
  hasResponded: boolean;
  formComplete: boolean;
  isLoggedIn: boolean;
}

export interface DietRestriction {
  name: string;
}
