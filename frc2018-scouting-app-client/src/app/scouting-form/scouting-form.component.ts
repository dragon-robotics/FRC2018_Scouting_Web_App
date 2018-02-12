import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scouting-form',
  templateUrl: './scouting-form.component.html',
  styleUrls: ['./scouting-form.component.css']
})
export class ScoutingFormComponent implements OnInit {

	displayedColumns = ['cube', 'source', 'destination', 'time'];

	climbTypes = [
		'Self-Climb on Rung',
		'One Robot Ramp Deploy',
		'Two Robot Ramp Deploy',
		'Ramp Climb',
	];

  constructor() { }

  ngOnInit() {
  }

}
