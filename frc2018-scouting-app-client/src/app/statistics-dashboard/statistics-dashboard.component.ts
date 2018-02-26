import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-statistics-dashboard',
	templateUrl: './statistics-dashboard.component.html',
	styleUrls: ['./statistics-dashboard.component.css']
})
export class StatisticsDashboardComponent implements OnInit {

		// Select team, event, match
	selectTeam = new FormControl('', [Validators.required]);
	selectEvent = new FormControl('', [Validators.required]);
	selectMatch = new FormControl('', [Validators.required]);

	constructor() { }

	ngOnInit() {
	}

}
