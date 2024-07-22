import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState } from './appointment.reducer';

export const selectAppointmentState = createFeatureSelector<AppointmentState>('appointments');

export const selectAppointmentsByMonthDayAndHour = (month: string, day: number, hour: number) => createSelector(
  selectAppointmentState,
  (state: AppointmentState) => state[month]?.[day]?.[hour] || []
);

export const selectAppointmentsByMonthAndDay = (month: string, day: number) => createSelector(
  selectAppointmentState,
  (state: AppointmentState) =>  state[month]?.[day] || {}
);
