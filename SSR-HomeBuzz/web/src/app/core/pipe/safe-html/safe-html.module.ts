import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
  ],
  declarations: [
    SafeHtmlPipe
  ],
  exports : [
    SafeHtmlPipe
  ],
})
export class SafeHtmlModule { }
