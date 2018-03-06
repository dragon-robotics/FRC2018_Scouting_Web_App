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
		// 'AZ North': '2017azfl',
		// 'AZ West': '2017azpx',
		'Week 0': '2018week0',
		'2018 Dallas Regional': '2018txda',
	};

	teamCharts : Chart[];

	// chart = new Chart({
	//     chart: {
	//         polar: true,
	//         type: 'line'
	//     },

	//     title: {
	//         text: 'YPR',
	//         x: -80
	//     },

	//     pane: {
	//         size: '80%'
	//     },

	//     xAxis: {
	//         categories: ['OPR', 'DPR', 'Cycle Time', 'Auto',
	//                 'Pickup', 'Climb', "Efficiency", "Number of Cubes"],
	//         tickmarkPlacement: 'on',
	//         lineWidth: 0
	//     },

	//     yAxis: {
	//         lineWidth: 0,
	//         min: 0
	//     },

	//     tooltip: {
	//         shared: true,
	//         pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
	//     },

	//     legend: {
	//         align: 'right',
	//         verticalAlign: 'top',
	//         y: 70,
	//         layout: 'vertical'
	//     },

	//     series: [{
	//         name: 'Team A',
	//         data: [43000, 19000, 60000, 35000, 17000, 10000, 10238, 23400],
	//     }]
	// });

	getYPRAnalytics(){
		this.scoutingDataService.getYPR(this.selectedEvent, this.events[this.selectedEvent])
			.subscribe((res)=>{
				console.log(res);
				this.teamCharts = res.map(function(result){
					return new Chart({
						chart: {
						    polar: true,
						    type: 'line'
						},

						title: {
						    text: result.event+' '+result.team+' YPR',
						    x: -80
						},
					    subtitle: {
					        text: 'YPR = '+result.YPR,
					        x: -80
					    },
						pane: {
						    size: '80%'
						},

						xAxis: {
						    categories: [
						    	'OPR',
						    	'DPR',
						    	'CCWM',
						    	'Cycle Time', 
						    	'Auto',
						    	'Pickup', 
						    	'Climb', 
						    	"Efficiency", 
						    	"Number of Cubes"
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
						    align: 'right',
						    verticalAlign: 'top',
						    y: 70,
						    layout: 'vertical'
						},

						series: [{
						    name: 'Team '+result.team,
						    type:'area',
						    data: [
						    	result.OPR,
						    	result.DPR,
						    	result.CCWM,
						    	result.cycleTimeRating, 
						    	result.autoRating, 
						    	result.pickUpRating,
						    	result.climbRating,
						    	result.efficiencyRating,
						    	result.numberOfCubesRating,
						    ],
						}]
					});
				})
			})
	}

	constructor(
		private scoutingDataService: ScoutingDataService,
	) { }

	ngOnInit() {
	}

}
