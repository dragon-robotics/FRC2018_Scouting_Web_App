import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scouting-form',
  templateUrl: './scouting-form.component.html',
  styleUrls: ['./scouting-form.component.css']
})
export class ScoutingFormComponent implements OnInit {

	teams = [
		'2375',		
	];

	events = [
		'AZ North',
		'AZ West',
	];

	matches = [
		'Qual 3',
		'Qual 10',
		'Qual 12',
		'Qual 18',
		'Qual 24',		
		'Qual 33',
		'Qual 39',
		'Qual 41',
		'Qual 55',
		'Qual 64',
		'Qual 71',
		'Qual 80',
	];

	displayedColumns = [
		'cycle',
		'source',
		'orientation',
		'destination',
		'time'
	];

	climbTypes = [
		'No Climb',					// This is worth 0 point
		'Self-Climb on Rung',		// This is worth 1 point
		'Ramp Climb',				// This is worth 1 point
		'One Robot Ramp Deploy',	// This is worth 2 points
		'Two Robot Ramp Deploy',	// This is worth 3 points
	];

	cubeSources = [
		'Left Portal',
		'Right Portal',
		'Opponent Platform Zone',
		'Alliance Platform Zone',
		'Alliance Power Cube Zone',
		'Alliance Exchange Zone',
	];

	cubeOrientations = [
		'Wide',
		'Diagonal',
		'Tall',
	];

	cubeDestinations = [
		'Alliance Switch',
		'Alliance Scale',
		'Alliance Exchange Zone',
		'Opponent Switch',
	];

	step = 0;

	setStep(index: number) {
	this.step = index;
	}

	nextStep() {
	this.step++;
	}

	prevStep() {
	this.step--;
	}

	constructor() { }

	ngOnInit() {
	}

}
