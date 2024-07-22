// appointment.service.ts
import { Injectable } from '@angular/core';

export interface Appointment {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  appointments: any[] = [];

  constructor() { }

  addAppointment(appointment: any) {
    this.appointments.push(appointment);
    console.log(appointment, this.appointments)
  }

  deleteAppointment(appointment: any) {
    this.appointments = this.appointments.filter(a => a !== appointment);
  }

  getAppointmentsForDate(date: string) {
    const array = this.appointments.filter(a => a.datetime.includes(date));
    return array;
  }

  moveAppointment(appointment: any, newDateTime: string) {
    appointment.datetime = newDateTime;
  }
}
