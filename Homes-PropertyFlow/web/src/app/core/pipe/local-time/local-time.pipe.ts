import { Pipe, PipeTransform } from '@angular/core';
import { UtilityComponent } from '../../services/utility';

@Pipe({
  name: 'localTime',
  pure: true
})
export class LocalTimePipe implements PipeTransform {
  transform(value: string) {
    return UtilityComponent.convertUTCDateToLocalDate(new Date(value));
  }
}