import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'countDownUnit'
})
export class CountDownUnitPipe implements PipeTransform {

  transform(value: number, unit: string): any {
    let unitString = '';
    switch (unit) {
      case 'days':
        if (value === 1) {
          unitString = 'dag';
        } else {
          unitString = 'dagar';
        }
        break;
      case 'hours':
        if (value === 1) {
          unitString = 'timme';
        } else {
          unitString = 'timmar';
        }
        break;
      case 'minutes':
        if (value === 1) {
          unitString = 'minut';
        } else {
          unitString = 'minuter';
        }
        break;
      case 'seconds':
        if (value === 1) {
          unitString = 'sekund';
        } else {
          unitString = 'sekunder';
        }
        break;
    }
    return value + ' ' + unitString;
  }

}
