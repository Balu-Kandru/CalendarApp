import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
    },
];

// @NgModule({
//     imports: [
//       RouterModule.forRoot(routes,)
//     ],
//     exports: [RouterModule]
//   })
//   export class AppRoutingModule { }
