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
  MatSnackBarModule,

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
      MatSnackBarModule,
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
      MatSnackBarModule,
	],
})

export class MaterialModule { }