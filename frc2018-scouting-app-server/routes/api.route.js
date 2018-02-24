var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var requestPromise = require('request-promise');
var _ = require('lodash');

var scoutingData = require('./api/scoutingData.route');


router.use('/scoutingData', scoutingData);

router.get('/teamEventInfo/:eventID', function(req, res){
	var event = req.params.eventID;

	requestPromise({
		method: 'GET',
		url: 'https://www.thebluealliance.com/api/v3/event/'+event+'/teams/simple',
		headers:{
			'X-TBA-Auth-Key': 'dS9knumpOPRZJkI1FvSCSYhdnIj9dk2mfpqPMb50JbCQc9roaG9Hl3oZKTRYYOe0',
		},
	})
	.then(function(result){
		var teams = _.chain(JSON.parse(result))
					.map(function(team){						
						return team.team_number;
					})
					.sortBy()
					.value();
		res.send(teams);
	});
});

router.get('/teamMatchEventInfo/:eventID/:teamID', function(req, res){
	var event = req.params.eventID;
	var team = req.params.teamID;

	requestPromise({
		method: 'GET',
		url: 'https://www.thebluealliance.com/api/v3/team/'+team+'/event/'+event+'/matches/simple',
		headers:{
			'X-TBA-Auth-Key': 'dS9knumpOPRZJkI1FvSCSYhdnIj9dk2mfpqPMb50JbCQc9roaG9Hl3oZKTRYYOe0',
		},
	})
	.then(function(result){
		var order = {
			"Qual": 1, 
			"Elimination-Finals": 500,
			"Quarter-Finals": 1000,
			"Semi-Finals": 1500,
			"Finals": 2000,
			"Unknown": 2500,
		}
		var matches = _.chain(JSON.parse(result))
					.map(function(match){
						var comp_level = "";
						switch(match.comp_level){
							case 'qm':
								comp_level = "Qual";
								break;
							case 'ef':
								comp_level = "Elimination-Finals";
								break;
							case 'qf':
								comp_level = "Quarter-Finals";
								break;
							case 'sf':
								comp_level = "Semi-Finals";
								break;
							case 'f':
								comp_level = "Finals";
								break;
							default:
								comp_level = "Unknown";
						}
						
						return comp_level+" "+match.match_number;
					})
					.sortBy(function(unsortedMatches){
						return order[unsortedMatches.split(" ")[0]] + +unsortedMatches.split(" ")[1];
					})
					.value();
		res.send(matches);
	});
});

router.get('/fieldConfigurationInfo/:eventID/:matchID', function(req, res){
	var event = req.params.eventID;
	var team = req.params.teamID;
})

module.exports = router;