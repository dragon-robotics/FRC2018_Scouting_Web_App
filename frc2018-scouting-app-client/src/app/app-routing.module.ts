import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScoutingFormComponent } from './scouting-form/scouting-form.component'
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component'


const routes: Routes = [
	{ path: '', redirectTo: '/statistics-dashboard', pathMatch: 'full'},
	{ path: 'statistics-dashboard', component: StatisticsDashboardComponent },
	{ path: 'scouting-form', component: ScoutingFormComponent },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}