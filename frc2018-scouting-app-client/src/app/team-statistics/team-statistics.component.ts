import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { ScoutingDataService } from '../scouting-data.service';
import { ScoutingData } from '../models/scoutingData.model';
import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-team-statistics',
  templateUrl: './team-statistics.component.html',
  styleUrls: ['./team-statistics.component.css']
})
export class TeamStatisticsComponent implements OnInit {

	selectTeam = new FormControl('', [Validators.required]);
	selectEvent = new FormControl('', [Validators.required]);

	selectedTeam: number;
	selectedEvent: string;

	objectKeys = Object.keys;
	
	events = {
		'AZ North': '2018azfl',
		// 'AZ West': '2017azpx',
		'Week 0': '2018week0',
		// '2018 Dallas Regional': '2018txda',
	};

	allTeams: number[];

	/* Per Match Charts */
	readyChartPerMatch: Chart;
	robotPlacementChartPerMatch: Chart;
	fieldConfigurationChartPerMatch: Chart;
	autoLineChartPerMatch: Chart;
	autoSwitchScaleExchangeZoneChartPerMatch: Chart;
	climbPointsChartPerMatch: Chart;
	pickUpTypeChartPerMatch: Chart;
	efficiencyChartPerMatch: Chart;
	cycleTimeChartPerMatch: Chart;
	cubesScoredChartPerMatch: Chart;
	sourceToDestinationChartPerMatch: Chart;

	/* Overall Charts */
	readyChartOverall: Chart;
	robotPlacementChartOverall: Chart;
	fieldConfigurationChartOverall: Chart;
	autoLineChartOverall: Chart;
	autoSwitchScaleExchangeZoneChartOverall: Chart;
	climbTypeChartOverall: Chart;
	pickUpTypeChartOverall: Chart;
	sourceToDestinationChartOverall: Chart;
	destinationToSourceChartOverall: Chart;

	getAllTeamsAtEvent(){
		let eventID = this.events[this.selectedEvent];
		this.scoutingDataService.getTeamFromEvent(eventID)
			.subscribe((res) => {
				this.allTeams = res;
			})
	}

