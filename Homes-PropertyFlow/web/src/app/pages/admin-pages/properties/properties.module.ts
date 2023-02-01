import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatNativeDateModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatTableModule, MatSlideToggleModule, MatFormFieldModule, MatButtonToggleModule, MatIconModule, MatSelectModule } from '@angular/material';
import { PropertiesComponent } from './properties.component';
import { PropertiesService } from './properties.service';
import { AuthMessageModule } from 'src/app/modal/auth-message/auth-message.module';
import { CommonService } from 'src/app/core/services/common.service';

export const ROUTES: Routes = [
  { path: '', component: PropertiesComponent }
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
  declarations: [PropertiesComponent],
  exports: [PropertiesComponent, MatPaginatorModule, MatSortModule],
  providers: [CommonService, PropertiesService],
  entryComponents: []
})
export class PropertiesModule { }
