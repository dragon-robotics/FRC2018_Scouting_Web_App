import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScoutingFormComponent } from './scouting-form/scouting-form.component';
import { TeamStatisticsComponent } from './team-statistics/team-statistics.component';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';


const routes: Routes = [
	{ path: '', redirectTo: '/team-detailed-statistics-dashboard', pathMatch: 'full'},
	{ path: 'statistics-dashboard', component: StatisticsDashboardComponent },
	{ path: 'team-detailed-statistics-dashboard', component: TeamStatisticsComponent },
	{ path: 'scouting-form', component: ScoutingFormComponent },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}