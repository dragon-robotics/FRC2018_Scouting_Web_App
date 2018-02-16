import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-scouting-form',
  templateUrl: './scouting-form.component.html',
  styleUrls: ['./scouting-form.component.css']
})
export class ScoutingFormComponent implements OnInit {

	selectedSource: string;
	selectedOrientation: string;
	selectedDestination: string;
	
	@ViewChild(DataTableDirective)
  	private datatableElement: DataTableDirective;

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
		'select',
		'cycle',
		'source',
		'orientation',
		'destination',
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

	/** Adds the row to the datatable **/
	addCycle(datatableElement: DataTableDirective): void {
		let source = this.selectedSource;
		let orientation = this.selectedOrientation;
		let destination = this.selectedDestination;

		datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
			dtInstance.row.add({
				cycle: dtInstance.data().count()+1,
				source: source,
				orientation: orientation,
				destination: destination,
			}).draw()
		);
	}

	constructor() { }

	dtOptions: any = {};

	ngOnInit(): void {
		this.dtOptions = {
			dom: 'Brt',
			buttons: [{
				text: "Remove Selected Rows",
				action: function (e, dt, node, config){
					dt.rows('.selected').remove();
					let counter = 1;
					dt.rows().every(function(){
						var d = this.data();
						d.cycle = counter++;
						this.invalidate();
					})
					dt.draw();
				}
			}],
			select: {
				style: "multi",
			},
			columns: [{
				title: "Cycle",
				data: "cycle",
			},{
				title: "Source",
				data: "source",
			},{
				title: "Orientation",
				data: "orientation",
			},{
				title: "Destination",
				data: "destination",				
			},],
			lengthMenu: [[-1],["All"]],	// Displays all rows
			scrollY: "35vh",
			scrollCollapse: true,
		};
	}

}