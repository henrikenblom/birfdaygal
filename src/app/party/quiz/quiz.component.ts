import {Component, OnInit} from '@angular/core';
import {QuizQuestion, ResponseOption} from '../../../../functions/src/declarations';
import {AngularFirestore} from 'angularfire2/firestore';
import {AuthService} from '../../auth.service';
import {PartyUtils} from '../../../quiz-utils';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html'
})
export class QuizComponent implements OnInit {

  MAX_RANDOM_IMAGE_INDEX = 4;
  MAX_RANDOM_MALLAN_IMAGE_INDEX = 12;
  answers: Map<string, ResponseOption> = new Map();
  questions: QuizQuestion[] = [];
  lastAnswer: ResponseOption;
  currentQuestion: QuizQuestion;
  responseOptions: ResponseOption[];
  onLastQuestion = false;
  hasResponded = false;
  initialized = false;
  quizStarted = false;
  quizEnded = false;
  randomImageIndex = 1;
  randomMallanImageIndex = PartyUtils.randomizeIndex(this.MAX_RANDOM_MALLAN_IMAGE_INDEX);
  score = 0;
  performance = 0;

  constructor(private db: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit() {
    const parent = this;
    this.populateQuestions().then(() => {
      this.fetchAnswers(parent);
    });
  }

  guess(responseOption: ResponseOption) {
    this.hasResponded = true;
    this.lastAnswer = responseOption;
    this.randomImageIndex = PartyUtils.randomizeIndex(this.MAX_RANDOM_IMAGE_INDEX);
    this.randomMallanImageIndex = PartyUtils.randomizeIndex(this.MAX_RANDOM_MALLAN_IMAGE_INDEX);
    this.db.collection('quiz')
      .doc(this.authService.userId)
      .collection('answers')
      .doc(this.currentQuestion.id)
      .set(responseOption);
  }

  private randomizeImageIndex() {
    this.randomImageIndex = Math.floor(Math.random() * (this.MAX_RANDOM_IMAGE_INDEX - 1 + 1)) + 1;
  }

  private fetchAnswers(parent: QuizComponent) {
    this.db.collection('quiz')
      .doc(this.authService.userId)
      .collection('answers')
      .snapshotChanges()
      .forEach(data => {
        this.score = 0;
        let c = 0;
        for (const answerDocument of data) {
          const answer: ResponseOption = answerDocument.payload.doc.data() as ResponseOption;
          this.answers.set(answerDocument.payload.doc.id, answer);
          if (answer.correct) {
            this.score++;
          }
          c++;
        }
        this.performance = (this.score / c) * 100;
        if (this.answers.size > 0 && !this.currentQuestion) {
          this.showNextQuestion();
        }
        this.initialized = true;
      });
  }

  showNextQuestion() {
    delete this.lastAnswer;
    this.hasResponded = false;
    this.quizStarted = true;
    let noMoreQuestions = true;
    let i = 1;
    for (const question of this.questions) {
      this.onLastQuestion = i++ === this.questions.length;
      if (!this.answers.has(question.id)) {
        this.currentQuestion = question;
        this.responseOptions = [];
        this.responseOptions[0] = {response: question.correctAnswer, correct: true};
        this.responseOptions[1] = {response: question.firstIncorrectAnswer, correct: false};
        this.responseOptions[2] = {response: question.secondIncorrectAnswer, correct: false};
        PartyUtils.shuffleResponses(this.responseOptions);
        noMoreQuestions = false;
        break;
      }
    }
    this.quizEnded = noMoreQuestions;
  }

  private populateQuestions(): Promise<any> {
    return this.db.collection('quiz')
      .doc('data')
      .collection('questions')
      .snapshotChanges()
      .take(1)
      .forEach(data => {
        this.questions = [];
        for (const questionDocument of data) {
          const question: QuizQuestion = questionDocument.payload.doc.data() as QuizQuestion;
          question.id = questionDocument.payload.doc.id;
          this.questions.push(question);
        }
      });
  }

}
