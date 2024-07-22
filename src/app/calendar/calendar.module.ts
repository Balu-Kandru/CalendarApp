import { NgModule } from "@angular/core";
import { CalendarComponent } from "./calendar.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CalendarRoutingModule } from "./calendar-routing.module";
import { FormsModule } from "@angular/forms";

@NgModule({

    imports: [
        CalendarRoutingModule,
        CommonModule,
        RouterModule,
        FormsModule,
    ],
    declarations: [CalendarComponent],
    providers:[],
})

export class CalendarModule{
    constructor(){
        console.log("fknsigseh");
    }
}