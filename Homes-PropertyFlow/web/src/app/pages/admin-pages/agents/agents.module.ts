import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AgentsComponent } from './agents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatNativeDateModule, MatCheckboxModule, MatTableModule, MatSortModule, MatPaginatorModule, MatSlideToggleModule, MatFormFieldModule, MatButtonToggleModule, MatIconModule, MatSelectModule } from '@angular/material';
import { AgentsService } from './agents.service';
import { AuthMessageModule } from 'src/app/modal/auth-message/auth-message.module';
import { CommonService } from 'src/app/core/services/common.service';

export const ROUTES: Routes = [
  { path: '', component: AgentsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    MatDialogModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    AuthMessageModule
  ],
  declarations: [AgentsComponent],
  exports: [AgentsComponent, MatPaginatorModule, MatSortModule],
  providers: [CommonService, AgentsService],
  entryComponents: []
})
export class AgentsModule { }
