import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule }  from '@angular/platform-browser';
import { 
  BrowserAnimationsModule, 
  NoopAnimationsModule } 
from '@angular/platform-browser/animations'; 

import { DataTablesModule } from 'angular-datatables';

// Our Angular Material Modules
import { MaterialModule } from './material.module';

import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClient, HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { ScoutingFormComponent } from './scouting-form/scouting-form.component';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';

import { AppRoutingModule } from './app-routing.module';
import { ScoutingDataService } from './scouting-data.service';
import { TeamStatisticsComponent } from './team-statistics/team-statistics.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    DataTablesModule,
  ],
  declarations: [
    AppComponent,
    ScoutingFormComponent,
    StatisticsDashboardComponent,
    TeamStatisticsComponent
  ],
  providers: [ScoutingDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
