import { NgModule } from "@angular/core";
import { CalendarComponent } from "./calendar.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CalendarRoutingModule } from "./calendar-routing.module";
import { FormsModule } from "@angular/forms";
import { AppointmentFormModule } from "../appointment-form/appointment-form.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from '@angular/material/icon';

@NgModule({

    imports: [
        CalendarRoutingModule,
        CommonModule,
        RouterModule,
        FormsModule,
        MatTooltipModule,
        MatIconModule,
        AppointmentFormModule,
    ],
    declarations: [CalendarComponent],
    providers:[],
})

export class CalendarModule{
    constructor(){
        console.log("fknsigseh");
    }
}