import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliceThumbnailPipe } from './slice-thumbnail.pipe';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
  ],
  declarations: [
    SliceThumbnailPipe
  ],
  exports : [
    SliceThumbnailPipe
  ],
})
export class SliceThumbnailModule { }
