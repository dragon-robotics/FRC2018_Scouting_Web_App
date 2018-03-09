import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, Validators } from '@angular/forms';
import { ScoutingDataService } from '../scouting-data.service';
import { ScoutingData } from '../models/scoutingData.model';

@Component({
  selector: 'app-scouting-form',
  templateUrl: './scouting-form.component.html',
  styleUrls: ['./scouting-form.component.css']
})
export class ScoutingFormComponent implements OnInit {

	scoutingData: ScoutingData = new ScoutingData();
	_id: string = "";	// Used to store existing string, if populated, we will update instead of insert

	// Select team, event, match
	selectTeam = new FormControl('', [Validators.required]);
	selectEvent = new FormControl('', [Validators.required]);
	selectMatch = new FormControl('', [Validators.required]);

	// Selected team, event, match
	selectedTeam: number;
	selectedEvent: string;
	selectedMatch: string;

	// Robot readiness and initial robot placement radio groups
	robotStatusRadioGroup = new FormControl('', [Validators.required]);	// Used to check if input is valid
	initialRobotPlacementRadioGroup = new FormControl('', [Validators.required]);	// Used to check if input is valid

	// Robot readiness and initial robot placement
	robotStatus: number;
	initialRobotPlacement: number;

	// Field Configuration
	opponentSwitchToggleGroup: string;
	scaleToggleGroup: string;
	allianceSwitchToggleGroup: string;

	leftOpponentSwitchToggle: boolean;
	rightOpponentSwitchToggle: boolean;

	leftScaleToggle: boolean;
	rightScaleToggle: boolean;

	leftAllianceSwitchToggle: boolean;
	rightAllianceSwitchToggle: boolean;

	// Crossed the line?
	crossedTheLine: boolean;

	// Auto scale/switch cube count input
	autoSwitchCubeCountInput = new FormControl('', [Validators.required]);	// Used to check if input is valid
	autoScaleCubeCountInput = new FormControl('', [Validators.required]);	// Used to check if input is valid
	autoExchangeCubeCountInput = new FormControl('', [Validators.required]);	// Used to check if input is valid

