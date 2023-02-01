import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatInputModule, MatNativeDateModule, MatButtonModule } from '@angular/material';
import { SellerReadMoreComponent } from './seller-read-more.component';
import { HeaderModule } from 'src/app/layout/header/header.module';
import { HomebuzzEstimatesModule } from 'src/app/modal/homebuzz-estimates/homebuzz-estimates.module';
import { CommonService } from 'src/app/core/services/common.service';

export const ROUTES: Routes = [
  { path: '', component: SellerReadMoreComponent }
];

@NgModule({
  declarations: [SellerReadMoreComponent],
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    HeaderModule,
    HomebuzzEstimatesModule
  ],
  exports:[SellerReadMoreComponent],
  providers: [CommonService],
  entryComponents: []
})
export class SellerReadMoreModule { }
