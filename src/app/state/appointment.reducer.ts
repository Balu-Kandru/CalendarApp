import { createReducer, on } from '@ngrx/store';
import { Appointment } from './appointment.model';
import * as AppointmentActions from './appointment.actions';

export interface AppointmentState {
  [month: string]: { [day: number]: {[hour: number]: Appointment[]} };
}

export const initialState: AppointmentState = {};

export const appointmentReducer = createReducer(
  initialState,
  on(AppointmentActions.addAppointment, (state, { month, appointment }) => ({
    ...state,
    [month]: {
      ...(state[month] || {}),
      [appointment.date]:{
        ...(state[month]?.[appointment.date] || {}),
         [appointment.hour] :  [...(state[month]?.[appointment.date]?.[appointment.hour] || []), appointment],
        }
    }
  })),
//   on(AppointmentActions.updateAppointment, (state, { month, appointment }) => ({
//     ...state,
//     [month]: {
//       ...(state[month] || {}),
//       [appointment.date]: state[month][appointment.date].map(a => a.id === appointment.id ? appointment : a)
//     }
//   })),
//   on(AppointmentActions.deleteAppointment, (state, { month, id }) => ({
//     ...state,
//     [month]: Object.keys(state[month] || {}).reduce((acc: any, day:any) => {
//       acc[day] = state[month][day].filter(a => a.id !== id);
//       return acc;
//     }, {})
//   }))
  on(AppointmentActions.deleteAppointment, (state, { month,date,hour, id }) => ({
    ...state,
    [month]: {
      ...(state[month] || {}),
      [date]: {
        ...state[month][date],
        [hour]: [...(state[month][date][hour].filter(a => a.id !== id) || [])]

      }}
    // const newState = { ...state };
    // for (const day in newState[month]) {
    //   for (const hour in newState[month][day]) {
    //     newState[month][day][hour] = newState[month][day][hour].filter(a => a.id !== id);
    //   }
    // }
    // return newState;
  })),
)
