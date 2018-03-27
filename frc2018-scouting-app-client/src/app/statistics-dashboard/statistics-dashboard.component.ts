import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Chart } from 'angular-highcharts';
import { ScoutingDataService } from '../scouting-data.service';

@Component({
	selector: 'app-statistics-dashboard',
	templateUrl: './statistics-dashboard.component.html',
	styleUrls: ['./statistics-dashboard.component.css']
})
export class StatisticsDashboardComponent implements OnInit {

	selectEvent = new FormControl('', [Validators.required]);
	selectedEvent: string;

	objectKeys = Object.keys;
	
	events = {
		'AZ North': '2018azfl',
		// 'AZ West': '2017azpx',
		'Week 0': '2018week0',
		// '2018 Dallas Regional': '2018txda',
	};

	teamRows : any[];

	tiles = [
		{text: 'One', cols: 2, rows: 1, color: 'lightblue'},
		// {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
		// {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
		// {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
	];
	color : string = "lightblue";

	getYPRAnalytics(){
		this.scoutingDataService.getYPR(this.selectedEvent, this.events[this.selectedEvent])
			.subscribe((res)=>{
				this.teamRows = res.map(function(result){
					let chart = new Chart({
						chart: {
						    polar: true,
						    type: 'line',
						    borderColor: '#000000', 
						    borderRadius: 1,
						    borderWidth: 1,
						    height: 300,
						},
						title: {
						    text: '',
						},
						xAxis: {
						    categories: [
						    	'OPR',
						    	'DPR',
						    	'CCWM',
						    	'Pickup', 
						    	"Number of Cubes",
						    	'Cycle Time', 
						    	"Efficiency", 
						    	'Auto',
						    	'Climb', 
						    ],
						    tickmarkPlacement: 'on',
						    lineWidth: 0
						},
						yAxis: {
						    lineWidth: 0,
						    min: 0,
						    max: 20,
						},
						tooltip: {
						    shared: true,
						},

						legend: {
							enabled: false,
						},
						series: [{
						    name: 'Team '+result.team,
						    type:'area',
						    data: [
						    	result.OPR,
						    	result.DPR,
						    	result.CCWM,
						    	result.Pickup, 
						    	result.NumOfCubes, 
						    	result.CycleTime,
						    	result.Efficiency,
						    	result.Auto,
						    	result.Climb,
						    ],
						}],
					});

					return {
						chart: chart,
						team: result.team,
						cols: 3,
						rows: 1,
					};
				})
			})
	}

	constructor(
		private scoutingDataService: ScoutingDataService,
	) { }

	ngOnInit() {
	}

}
