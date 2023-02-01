import { ToasterService, ToasterModule } from "angular2-toaster";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommonService } from "../../../app/core/services/common.service";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { PopoverModule } from "ngx-bootstrap/popover";
import { CommonModalService } from "../../../app/common-modal.service";
import { AgentLayoutComponent } from "./agent-layout.component";
import { MatDialogModule } from "@angular/material";
import { AgentHeaderModule } from "../agent-header/agent-header.module";
import { AgentFooterModule } from "../agent-footer/agent-footer.module";
import { AgentDashboardModule } from "../../../app/pages/agent-pages/agent-dashboard/agent-dashboard.module";

@NgModule({
    imports: [
        AgentHeaderModule,
        AgentFooterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ToasterModule,
        ModalModule,
        MatDialogModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        PopoverModule.forRoot(),
        AgentDashboardModule
    ],
    declarations: [AgentLayoutComponent],
    exports: [AgentLayoutComponent],
    providers: [ErrorMessage,CommonModalService, ToasterService, CommonService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: []
})
export class AgentLayoutModule { }
