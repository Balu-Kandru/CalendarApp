export interface Appointment {
  id: string;
  title: string;
  date: number;  // Date of the appointment within the month
  hour: number; // Gour of the appointment within the date
  startTime: string;
  endTime: string;
  description?: string;
}

export const initialAppointment: Appointment = {
  id: '',
  title: '',
  startTime: '',
  endTime: '',
  date: -1,
  hour: -1,
}