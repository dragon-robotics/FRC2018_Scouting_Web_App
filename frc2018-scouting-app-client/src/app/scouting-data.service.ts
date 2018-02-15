import ScoutingData from './models/scoutingData.model';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Response} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class ScoutingDataService {

	api_url = 'http://localhost:3000';						// Start of the URL
	scoutingDataURL = `${this.api_url}/api/scoutingData`;	// Appends Initial URL with api URL 	

	constructor(
		private http: HttpClient
	) { }

	// Creates scouting data, takes a scouting data object
	createScoutingData(scoutingData: ScoutingData): Observable<any>{
		// returns the observable of http post request
		return this.http.post(`${this.scoutingDataURL}`, scoutingData);
	}

	// Grabs scouting data, takes no argument
	getScoutingData(): Observable<ScoutingData[]>{
		return this.http.get(this.scoutingDataURL)
		.map(res  => {
			//Maps the response object sent from the server
			return res["data"].docs as ScoutingData[];
		})
	}

	//Update scouting data, takes a ScoutingData Object as parameter
	editScoutingData(scoutingData:ScoutingData){
		let editURL = `${this.scoutingDataURL}`
		//returns the observable of http put request 
		return this.http.put(editURL, scoutingData);
	}

	deleteScoutingData(id:string):any{
		//Delete the object by the id
		let deleteURL = `${this.scoutingDataURL}/${id}`
		return this.http.delete(deleteURL)
		.map(res  => {
		  return res;
		})
	}

	//Default Error handling method.
	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}	 
}
