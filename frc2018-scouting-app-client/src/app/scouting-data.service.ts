import { ScoutingData } from './models/scoutingData.model';
import { YPRData } from './models/yprData.model';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class ScoutingDataService {

	api_url = 'http://192.168.50.195:3000';
	// api_url = 'http://192.168.43.115:3000';										// Start of the URL
	scoutingDataURL = `${this.api_url}/api/scoutingData`;						// Appends Initial URL with api URL
	teamEventInfoURL = `${this.api_url}/api/teamEventInfo`;						// Appends Initial URL with api URL
	teamMatchEventInfoURL = `${this.api_url}/api/teamMatchEventInfo`;			// Appends Initial URL with api URL
	getMatchAndTeamInfoURL = `${this.api_url}/api/getMatchAndTeamInfo`;	// Appends Initial URL with api URL

	constructor(
		private http: HttpClient
	) { }

	/* YPR Information */
	getYPR(event: string, eventID: string): Observable<YPRData[]>{
		return this.http.get(this.scoutingDataURL+'/'+event+'/'+eventID)
		.map((res) => {
			return res["data"] as YPRData[];
		} );
	}

	/* Blue Alliance Information */
	getMatchAndTeamInfo(event: string): Observable<any>{
		return this.http.get(this.getMatchAndTeamInfoURL+'/'+event+'/');
	}	

	/* Scouting Data Information */
	// Creates scouting data, takes a scouting data object
	createScoutingData(scoutingData: ScoutingData): Observable<any>{
		// returns the observable of http post request
		return this.http.post(`${this.scoutingDataURL}`, scoutingData);
	}

	// Grabs scouting form data from a specific match
	// Takes team, event, and match as arguments
	getFormScoutingData(event: string, match: string, team: number): Observable<ScoutingData[]>{
		return this.http.get(this.scoutingDataURL+'/'+event+'/'+match+'/'+team)
		.map(res  => {
			//Maps the response object sent from the server
			return res["data"] as ScoutingData[];
		})
	}

	//Update scouting data, takes a ScoutingData Object as parameter
	editScoutingData(scoutingData:ScoutingData){
		let editURL = `${this.scoutingDataURL}`
		//returns the observable of http put request 
		return this.http.put(editURL, scoutingData);
	}

	getTeamFromEvent(eventID: string): Observable<any>{
		return this.http.get(this.teamEventInfoURL+'/'+eventID)
	}

	/* Chart Getters */
	/* Per Match Charts */
	getRobotReadyStatusPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/readyChartPerMatch/'+event+'/'+team)
	}

	getRobotPlacementPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/robotPlacementChartPerMatch/'+event+'/'+team)
	}

	getFieldConfigurationPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/fieldConfigurationChartPerMatch/'+event+'/'+team)
	}

	getAutoLinePerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/autoLineChartPerMatch/'+event+'/'+team)
	}

	getAutoSwitchScaleExchangeZoneChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/autoSwitchScaleExchangeZoneChartPerMatch/'+event+'/'+team)
	}

	getClimbPointsChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/climbPointsChartPerMatch/'+event+'/'+team)
	}

	getPickUpTypeChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/pickUpTypeChartPerMatch/'+event+'/'+team)
	}

	getEfficiencyChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/efficiencyChartPerMatch/'+event+'/'+team)
	}

	getCycleTimeChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/cycleTimeChartPerMatch/'+event+'/'+team)
	}

	getCubesScoredChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/cubesScoredChartPerMatch/'+event+'/'+team)
	}

	getSourceDestinationChartPerMatch(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/sourceDestinationChartPerMatch/'+event+'/'+team)
	}	

	/* Overall Charts*/
	getRobotReadyStatusOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/readyChartOverall/'+event+'/'+team)
	}

	getRobotPlacementOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/robotPlacementChartOverall/'+event+'/'+team)
	}

	getAutoLineOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/autoLineChartOverall/'+event+'/'+team)
	}

	getAutoSwitchScaleExchangeZoneChartOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/autoSwitchScaleExchangeZoneChartOverall/'+event+'/'+team)
	}

	getClimbPointsChartOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/climbPointsChartOverall/'+event+'/'+team)
	}	

	getPickUpTypeChartOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/pickUpTypeChartOverall/'+event+'/'+team)
	}	

	getSourceDestinationChartOverall(event: string, team: number): Observable<any>{
		return this.http.get(this.scoutingDataURL+'/sourceDestinationChartOverall/'+event+'/'+team)
	}	

	// deleteScoutingData(id:string):any{
	// 	//Delete the object by the id
	// 	let deleteURL = `${this.scoutingDataURL}/${id}`
	// 	return this.http.delete(deleteURL)
	// 	.map(res  => {
	// 	  return res;
	// 	})
	// }

	//Default Error handling method.
	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}	 
}
