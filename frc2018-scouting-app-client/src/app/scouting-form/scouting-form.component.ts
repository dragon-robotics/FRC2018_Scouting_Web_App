import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-scouting-form',
  templateUrl: './scouting-form.component.html',
  styleUrls: ['./scouting-form.component.css']
})
export class ScoutingFormComponent implements OnInit {


	// Select team, event, match
	selectTeam = new FormControl('', [Validators.required]);
	selectEvent = new FormControl('', [Validators.required]);
	selectMatch = new FormControl('', [Validators.required]);

	// Selected team, event, match
	selectedTeam: number;
	selectedEvent: string;
	selectedMatch: string;

	// Robot readiness and initial robot placement radio groups
	robotReadinessRadioGroup = new FormControl('', [Validators.required]);	// Used to check if input is valid
	initialRobotPlacementRadioGroup = new FormControl('', [Validators.required]);	// Used to check if input is valid

	// Robot readiness and initial robot placement
	robotReadiness: string;
	initialRobotPlacement: string;

	// Field Configuration
	opponentSwitchToggleGroup: string;
	scaleToggleGroup: string;
	allianceSwitchToggleGroup: string;

	// Crossed the line?
	crossedTheLine: boolean;

	// Auto scale/switch cube count input
	autoSwitchCubeCountInput = new FormControl('', [Validators.required]);	// Used to check if input is valid
	autoScaleCubeCountInput = new FormControl('', [Validators.required]);	// Used to check if input is valid

	// Auto scale/switch cube count
	autoSwitchCubeCount: number;	// The number of cubes in the alliance switch during autonomous time 
	autoScaleCubeCount: number;		// The number of cubes in the alliance scale during autonomous time

	// Select cube source, orientation, and destination
	selectSource = new FormControl('', [Validators.required]);		// Used to check if source value is valid
	selectOrientation = new FormControl('', [Validators.required]);	// Used to check if orientation value is valid
	selectDestination = new FormControl('', [Validators.required]);	// Used to check if destination value is valid

	// Selected Cube source, orientation, and destination
	selectedSource: string;			// Selected source from user selection
	selectedOrientation: string;	// Selected orientation from user selection
	selectedDestination: string;	// Selected destination from user selection

	// Climbing
	climbingType: string;												// Grabs radio button index
	climbingRadioGroup = new FormControl('', [Validators.required]);	// Used to check if radio button is checked

	// Comments
	comments: string;	// Grabs comment from comment box
	
	// Datatables Directive
	@ViewChild(DataTableDirective)
  	private datatableElement: DataTableDirective;

	teams = [
		'2375',		
	];

	events = [
		'AZ North',
		'AZ West',
	];

	matches = [
		'Qual 3',
		'Qual 10',
		'Qual 12',
		'Qual 18',
		'Qual 24',
		'Qual 33',
		'Qual 39',
		'Qual 41',
		'Qual 55',
		'Qual 64',
		'Qual 71',
		'Qual 80',
	];

	displayedColumns = [
		'select',
		'cycle',
		'source',
		'orientation',
		'destination',
	];

	climbTypes = [
		'No Climb',					// This is worth 0 point
		'Self-Climb on Rung',		// This is worth 1 point
		'Ramp Climb',				// This is worth 1 point
		'One Robot Ramp Deploy',	// This is worth 2 points
		'Two Robot Ramp Deploy',	// This is worth 3 points
	];

	cubeSources = [
		'Left Portal',
		'Right Portal',
		'Opponent Platform Zone',
		'Alliance Platform Zone',
		'Alliance Power Cube Zone',
		'Alliance Exchange Zone',
	];

	cubeOrientations = [
		'Wide',
		'Diagonal',
		'Tall',
	];

	cubeDestinations = [
		'Alliance Switch',
		'Alliance Scale',
		'Alliance Exchange Zone',
		'Opponent Switch',
	];

	step = 0;

	setStep(index: number) {
	this.step = index;
	}

	nextStep() {
	this.step++;
	}

	prevStep() {
	this.step--;
	}

	/** Adds the row to the datatable **/
	addCycle(datatableElement: DataTableDirective): void {

		if(this.selectSource.hasError('required') || this.selectSource.hasError('required')){
			alert('Empty O');
		}

		let source = this.selectedSource;
		let orientation = this.selectedOrientation;
		let destination = this.selectedDestination;

		datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
			dtInstance.row.add({
				cycle: dtInstance.data().count()+1,
				source: source,
				orientation: orientation,
				destination: destination,
			}).draw()
		);
	}

	/* Save form information to database */
	saveForm(){
		// Team, Event, Match Information
		console.log(this.selectedTeam);		// Selected Team
		console.log(this.selectedEvent);	// Selected Event
		console.log(this.selectedMatch);	// Selected Match

		// Pre-Match Information
		console.log(this.robotReadiness);			// Robot Readiness Index
		console.log(this.initialRobotPlacement);	// Initial Robot Placement Index

		/* There are four states
			- LO, LS, LA = 0
			- LO, RS, LA = 1
			- RO, LS, RA = 2
			- RO, RS, RA = 3 
		*/
		let fieldConfig = this.opponentSwitchToggleGroup+this.scaleToggleGroup+this.allianceSwitchToggleGroup;
		let value = 0;

		switch(fieldConfig){
			case "lolsla":{
				value = 0;
				break;
			}
			case "lorsla":{
				value = 1;
				break;
			}
			case "rolsra":{
				value = 2;
				break;
			}
			case "rorsra":{
				value = 3;
				break;
			}
			default:{
				alert("Invalid Value");
				break;
			}
		}
		console.log(value);						// Field configuration code

		// Auto Information
		console.log(this.crossedTheLine);		// Crossing the auto line?
		console.log(this.autoSwitchCubeCount);	// Number of Cubes in Alliance Switch during Auto
		console.log(this.autoScaleCubeCount);	// Number of Cubes in Alliance Scale during Auto

		// Teleop Information
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
			console.log(dtInstance.data())
		);	// Datatable data

		// Climbing Information
		console.log(this.climbingType);	// How the robot climbed at the end of the match
	}

	constructor() { }

	dtOptions: any = {};

	ngOnInit(): void {
		this.dtOptions = {
			dom: 'Brt',
			buttons: [{
				text: "Remove Selected Rows",
				action: function (e, dt, node, config){
					dt.rows('.selected').remove();
					let counter = 1;
					dt.rows().every(function(){
						var d = this.data();
						d.cycle = counter++;
						this.invalidate();
					})
					dt.draw();
				}
			}],
			select: {
				style: "multi",
			},
			columns: [{
				title: "Cycle",
				data: "cycle",
			},{
				title: "Source",
				data: "source",
			},{
				title: "Orientation",
				data: "orientation",
			},{
				title: "Destination",
				data: "destination",				
			},],
			lengthMenu: [[-1],["All"]],	// Displays all rows
			scrollY: "35vh",
			scrollCollapse: true,
		};
	}

}