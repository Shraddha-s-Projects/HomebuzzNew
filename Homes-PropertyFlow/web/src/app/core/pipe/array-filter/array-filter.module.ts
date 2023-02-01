import { ArrayFilterPipe } from './array-filter.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
  ],
  declarations: [
    ArrayFilterPipe
  ],
  exports : [
    ArrayFilterPipe
  ],
})
export class ArrayFilterModule { }
