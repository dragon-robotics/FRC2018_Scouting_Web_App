import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule }  from '@angular/platform-browser';
import { 
  BrowserAnimationsModule, 
  NoopAnimationsModule } 
from '@angular/platform-browser/animations'; 

// Our Angular Material Modules
import { MaterialModule } from './material.module';

import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { ScoutingFormComponent } from './scouting-form/scouting-form.component';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
  ],
  declarations: [
    AppComponent,
    ScoutingFormComponent,
    StatisticsDashboardComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
