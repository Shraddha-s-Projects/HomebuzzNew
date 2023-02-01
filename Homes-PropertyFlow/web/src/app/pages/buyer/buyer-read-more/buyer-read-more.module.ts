import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerReadMoreComponent } from './buyer-read-more.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatInputModule, MatNativeDateModule, MatButtonModule } from '@angular/material';
import { HeaderModule } from 'src/app/layout/header/header.module';
import { HomebuzzEstimatesModule } from 'src/app/modal/homebuzz-estimates/homebuzz-estimates.module';
import { CommonService } from 'src/app/core/services/common.service';

export const ROUTES: Routes = [
  { path: '', component: BuyerReadMoreComponent }
];

@NgModule({
  declarations: [BuyerReadMoreComponent],
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
  exports:[BuyerReadMoreComponent],
  providers: [CommonService],
  entryComponents: []
})
export class BuyerReadMoreModule { }
