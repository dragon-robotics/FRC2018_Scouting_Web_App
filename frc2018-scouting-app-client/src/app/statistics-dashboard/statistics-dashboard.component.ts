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
		'AZ West': '2018azpx',
		'Week 0': '2018week0',
		// '2018 Dallas Regional': '2018txda',
	};

	// Datatables Directive
	@ViewChild(DataTableDirective)
  	datatableElement: DataTableDirective;
  	tableDraw : Boolean = true;	// Used to only generate charts once per event load

  	triggerProgressSpinner : boolean = false;

	getYPRAnalytics(){
		this.triggerProgressSpinner = true;
		this.scoutingDataService.getYPR(this.selectedEvent, this.events[this.selectedEvent])
			.subscribe((res)=>{
				// Add YPR information to the table
				this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
					dtInstance.clear().draw();	// Removes previous data
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
						}
					})).draw()
					this.triggerProgressSpinner = false;
				});
			})
	}

	constructor(
		private scoutingDataService: ScoutingDataService,
	) { }


	dtOptions: any = {};
	ngOnInit() {
		let tableDraw = this.tableDraw;
		this.dtOptions = {
			dom: 'Brt',
			buttons: [
	            {
	                extend: 'csvHtml5',
	                text: 'Download YPR in CSV',
	                exportOptions: {
	                    columns: [0,1,2,3,4,5,6,7,8,9,10]
	                }
	            },
	        ],
	        autowidth: false,
			columnDefs:[{
				targets: [-1],
				createdCell: function(td, cellData, rowData, row, col){
					$(td).attr('id', 'highcharts '+rowData.team)
				}
			}/*,{
				targets: [0,1,2,3,4,5,6,7,8,9,10],
				width: "100px",
			}*/],
			order: [
				[ 1, "desc" ]
			],
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
				title: "Pickup<br>Rating",
				data: "Pickup",
			},{
				title: "Cube<br>Count<br>Rating",
				data: "NumOfCubes",
			},{
				title: "Cycle<br>Time<br>Rating",
				data: "CycleTime",
			},{
				title: "Efficiency<br>Rating",
				data: "Efficiency",
			},{
				title: "Auto<br>Rating",
				data: "Auto",
			},{
				title: "Climb<br>Rating",
				data: "Climb",
			},{
				title: "Spider Chart",
				width: "400px",
				sortable: false,
				data: "yprChart",
			},],
			drawCallback: function(){
				var api = this.api();
		        // Output the data for the visible rows to the browser's console
		        if(tableDraw && api.rows().data().length > 0){
			        api.rows().data().map(function(chart, key){
						new Highcharts.Chart('highcharts '+chart.yprChart.team, {
							chart: {
							    polar: true,
							    type: 'line',
							    borderColor: '#000000', 
							    borderRadius: 1,
							    borderWidth: 1,
							    height: 400,
							},
							title: {
							    text: 'Team '+chart.yprChart.team+' Spider Chart',
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
			        })
			        tableDraw = false;
		        }
		        else if (api.rows().data().length < 1){
		        	tableDraw = true;
		        }
			},
			lengthMenu: [[-1],["All"]],	// Displays all rows
			scrollX: true,
		};
	}

}
