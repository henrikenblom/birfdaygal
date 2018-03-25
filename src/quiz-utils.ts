import {ResponseOption} from '../functions/src/declarations';

export class PartyUtils {
  public static shuffleResponses(array: ResponseOption[]): ResponseOption[] {
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

  public static randomizeIndex(maxIndex: number) {
    return Math.floor(Math.random() * (maxIndex - 1 + 1)) + 1;
  }
}
