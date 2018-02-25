import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, Validators } from '@angular/forms';
import { ScoutingDataService } from '../scouting-data.service';
import { ScoutingData } from '../models/scoutingData.model'

@Component({
  selector: 'app-scouting-form',
  templateUrl: './scouting-form.component.html',
  styleUrls: ['./scouting-form.component.css']
})
export class ScoutingFormComponent implements OnInit {

	scoutingData: ScoutingData = new ScoutingData();

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
	robotReadiness: number;
	initialRobotPlacement: number;

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
	climbingType: number;												// Grabs radio button index
	climbingRadioGroup = new FormControl('', [Validators.required]);	// Used to check if radio button is checked

	// Comments
	comments: string;	// Grabs comment from comment box
	
	// Datatables Directive
	@ViewChild(DataTableDirective)
  	private datatableElement: DataTableDirective;


	objectKeys = Object.keys;
	
	events = {
		'AZ North': '2017azfl',
		'AZ West': '2017azpx',
		'Week 0': '2018week0',
	};

	teams: number[];
	matches: string[];

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
				pickUpOrientation: orientation,
				destination: destination,
			}).draw()
		);
	}

	/* Save form information to database */
	saveForm(){

		/* There are four states
			- LO, LS, LA = 0
			- LO, RS, LA = 1
			- RO, LS, RA = 2
			- RO, RS, RA = 3 
		*/
		let fieldConfig = this.opponentSwitchToggleGroup+this.scaleToggleGroup+this.allianceSwitchToggleGroup;
		let fieldConfigValue: number = 0;

		switch(fieldConfig){
			case "lolsla":{
				fieldConfigValue = 0;
				break;
			}
			case "lorsla":{
				fieldConfigValue = 1;
				break;
			}
			case "rolsra":{
				fieldConfigValue = 2;
				break;
			}
			case "rorsra":{
				fieldConfigValue = 3;
				break;
			}
			default:{
				alert("Invalid Value");
				break;
			}
		}

		// Teleop Information
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
			{
				this.scoutingData.team = +this.selectedTeam;
				this.scoutingData.event = this.selectedEvent;
				this.scoutingData.match = this.selectedMatch;

				this.scoutingData.matchData = {
					readyCode: this.robotReadiness,
					robotPlacement: this.initialRobotPlacement,
					fieldConfig: fieldConfigValue,
					autoLine: this.crossedTheLine,
					autoSwitchCubeCount: this.autoSwitchCubeCount,
					autoScaleCubeCount: this.autoScaleCubeCount,
					cyclePaths: dtInstance.data().toArray(),
					climbing: this.climbingType,
				}; 

				this.scoutingData.comments = this.comments;

				// This is going to be kind of cool
				this.scoutingDataService.createScoutingData(this.scoutingData)
					.subscribe((res) => {
						console.log(res);
				});
			}
		);	// Datatable data
	}

	getForm(){
		// this.scoutingDataService.getTeamEventInfo()
		// 	.subscribe((res) => {
		// 		console.log(res);
		// 	})
	}

	/* This function gets the team from events */
	getTeamsAtEvent(){
		let eventID = this.events[this.selectedEvent];
		this.scoutingDataService.getTeamEventInfo(eventID)
			.subscribe(teams => {
				this.teams = teams;
			})
	}

	/* This function gets the team from events */
	getMatchesOfTeamsAtEvent(){
		let eventID = this.events[this.selectedEvent];
		let teamID = 'frc'+this.selectedTeam;
		this.scoutingDataService.getTeamMatchEventInfo(eventID, teamID)
			.subscribe(matches => {
				this.matches = matches;
			})
	}


	constructor(
		private scoutingDataService: ScoutingDataService
	) { }

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
				data: "pickUpOrientation",
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