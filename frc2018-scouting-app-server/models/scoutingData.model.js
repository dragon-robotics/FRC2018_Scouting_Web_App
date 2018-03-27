var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var CyclePathsSchema = new mongoose.Schema({
	cycle: Number,				// Cycle Number
	source: String,				// Source of Cube
	pickUpOrientation: String,	// Cube Pickup Orientation
	destination: String,		// Destination of Cube
},{_id: false});

var ScoutingDataSchema = new mongoose.Schema({
	team: Number,						// Indiate Team Number
	event: String,						// Indicates the event name
	eventID: String,					// Indivates the event ID from "The Blue Alliance"
	match: String,						// Indicate the Match Number
	matchData: {
		readyCode: Number,				// 0 - Ready, 1 - No Show, 2 - Disabled, 3 - Non-functional
		robotPlacement: Number,			// 0 - Left, 1 - Middle, 2 - Right
		fieldConfig: Number,			// 0 - LOS,LS,LAS; 1 - LOS,RS,LAS; 2 - ROS,LS,RAS; 3 - ROS,RS,RAS;
		autoLine: Number,				// 1 - Crossed, 0 - Failed
		autoSwitchCubeCount: Number,	// Number of Cubes in Alliance Switch
		autoScaleCubeCount: Number,		// Number of Cubes in Alliance Scale
		autoExchangeCubeCount: Number,	// Number of Cubes in Exchange Zone
		cyclePaths: [CyclePathsSchema],	// Cycle Paths
		cubesScored: Number, 			// Total number of cubes scored
		cycleTime: Number, 				// Cycle Time (seconds / cube)
		efficiency: Number,				// Distance traveled / teleop time
		pickUpWide: Number,				// Pickup count for wide
		pickUpDiag: Number,				// Pickup count for diagonal
		pickUpTall: Number,				// Pickup count for tall
		pickUpDropOff: Number,			// Pickup count for tall
		climbing: Number,				// 0pt - No Climb, 1pt - Self-Climb, 2pts - Ramp Climb, 2.5pts - One Robot Ramp Deploy, 3pts - Two Robot Ramp Deploy, 4pts - One Robot Ramp Deploy Climb, 5pts - Two Robot Ramp Deploy Climb
		climbingType: String,			// 0 - No Climb, 1 - Self-Climb, 2 - Ramp Climb, 3 - One Robot Ramp Deploy, 4 - Two Robot Ramp Deploy, 5 - One Robot Ramp Deploy Climb, 6 - Two Robot Ramp Deploy Climb
	},
	comments: String,					// Additional Comments
	timeOfDataEntry: String,			// Entry time of the data - Used to verify data entry/validity
});

const ScoutingData = mongoose.model('ScoutingData', ScoutingDataSchema);
module.exports = ScoutingData;

