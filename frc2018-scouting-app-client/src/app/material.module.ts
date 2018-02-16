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
  MatGridListModule,
  MatExpansionModule,

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
  		MatGridListModule,
  		MatExpansionModule,
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
  		MatGridListModule,
  		MatExpansionModule,
	],
})

export class MaterialModule { }