import { Response } from '@angular/http';
import { ScoutingDataService } from './scouting-data.service';
import ScoutingData from './models/scoutingData.model';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'FRC 2018 Scouting App';

	constructor(
		private scoutingDataService: ScoutingDataService
	){}

	public newScoutingData: ScoutingData = new ScoutingData();

	scoutingDataList: ScoutingData[];

	nGOnInit(): void{
		this.scoutingDataService.getScoutingData()
			.subscribe(scoutingDatas => {
				this.scoutingDataList = scoutingDatas;
				console.log(scoutingDatas);
			})
	}
}