import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Modules
import { 
  MatCheckboxModule, 
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatTableModule,
} from '@angular/material';

@NgModule({
	imports: [
	    MatCheckboxModule,
	    MatMenuModule,
	    MatIconModule,
	    MatButtonModule,
	    MatToolbarModule,
	    MatInputModule,
  		MatProgressSpinnerModule,
  		MatCardModule,
  		MatSelectModule,
  		MatRadioModule,
  		MatButtonToggleModule,
  		MatTableModule,
	],
	exports: [
	    MatCheckboxModule,
	    MatMenuModule,
	    MatIconModule,
	    MatButtonModule,
	    MatToolbarModule,
		MatInputModule,
  		MatProgressSpinnerModule,
  		MatCardModule,
  		MatSelectModule,
  		MatRadioModule,
  		MatButtonToggleModule,
  		MatTableModule,
	],
})

export class MaterialModule { }