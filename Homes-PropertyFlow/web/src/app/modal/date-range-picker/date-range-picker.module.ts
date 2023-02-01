import { NgModule } from '@angular/core';
// Material
import { MatFormFieldModule, MatInputModule,MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule} from '@angular/material';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateRangePickerComponent } from './date-range-picker.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';

@NgModule({
    declarations: [
       DateRangePickerComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterModule,
        SatDatepickerModule,
        SatNativeDateModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,

    ],
    exports: [
        // Component
        DateRangePickerComponent,
        // Modules
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        // DateRangePicker
        SatDatepickerModule,
        SatNativeDateModule,
    ],
    providers: [DatePipe ],
    entryComponents: [ ]
})
export class DateRangePickerModule { }
