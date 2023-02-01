import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timestampToDate',
  pure: true
})
export class TimestampToDatePipe implements PipeTransform {
    
  constructor(private datePipe: DatePipe) { }

  transform(value:number, format:string) {
    var dt = new Date(value);
    var tempDt = new Date(value);
    var todaysDate = new Date();
    
    if(format == "FULL") return this.datePipe.transform(dt, 'MMM d, y At h:mm a');

    if(tempDt.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) return this.datePipe.transform(dt, 'shortTime');
    
    return this.datePipe.transform(dt, 'EEE d-MMM');
  }
}