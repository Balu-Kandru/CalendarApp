import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AppointmentFormComponent } from "./appointment-form.component";

@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        
    ],
    declarations: [AppointmentFormComponent],
    providers:[],
})

export class AppointmentFormModule{
    constructor(){ }
}