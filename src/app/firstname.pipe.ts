import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'firstname'
})
export class FirstnamePipe implements PipeTransform {

  transform(value: string): string {
    return value.split(' ')[0];
  }

}
