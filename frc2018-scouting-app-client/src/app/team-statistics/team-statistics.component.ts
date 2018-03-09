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
	fieldConfigChartPerMatch: Chart;

	autoLineChartPerMatch: Chart;
	autoSwitchScaleExchangeZoneChartPerMatch: Chart;
	climbPointsChartPerMatch: Chart;

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
				console.log(readyChartPerMatchseries.data);
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
				console.log(robotPlacementChartPerMatchSeries.data);
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
				console.log(fieldConfigurationChartPerMatchSeries.data);
				this.fieldConfigChartPerMatch = new Chart({
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
				console.log(autoLineChartPerMatchSeries.data);
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
				console.log(autoSwitchScaleExchangeZoneChartPerMatchSeries.data);
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
					},
					series: autoSwitchScaleExchangeZoneChartPerMatchSeries.data.result,
				});
			})

		this.scoutingDataService.getClimbPointsChartPerMatch(event, team)
			.subscribe((climbPointsChartPerMatchSeries) => {
				console.log(climbPointsChartPerMatchSeries.data);
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


	}

	constructor(
		private scoutingDataService: ScoutingDataService,
	) { }

	ngOnInit() {
	}
}
