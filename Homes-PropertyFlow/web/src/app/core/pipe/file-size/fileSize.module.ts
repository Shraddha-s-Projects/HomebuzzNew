import { FileSizePipe } from './fileSize.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
  ],
  declarations: [
    FileSizePipe
  ],
  exports : [
    FileSizePipe
  ],
})
export class FileSizeModule { }
