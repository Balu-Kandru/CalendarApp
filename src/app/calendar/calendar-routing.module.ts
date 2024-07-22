
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: CalendarComponent,
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
  })
  
export class CalendarRoutingModule{}