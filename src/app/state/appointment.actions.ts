import { createAction, props } from '@ngrx/store';
import { Appointment } from './appointment.model';

export const addAppointment = createAction(
  '[Appointment] Add Appointment',
  props<{ month: string; appointment: Appointment }>()
);

export const updateAppointment = createAction(
  '[Appointment] Update Appointment',
  props<{ month: string; appointment: Appointment }>()
);

export const deleteAppointment = createAction(
  '[Appointment] Delete Appointment',
  props<{ month: string; date: number, hour: number, id: string }>()
);
