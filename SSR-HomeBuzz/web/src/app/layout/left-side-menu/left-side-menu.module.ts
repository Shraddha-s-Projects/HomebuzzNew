import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeftSideMenuComponent } from './left-side-menu.component';
import { LeftSideMenuService } from './left-side-menu.service';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule
  ],
  declarations: [LeftSideMenuComponent],
  exports : [LeftSideMenuComponent],
  providers: [ LeftSideMenuService ]
})
export class LeftSideMenuModule { }
