import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Highcharts, Chart } from 'angular-highcharts';
import { ScoutingDataService } from '../scouting-data.service';
import { DataTableDirective } from 'angular-datatables';

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
		'Week 0': '2018week0',
		// 'AZ West': '2018azpx',
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

	// Datatables Directive
	@ViewChild(DataTableDirective)
  	datatableElement: DataTableDirective;

	getYPRAnalytics(){
		this.scoutingDataService.getYPR(this.selectedEvent, this.events[this.selectedEvent])
			.subscribe((res)=>{

				// Add YPR information to the table
				this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
					dtInstance.rows.add(res.map(function(result, key){
						return {
							'team': result.team,
							'YPR': result.YPR,
							'OPR': result.OPR,
							'DPR': result.DPR,
							'CCWM': result.CCWM,
							'Pickup': result.Pickup,
							'NumOfCubes': result.NumOfCubes,
							'CycleTime': result.CycleTime,
							'Efficiency': result.Efficiency,
							'Auto': result.Auto,
							'Climb': result.Climb,
							'yprChart': result
							// 'yprChart': new Chart({
							// 				chart: {
							// 				    polar: true,
							// 				    type: 'line',
							// 				    borderColor: '#000000', 
							// 				    borderRadius: 1,
							// 				    borderWidth: 1,
							// 				    height: 300,
							// 				},
							// 				title: {
							// 				    text: '',
							// 				},
							// 				xAxis: {
							// 				    categories: [
							// 				    	'OPR',
							// 				    	'DPR',
							// 				    	'CCWM',
							// 				    	'Pickup', 
							// 				    	"Number of Cubes",
							// 				    	'Cycle Time', 
							// 				    	"Efficiency", 
							// 				    	'Auto',
							// 				    	'Climb', 
							// 				    ],
							// 				    tickmarkPlacement: 'on',
							// 				    lineWidth: 0
							// 				},
							// 				yAxis: {
							// 				    lineWidth: 0,
							// 				    min: 0,
							// 				    max: 20,
							// 				},
							// 				tooltip: {
							// 				    shared: true,
							// 				},

							// 				legend: {
							// 					enabled: false,
							// 				},
							// 				series: [{
							// 				    name: 'Team '+result.team,
							// 				    type:'area',
							// 				    data: [
							// 				    	result.OPR,
							// 				    	result.DPR,
							// 				    	result.CCWM,
							// 				    	result.Pickup, 
							// 				    	result.NumOfCubes, 
							// 				    	result.CycleTime,
							// 				    	result.Efficiency,
							// 				    	result.Auto,
							// 				    	result.Climb,
							// 				    ],
							// 				}],
							// 			})
						}
					})).draw()
				});

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


	dtOptions: any = {};
	ngOnInit() {
		this.dtOptions = {
			dom: 'rt',
			columnDefs:[{
				targets: -1,
				"createdCell": function(td, cellData, rowData, row, col){
					$(td).attr('id', 'highcharts '+row)
				}
			},{
				targets: [0,1,2,3,4,5,6,7,8,9,10],
				width: "100px",
			}],        
			fixedColumns:   {
            	heightMatch: 'auto'
        	},
			columns: [{
				title: "Team",
				data: "team",
			},{
				title: "YPR",
				data: "YPR",
			},{
				title: "OPR",
				data: "OPR",
			},{
				title: "DPR",
				data: "DPR",
			},{
				title: "CCWM",
				data: "CCWM",
			},{
				title: "Pickup Rating",
				data: "Pickup",
			},{
				title: "Cube Count Rating",
				data: "NumOfCubes",
			},{
				title: "Cycle Time Rating",
				data: "CycleTime",
			},{
				title: "Efficiency Rating",
				data: "Efficiency",
			},{
				title: "Auto Rating",
				data: "Auto",
			},{
				title: "Climb Rating",
				data: "Climb",
			},{
				title: "Spider Chart",
				sortable: false,
				data: "yprChart",
				// render: "Climb",
			},],
			drawCallback: function(){
				var api = this.api();
 
		        // Output the data for the visible rows to the browser's console
		        api.rows().data().map(function(chart, key){
		        	// chart.yprChart.update({chart: {renderTo: 'highcharts'+key}})
		        	// chart.yprChart.options.chart.renderTo = 'highcharts '+key;
					// Highcharts.chart(chart.yprChart);
					new Highcharts.Chart('highcharts '+key, {
						chart: {
						    polar: true,
						    type: 'line',
						    borderColor: '#000000', 
						    borderRadius: 1,
						    borderWidth: 1,
						    height: 300,
						},
						title: {
						    text: 'Hell Yeah',
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
						    name: 'Team '+chart.yprChart.team,
						    type:'area',
						    data: [
						    	chart.yprChart.OPR,
						    	chart.yprChart.DPR,
						    	chart.yprChart.CCWM,
						    	chart.yprChart.Pickup, 
						    	chart.yprChart.NumOfCubes, 
						    	chart.yprChart.CycleTime,
						    	chart.yprChart.Efficiency,
						    	chart.yprChart.Auto,
						    	chart.yprChart.Climb,
						    ],
						}],
					});
		        	// console.log(chart.yprChart);
		        	// console.log(key);
		        })
			},
			lengthMenu: [[-1],["All"]],	// Displays all rows
			// scrollY: "35vh",
			// scrollCollapse: true,
		};
	}

}
