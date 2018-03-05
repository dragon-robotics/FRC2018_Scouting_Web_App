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

	teamCharts : Chart[];

	chart = new Chart({
	    chart: {
	        polar: true,
	        type: 'line'
	    },

	    title: {
	        text: 'YPR',
	        x: -80
	    },

	    pane: {
	        size: '80%'
	    },

	    xAxis: {
	        categories: ['OPR', 'DPR', 'Cycle Time', 'Auto',
	                'Pickup', 'Climb', "Efficiency", "Number of Cubes"],
	        tickmarkPlacement: 'on',
	        lineWidth: 0
	    },

	    yAxis: {
	        lineWidth: 0,
	        min: 0
	    },

	    tooltip: {
	        shared: true,
	        pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
	    },

	    legend: {
	        align: 'right',
	        verticalAlign: 'top',
	        y: 70,
	        layout: 'vertical'
	    },

	    series: [{
	        name: 'Team A',
	        data: [43000, 19000, 60000, 35000, 17000, 10000, 10238, 23400],
	    }]
	});

	getYPRAnalytics(){
		this.scoutingDataService.getYPR()
			.subscribe((res)=>{
				console.log(res)
			})
	}

	constructor(
		private scoutingDataService: ScoutingDataService,
	) { }

	ngOnInit() {
	}

}
