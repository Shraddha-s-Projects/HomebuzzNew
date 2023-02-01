import { ToasterService } from 'angular2-toaster';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ErrorMessage } from '../../../../app/core/services/errormessage.service';
import { CommonService } from '../../../../app/core/services/common.service';
import { InputTrimModule } from 'ng2-trim-directive';
import { AuthMessageModule } from '../../../../app/modal/auth-message/auth-message.module';
import { AgentSignupComponent } from './agent-signup.component';
import { MatStepperModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule } from '@angular/material';
import { AgentSignUpService } from './agent-signup.service';
export const ROUTES: Routes = [
    { path: '', component: AgentSignupComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        CommonModule, RouterModule, FormsModule,
        LaddaModule,
        ToasterModule,
        HttpClientModule, InputTrimModule, AuthMessageModule,
        MatStepperModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatCardModule
    ],
    declarations: [
        AgentSignupComponent
    ],
    providers: [
        ErrorMessage, CommonService, ToasterService, AgentSignUpService
    ]
})
export class AgentSignupModule { }