	generateAllCharts(){
		let event = this.selectedEvent;
		let team = this.selectedTeam;
		/*==== Per Match Charts ====*/
		// Ready Status Chart //
		this.scoutingDataService.getRobotReadyStatusPerMatch(event, team)
			.subscribe((readyChartPerMatchseries) => {
				this.readyChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,
					},
					title: {
						text: 'Ready Status Per Match'
					},
					xAxis: {
						categories: readyChartPerMatchseries.data.map(function(res){
							return res.name;
						})
					},
					yAxis: {
						min: 0,
						max: 3,
						tickInterval: 1,
						categories: ['Good To Go', 'No Show', 'Disabled', 'Non-Functional'],
					},
					series: [{
						data: readyChartPerMatchseries.data,
					}],
				});

			})

		this.scoutingDataService.getRobotPlacementPerMatch(event, team)
			.subscribe((robotPlacementChartPerMatchSeries) => {
				this.robotPlacementChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Robot Placement Per Match'
					},
					xAxis: {
						categories: robotPlacementChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					yAxis: {
						min: 0,
						max: 2,
						tickInterval: 1,
						categories: ['Left', 'Middle', 'Right'],
					},
					series: [{
						data: robotPlacementChartPerMatchSeries.data,
					}],
				});
			})

		this.scoutingDataService.getFieldConfigurationPerMatch(event, team)
			.subscribe((fieldConfigurationChartPerMatchSeries) => {
				this.fieldConfigurationChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Field Configuration Per Match'
					},
					xAxis: {
						categories: fieldConfigurationChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					yAxis: {
						min: 0,
						max: 3,
						tickInterval: 1,
				        categories: ['LAS-LS-LOS', 'LAS-RS-LOS', 'RAS-LS-ROS', 'RAS-RS-ROS'],
					},
					series: [{
						data: fieldConfigurationChartPerMatchSeries.data,
					}],
				});
			})			

		this.scoutingDataService.getAutoLinePerMatch(event, team)
			.subscribe((autoLineChartPerMatchSeries) => {
				this.autoLineChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Auto Line Cross Per Match'
					},
					xAxis: {
						categories: autoLineChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					yAxis: {
						min: 0,
						max: 1,
						tickInterval: 1,
				        categories: ['No', 'Yes'],
					},
					series: [{
						data: autoLineChartPerMatchSeries.data,
					}],
				});
			})

		this.scoutingDataService.getAutoSwitchScaleExchangeZoneChartPerMatch(event, team)
			.subscribe((autoSwitchScaleExchangeZoneChartPerMatchSeries) => {
				this.autoSwitchScaleExchangeZoneChartPerMatch = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Auto Cube Count Per Match'
					},
					xAxis: {
						categories: autoSwitchScaleExchangeZoneChartPerMatchSeries.data.categories,
						crosshair: true,
					},
					series: autoSwitchScaleExchangeZoneChartPerMatchSeries.data.result,
				});
			})

		this.scoutingDataService.getClimbPointsChartPerMatch(event, team)
			.subscribe((climbPointsChartPerMatchSeries) => {
				this.climbPointsChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Climb Points Per Match'
					},
					xAxis: {
						categories: climbPointsChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					series: [{
						data: climbPointsChartPerMatchSeries.data,
					}],
				});
			})

		this.scoutingDataService.getPickUpTypeChartPerMatch(event,team)
			.subscribe((pickUpTypeChartPerMatchSeries) => {
				this.pickUpTypeChartPerMatch = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Pick Up Type Per Match',
					},
					xAxis: {
						categories: pickUpTypeChartPerMatchSeries.data.categories,
						crosshair: true,
					},
					series: pickUpTypeChartPerMatchSeries.data.result,
				});
			});

		this.scoutingDataService.getEfficiencyChartPerMatch(event,team)
			.subscribe((efficiencyChartPerMatchSeries) => {
				this.efficiencyChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Efficiency Per Match',
					},
					xAxis: {
						categories: efficiencyChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					series: [{
						data: efficiencyChartPerMatchSeries.data,
					}],
				});
			});


		this.scoutingDataService.getCycleTimeChartPerMatch(event,team)
			.subscribe((cycleTimeChartPerMatchSeries) => {
				this.cycleTimeChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Cycle Time Per Match',
					},
					xAxis: {
						categories: cycleTimeChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					series: [{
						data: cycleTimeChartPerMatchSeries.data,
					}],
				});
			});

		this.scoutingDataService.getCubesScoredChartPerMatch(event,team)
			.subscribe((cubesScoredChartPerMatchSeries) => {
				this.cubesScoredChartPerMatch = new Chart({
					chart: {
						type: 'line',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Cubes Scored Per Match',
					},
					xAxis: {
						categories: cubesScoredChartPerMatchSeries.data.map(function(res){
							return res.name;
						})
					},
					series: [{
						data: cubesScoredChartPerMatchSeries.data,
					}],
				});
			});

		/*==== Overall Charts ====*/

		this.scoutingDataService.getRobotReadyStatusOverall(event,team)
			.subscribe((robotReadyStatusChartOverallSeries) => {
				this.readyChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Robot Ready Status',
					},
					xAxis: {
						categories: robotReadyStatusChartOverallSeries.data.categories
					},
					series: [robotReadyStatusChartOverallSeries.data.readyCodeOverallData],
				});
			});

		this.scoutingDataService.getRobotPlacementOverall(event,team)
			.subscribe((robotPlacementChartOverallSeries) => {
				this.robotPlacementChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Robot Placement',
					},
					xAxis: {
						categories: robotPlacementChartOverallSeries.data.categories
					},
					series: [robotPlacementChartOverallSeries.data.robotPlacementOverallData],
				});
			});

		this.scoutingDataService.getFieldConfigurationOverall(event,team)
			.subscribe((fieldConfigurationChartOverallSeries) => {
				this.fieldConfigurationChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Robot Placement',
					},
					xAxis: {
						categories: fieldConfigurationChartOverallSeries.data.categories
					},
					series: [fieldConfigurationChartOverallSeries.data.fieldConfigurationOverallData],
				});
			});

		this.scoutingDataService.getAutoLineOverall(event,team)
			.subscribe((autoLineChartOverallSeries) => {
				this.autoLineChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Auto Line Cross',
					},
					xAxis: {
						categories: autoLineChartOverallSeries.data.categories
					},
					series: [autoLineChartOverallSeries.data.autoLineOverallData],
				});
			});

		this.scoutingDataService.getAutoSwitchScaleExchangeZoneChartOverall(event,team)
			.subscribe((autoSwitchScaleExchangeZoneChartOverallSeries) => {
				this.autoSwitchScaleExchangeZoneChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Auto Cube Count',
					},
					xAxis: {
						categories: autoSwitchScaleExchangeZoneChartOverallSeries.data.categories
					},
					series: [autoSwitchScaleExchangeZoneChartOverallSeries.data.autoSwitchScaleExchangeZoneOverallData],
				});
			});

		this.scoutingDataService.getClimbTypeChartOverall(event,team)
			.subscribe((climbTypeChartOverallSeries) => {
				this.climbTypeChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Climb Type',
					},
					xAxis: {
						categories: climbTypeChartOverallSeries.data.categories
					},
					series: [climbTypeChartOverallSeries.data.climbTypeOverallData],
				});
			});

		this.scoutingDataService.getPickUpTypeChartOverall(event,team)
			.subscribe((pickUpTypeChartOverallSeries) => {
				this.pickUpTypeChartOverall = new Chart({
					chart: {
						type: 'column',
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Overall Pickup Type Count',
					},
					xAxis: {
						categories: pickUpTypeChartOverallSeries.data.categories
					},
					series: [pickUpTypeChartOverallSeries.data.pickUpTypeOverallData],
				});
			});

		this.scoutingDataService.getSourceDestinationChartOverall(event,team)
			.subscribe((sourceToDestinationChartOverallSeries) => {
				this.sourceToDestinationChartOverall = new Chart({
					chart: {
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Source to Destination Sankey Diagram',
					},
					series: [
						sourceToDestinationChartOverallSeries.data[0]
					],
				});

				this.destinationToSourceChartOverall = new Chart({
					chart: {
						borderColor: '#000000', 
						borderRadius: 1,
						borderWidth: 1,						
					},
					title: {
						text: 'Destination to Source Sankey Diagram',
					},
					series: [
						sourceToDestinationChartOverallSeries.data[1]
					],
				});
			});

		// Expand the Per Match Chart
		// Expand the Overall Charts
	}

	constructor(
		private scoutingDataService: ScoutingDataService,
	) { }

	ngOnInit() {
	}
}
