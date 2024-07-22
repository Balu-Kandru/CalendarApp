// calendar.component.ts
import { Component, inject } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Appointment } from './../state/appointment.model';
import * as fromAppointment from './../state/appointment.selector';
import * as AppointmentActions from './../state/appointment.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  constructor() {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth();
    this.currentDate = currentDate.getDate();
    this.generateCalendarDates(this.currentYear, this.currentMonth);
  }
  
  calendarDates: Date[] = [];
  calendarWeeks: Date[][] = [];
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  currentYear: number = 0;
  currentMonth: number = 0;
  currentDate: number = 0;
  selectedDate: Date = new Date();
  selectedWeek: any[] = [];
  appointmentsByMonthDayAndHour$: { [key: string]: { [key: number]: { [key: number]: Observable<Appointment[]> } } } = {};
  // Variables for time selection
  isSelectingTime = false;
  startTime: Date | null = null;
  endTime: Date | null = null;
  hours = Array.from({ length: 24 }, (_, i) => i);

  generateCalendarDates(year: number, month: number) {
    this.calendarDates = [];
    this.calendarWeeks = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const startOffset = (firstDayOfWeek + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDates.push(date);
    }

    const previousMonth = month === 0 ? 11 : month - 1;
    const daysInPreviousMonth = new Date(year, previousMonth + 1, 0).getDate();
    const previousDays = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, previousMonth, daysInPreviousMonth - i);
      previousDays.push(date);
    }

    if(previousDays.length) this.calendarDates = [...previousDays, ...this.calendarDates]; 

    const nextMonth = month === 11 ? 0 : month + 1;
    const totalDaysDisplayed = this.calendarDates.length;
    const daysRemaining = 42 - totalDaysDisplayed;

    for (let day = 1; day <= daysRemaining; day++) {
      const date = new Date(year, nextMonth, day);
      this.calendarDates.push(date);
    }

    // Split dates into weeks
    let week: Date[] = [];
    this.calendarDates.forEach((date, index) => {
      week.push(date);
      if (index % 7 === 6) {
        this.calendarWeeks.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      this.calendarWeeks.push(week);
    }
    console.log(this.calendarWeeks)
    if(!this.appointmentsByMonthDayAndHour$[month])
    this.appointmentsByMonthDayAndHour$[month]= {};
    this.getAllAppointmentsOfDay(String(month), this.selectedDate.getDate());
    this.gettingSelectedWeeks();
  }

  private getAllAppointmentsOfDay(month: string, date: number){
    this.appointmentsByMonthDayAndHour$[month][date] = {};
        this.hours.forEach(hour => {
          this.appointmentsByMonthDayAndHour$[month][date][hour] = this.store.select(fromAppointment.selectAppointmentsByMonthDayAndHour(month, date, hour))
        });
        console.log(this.appointmentsByMonthDayAndHour$);
  }

  private gettingSelectedWeeks(){
    for(let i=0; i< this.calendarWeeks.length; i++){
      this.calendarWeeks[i].forEach((date: any) => {
        if(date.getDate() === this.selectedDate.getDate() &&
        date.getMonth() === this.selectedDate.getMonth() &&
        date.getFullYear() === this.selectedDate.getFullYear()){
          this.selectedWeek = this.calendarWeeks[i];
          return;
        }
      })
    }
  }

  goToPreviousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendarDates(this.currentYear, this.currentMonth);
  }

  goToNextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDates(this.currentYear, this.currentMonth);
  }

  selectedData(date: any){
    console.log(date, date.getDate(), date.getDay(), typeof date );
    console.log(date.split(' ')[0]);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate != null &&
           date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  isPreviousMonth(date: Date): boolean {
    return date.getMonth() < this.currentMonth;
  }

  isNextMonth(date: Date): boolean {
    return date.getMonth() > this.currentMonth;
  }

  selectDate(date: Date, selectedWeeks: any) {
    this.selectedDate = date;
    this.selectedWeek = selectedWeeks;
    if(this.isPreviousMonth(date)){
      this.goToPreviousMonth();
      return;
    }
    if(this.isNextMonth(date)){
      this.goToNextMonth();
      return;
    }
  }

  selectTimeSolt(hour: any, date: any){
    console.log(hour, date);
    this.getAllAppointmentsOfDay(String(date.getMonth()), date.getDate());
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      date: date, time: hour
    };
    dialogConfig.width = '70vw';
    dialogConfig.height = '70vh';

    const dialogRef = this.dialog.open(AppointmentFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: any) => {console.log(res)});
  }

  deleteAppointment(month: number, date: number, hour: number, id: string){
    this.store.dispatch(AppointmentActions.deleteAppointment({month: String(month), date: date, hour: hour, id: id}));
  }
}