	// Auto scale/switch cube count
	autoSwitchCubeCount: number;	// The number of cubes in the alliance switch during autonomous time 
	autoScaleCubeCount: number;		// The number of cubes in the alliance scale during autonomous time
	autoExchangeCubeCount: number;		// The number of cubes in the alliance scale during autonomous time

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
		'AZ North': '2018azfl',
		// 'AZ West': '2017azpx',
		'Week 0': '2018week0',
		// '2018 Dallas Regional': '2018txda',
	};

	matchesAndTeams = {};
	blue_alliance = [];
	red_alliance = [];

	displayedColumns = [
		'select',
		'cycle',
		'source',
		'orientation',
		'destination',
	];

	climbTypes = [
		'No Climb',						// This is worth 0 point
		'Ramp Climb',					// This is worth 1 point
		'One Robot Ramp Deploy',		// This is worth 2 points
		'Self-Climb on Rung',			// This is worth 2.5 point
		'Two Robot Ramp Deploy',		// This is worth 3 points
		'One Robot Ramp Deploy + Rung Climb',	// This is worth 4 points
		'Two Robot Ramp Deploy + Rung Climb',	// This is worth 5 points
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
		'Drop Off'
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
				// Calculate custom climbing score
				let climbScore = 0;
				if(this.climbingType == 0)
					climbScore = 0;
				else if (this.climbingType == 1)
					climbScore = 1;
				else if (this.climbingType == 2)
					climbScore = 2;
				else if (this.climbingType == 3)
					climbScore = 2.5;
				else if (this.climbingType == 4)
					climbScore = 3;
				else if (this.climbingType == 5)
					climbScore = 4;
				else if (this.climbingType == 6)
					climbScore = 5;


				this.scoutingData.team = +this.selectedTeam;
				this.scoutingData.event = this.selectedEvent;
				this.scoutingData.eventID = this.events[this.selectedEvent];
				this.scoutingData.match = this.selectedMatch;

				this.scoutingData.matchData = {
					readyCode: this.robotStatus,
					robotPlacement: this.initialRobotPlacement,
					fieldConfig: fieldConfigValue,
					autoLine: this.crossedTheLine ? 1 : 0,
					autoSwitchCubeCount: this.autoSwitchCubeCount,
					autoScaleCubeCount: this.autoScaleCubeCount,
					autoExchangeCubeCount: this.autoExchangeCubeCount,
					cyclePaths: dtInstance.data().toArray(),
					climbing: climbScore,
					climbingType: this.climbTypes[this.climbingType],
				};

				this.scoutingData.comments = this.comments;

				if(this._id === ""){
					// We create a whole new database
					this.scoutingDataService.createScoutingData(this.scoutingData)
						.subscribe((res) => {
							this.insertedFormSnackBar.open("Form data inserted into database", "OK",{
								duration: 2000,
							})
					});
				}
				else{
					// We update the existing database
					console.log(this.scoutingData);
					this.scoutingData._id = this._id;
					this.scoutingDataService.editScoutingData(this.scoutingData)
						.subscribe((res) => {
							this.insertedFormSnackBar.open("Form data updated into database", "OK",{
								duration: 2000,
							})
					});

				}

			}
		);	// Datatable data
	}

	getForm(){
		let eventID = this.selectedEvent;
		let matchID = this.selectedMatch;
		let teamID = this.selectedTeam;
		this.scoutingDataService.getFormScoutingData(eventID, matchID, teamID)
			.subscribe((res) => {
				this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
					{

						let result = res[0];
						if(result != null){
							this._id = result._id;

							this.robotStatus = result.matchData.readyCode;
							this.initialRobotPlacement = result.matchData.robotPlacement;

							switch(result.matchData.fieldConfig){
								case 0:
									this.opponentSwitchToggleGroup = "lo";
									this.scaleToggleGroup = "ls";
									this.allianceSwitchToggleGroup = "la";
									break;
								case 1:
									this.opponentSwitchToggleGroup = "lo";
									this.scaleToggleGroup = "rs";
									this.allianceSwitchToggleGroup = "la";
									break;
								case 2:
									this.opponentSwitchToggleGroup = "ro";
									this.scaleToggleGroup = "ls";
									this.allianceSwitchToggleGroup = "ra";
									break;
								case 3:
									this.opponentSwitchToggleGroup = "ro";
									this.scaleToggleGroup = "rs";
									this.allianceSwitchToggleGroup = "ra";
									break;
								default:
									break;																								
							}

							this.crossedTheLine = result.matchData.autoLine == 1 ? true : false;
							this.autoSwitchCubeCount = result.matchData.autoSwitchCubeCount;
							this.autoScaleCubeCount = result.matchData.autoScaleCubeCount;
							this.autoExchangeCubeCount = result.matchData.autoExchangeCubeCount;

							dtInstance.clear().draw();
							dtInstance.rows.add(result.matchData.cyclePaths).draw();
							this.climbingType = this.climbTypes.indexOf(result.matchData.climbingType);
							this.comments = result.comments;
						}
						else{
							this.robotStatusRadioGroup.reset();
							this.initialRobotPlacementRadioGroup.reset();

							this.leftOpponentSwitchToggle = false;
							this.rightOpponentSwitchToggle = false;

							this.leftScaleToggle = false;
							this.rightScaleToggle = false;

							this.leftAllianceSwitchToggle = false;
							this.rightAllianceSwitchToggle = false;

							this.crossedTheLine = false;
							this.autoExchangeCubeCountInput.reset();
							this.autoScaleCubeCountInput.reset();
							this.autoSwitchCubeCountInput.reset();
							dtInstance.clear().draw();
							this.climbingRadioGroup.reset();
							this.comments = "";
						}
					}
				);	// Datatable data
				
			})
	}

	/* This function gets the team from events */
	getMatchesAndTeamsAtEvents(){
		let eventID = this.events[this.selectedEvent];
		this.scoutingDataService.getMatchAndTeamInfo(eventID)
			.subscribe(matchesAndTeams => {
				this.matchesAndTeams = matchesAndTeams;
			})
	}

	/* This function gets the team from events */
	getTeams(){
		this.blue_alliance = this.matchesAndTeams[this.selectedMatch].alliances.blue;
		this.red_alliance = this.matchesAndTeams[this.selectedMatch].alliances.red;
	}

	/* This function will autofill the form information if a team is a no show at the qual */
	noShow(){
		if(this.robotStatus == 1){
			this.initialRobotPlacement = 0;

			this.crossedTheLine = false;
			this.autoSwitchCubeCount = 0;
			this.autoScaleCubeCount = 0;
			this.autoExchangeCubeCount = 0;
			this.climbingType = 0;
		}
	}

	constructor(
		private scoutingDataService: ScoutingDataService,
		public insertedFormSnackBar: MatSnackBar,
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