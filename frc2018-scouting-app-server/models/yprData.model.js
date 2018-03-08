var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var yprDataSchema = new mongoose.Schema({
	event: String,
	team: Number,
	YPR: Number,
	OPR: Number,
	DPR: Number,
	CCWM: Number,
	Pickup: Number,
	NumOfCubes: Number,
	CycleTime: Number,
	Efficiency: Number,
	Auto: Number,
	Climb: Number,
}, {collection: 'YPRData'});

const YPRData = mongoose.model('YPRData', yprDataSchema);
module.exports = YPRData;