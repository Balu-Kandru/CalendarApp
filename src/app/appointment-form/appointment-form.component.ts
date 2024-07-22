import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment, initialAppointment } from '../state/appointment.model';
import { Store } from '@ngrx/store';
import * as fromAppointment from './../state/appointment.selector';
import * as AppointmentActions from './../state/appointment.actions';
@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {

  private readonly dialogRef = inject(MatDialogRef<AppointmentFormComponent>);
  private readonly store = inject(Store);

  constructor(@Inject(MAT_DIALOG_DATA) slotData: any){
    console.log(slotData, this.newAppointment);
    this.slotData = slotData;
    this.slotFromTime = slotData.time < 12 ? slotData.time + ' AM' : slotData.time === 12 ? slotData.time + ' Noon' : slotData.time-12+' PM';
    this.slotToTime = slotData.time+1 < 12 ? slotData.time+1 + ' AM' : slotData.time+1 === 12 ? slotData.time+1 + ' Noon' : slotData.time+1-12+' PM';
    this.store.select(fromAppointment.selectAppointmentsByMonthDayAndHour(slotData.date.getMonth(), slotData.date.getDate(), slotData.time)).subscribe((res: any) => {
        console.log(res);
        this.newAppointment = {...res[0]};
      });
  }

  newAppointment: any = initialAppointment;
  slotData: any;
  slotFromTime: any;
  slotToTime: any;
  newSlot: number = 0;

  addAppointment(){
    console.log(this.newAppointment, this.slotData);
    this.newAppointment = {
      id: 'new-id-' + this.slotData.date.getMonth() + '-' + this.slotData.date.getDate(),
      title: this.newAppointment.title,
      date: this.slotData.date.getDate(),
      hour: this.slotData.time,
      startTime: this.slotFromTime,
      endTime: this.slotToTime,
      description: 'Description of the new appointment for ' + this.slotData.date.getMonth() + ' Day ' + this.slotData.date.getDate()
    }
    this.store.dispatch(AppointmentActions.addAppointment({month:this.slotData.date.getMonth(), appointment: this.newAppointment}));
    this.dialogRef.close();
  }

  changeSlot(){
    console.log(this.newSlot, this.newAppointment);
    const newSlotAppointment = {...this.newAppointment};
    newSlotAppointment.hour = this.newSlot;
    this.store.dispatch(AppointmentActions.deleteAppointment({month: this.slotData.date.getMonth(),date: this.slotData.date.getDate(), hour: this.newAppointment.hour, id: this.newAppointment.id}));
    this.store.dispatch(AppointmentActions.addAppointment({month:this.slotData.date.getMonth(), appointment: newSlotAppointment}));
    this.dialogRef.close();
  }
}
