var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var ScoutingDataSchema = new mongoose.Schema({
	team: Number,						// Indiate Team Number
	event: String,						// Indicates the event name 
	match: String,						// Indicate the Match Number
	matchData: {
		readyCode: Number,				// 0 - Ready, 1 - No Show, 2 - Disabled, 3 - Non-functional
		robotPlacement: Number,			// 0 - Left, 1 - Middle, 2 - Right
		fieldConfig: Number,			// 0 - LOS,LS,LAS; 1 - LOS,RS,LAS; 2 - ROS,LS,RAS; 3 - ROS,RS,RAS;
		autoLine: Boolean,				// T - Crossed, F - Failed
		autoSwitchCubeCount: Number,	// Number of Cubes in Alliance Switch
		autoScaleCubeCount: Number,		// Number of Cubes in Alliance Scale
		cyclePaths: 
		[{
			cycle: Number,				// Cycle Number
			source: String,				// Source of Cube
			pickUpOrientation: String,	// Cube Pickup Orientation
			destination: String,		// Destination of Cube
		},],
		cubesScored: Number, 			// Total number of cubes scored
		cycleTime: Number, 				// Cycle Time (seconds / cube)
		efficiencyRating: Number,		// Distance traveled / teleop time
		pickUpRating: Number,			// Pickup ability
		climbing: Number,				// 0 - No Climb, 1 - Self-Climb, 2 - Ramp Climb, 3 - One Robot Ramp Deploy, 4 - Two Robot Ramp Deploy
	},
	comments: String,					// Additional Comments
});

ScoutingDataSchema.plugin(mongoosePaginate)
const ScoutingData = mongoose.model('ScoutingData', ScoutingDataSchema)

module.exports = ScoutingData;