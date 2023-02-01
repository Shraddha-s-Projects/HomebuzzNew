import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatNativeDateModule, MatSortModule, MatPaginator, MatPaginatorModule, MatButtonToggleModule, MatFormFieldModule, MatSlideToggleModule, MatIconModule } from '@angular/material';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToasterModule } from 'angular2-toaster';
import { MatSelectModule } from '@angular/material/select';
import { AuthMessageModule } from 'src/app/modal/auth-message/auth-message.module';
import { CommonService } from 'src/app/core/services/common.service';

export const ROUTES: Routes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    ToasterModule,
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
  declarations: [UsersComponent],
  exports: [UsersComponent,MatPaginatorModule, MatSortModule],
  providers: [CommonService, UsersService],
  entryComponents: []
})
export class UsersModule { }
