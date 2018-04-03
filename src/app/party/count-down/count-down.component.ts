import {Component, OnInit} from '@angular/core';
import {CountDownService, Time} from '../count-down.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit {

  partyCountDown: Observable<Time>;

  constructor(private countDownService: CountDownService) {
  }

  ngOnInit() {
    this.partyCountDown = this.countDownService.timer(new Date('2018-04-07 18:00:00'));
  }

}
