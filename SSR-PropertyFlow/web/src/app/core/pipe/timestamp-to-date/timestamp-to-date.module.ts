import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimestampToDatePipe } from './timestamp-to-date.pipe';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
  ],
  declarations: [
    TimestampToDatePipe
  ],
  providers: [DatePipe],
  exports : [
    TimestampToDatePipe
  ],
})
export class TimestampToDateModule { }
