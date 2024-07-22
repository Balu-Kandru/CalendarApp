// calendar.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarDates: Date[] = [];
  calendarWeeks: Date[][] = [];
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Adjust order if needed
  currentYear: number = 0;
  currentMonth: number = 0;
  newAppointment: any = { title: '', datetime: '' };
  selectedDate: Date = new Date();
  selectedWeek: any[] = [];
  @ViewChild('timeSelectionOverlay') timeSelectionOverlay!: ElementRef<HTMLDivElement>;

  // Variables for time selection
  isSelectingTime = false;
  startTime: Date | null = null;
  endTime: Date | null = null;
  hours = Array.from({ length: 24 }, (_, i) => i);

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit() {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth();
    console.log(this.currentYear, this.currentMonth, currentDate)
    this.generateCalendarDates(this.currentYear, this.currentMonth);
  }

  generateCalendarDates(year: number, month: number) {
    this.calendarDates = []; // Clear existing dates
    this.calendarWeeks = []; // Clear existing weeks

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate the starting point of the calendar (considering starting from Monday)
    const startOffset = (firstDayOfWeek + 6) % 7; // Adjust for Monday as start of week

    // Calculate the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate dates for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDates.push(date);
    }

    // Fill in days from the previous month to complete the first week
    const previousMonth = month === 0 ? 11 : month - 1; // Handle wrapping to previous year
    const daysInPreviousMonth = new Date(year, previousMonth + 1, 0).getDate();

    const previousDays = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, previousMonth, daysInPreviousMonth - i);
      previousDays.push(date);
      // this.calendarDates.unshift(date); // Add to the beginning of the array
    }

    if(previousDays.length) this.calendarDates = [...previousDays, ...this.calendarDates]; 

    // Fill in days from the next month to complete the last week
    const nextMonth = month === 11 ? 0 : month + 1; // Handle wrapping to next year

    // Calculate how many days are needed to fill the last week
    const totalDaysDisplayed = this.calendarDates.length;
    const daysRemaining = 42 - totalDaysDisplayed; // 42 days for 6 weeks in a typical calendar view

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
  }

  // Other methods like addAppointment, deleteAppointment, onDragEnded, etc. go here
  addAppointment() {
    this.appointmentService.addAppointment(this.newAppointment);
    this.newAppointment = { title: '', datetime: '' };
  }

  deleteAppointment(appointment: any) {
    this.appointmentService.deleteAppointment(appointment);
  }

  getAppointmentsForDate(date: Date) {
    const isoDate = date.toISOString().split('T')[0]; // Convert date to ISO format (YYYY-MM-DD)
    return this.appointmentService.getAppointmentsForDate(isoDate);
  }

  onDragStarted(event: any){
    console.log(event)
  }

  onDragEnded(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Implement logic for moving appointments between containers
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


  onTimeSelectionStart(event: MouseEvent) {
    this.startTime = this.calculateTimeFromMouseEvent(event);
    this.endTime = null;
    this.isSelectingTime = true;
  }

  onTimeSelectionMove(event: MouseEvent) {
    if (this.isSelectingTime) {
      this.endTime = this.calculateTimeFromMouseEvent(event);
    }
  }

  onTimeSelectionEnd() {
    this.isSelectingTime = false;
    // Handle the selected time range (this.startTime to this.endTime)
    console.log('Selected time range:', this.startTime, 'to', this.endTime);
  }

  private calculateTimeFromMouseEvent(event: MouseEvent): Date {
    const rect = this.timeSelectionOverlay.nativeElement.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const totalWidth = rect.width;
    const totalHeight = rect.height;

    const hours = Math.floor((offsetX / totalWidth) * 24); // 24 hours in a day
    const minutes = Math.floor((offsetY / totalHeight) * 60); // 60 minutes in an hour

    const selectedDate: any = this.calendarDates.find(date => date.getDate() === this.selectedDate.getDate());
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hours, minutes);
  }
}
