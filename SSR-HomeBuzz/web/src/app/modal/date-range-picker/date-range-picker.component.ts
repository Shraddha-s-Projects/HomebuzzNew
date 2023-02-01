import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
class DateRange {
  startDate: any;
  endDate: any;
}

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  @Output() dateRange = new EventEmitter<any>();
  @Input() startDate: any;
  @Input() endDate: any;
  range: DateRange = new DateRange();
  public today = new Date();
  selectedDates: any;
  constructor(public datepipe: DatePipe) { }

  ngOnInit() { 
    this.selectedDates = {
      begin: this.startDate,
      end: this.endDate
    }
  }

  EndDateChange(event: any) {
    this.range.startDate = new Date(event.value.begin).toString();
    this.range.endDate = new Date(event.value.end).toString();
    this.EmitDateRange(this.range);
  }

  EmitDateRange(dateRange: any) {
    this.dateRange.emit(dateRange);
  }

  clear() {
    this.selectedDates = '';
    this.range.startDate = '';
    this.range.endDate = '';
    this.EmitDateRange(this.range);
  }
}
