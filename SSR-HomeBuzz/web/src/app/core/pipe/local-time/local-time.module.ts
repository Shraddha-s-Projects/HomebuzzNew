import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalTimePipe } from './local-time.pipe';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
  ],
  declarations: [
    LocalTimePipe
  ],
  exports : [
    LocalTimePipe
  ],
})
export class LocalTimeModule { }
