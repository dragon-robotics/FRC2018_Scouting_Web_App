export class ScoutingData {
    _id:						string;		// Indicates the Mongo Object ID
    team: 						number; 	// Indicates the team number
    event:						string;		// Indicates the event name
    match:						string; 	// Indicates the match number
    matchData:	{
    	readyCode: 				number;		// 0 - Ready, 1 - No Show, 2 - Disabled, 3 - Non-functional
    	robotPlacement: 		number; 	// 0 - Left, 1 - Middle, 2 - Right
    	fieldConfig: 			number; 	// 0 - LOS,LS,LAS; 1 - LOS,RS,LAS; 2 - ROS,LS,RAS; 3 - ROS,RS,RAS;
    	autoLine: 				boolean;	// T - Crossed, F - Failed 
    	autoSwitchCubeCount: 	number;		// Number of Cubes in Alliance Switch	
    	autoScaleCubeCount:		number;		// Number of Cubes in Alliance Scale
    	cyclePaths: {
            cycle:              number;     // Cycle Number
            source:             string;     // Source of Cube
            pickUpOrientation:  string;     // Cube Pickup Orientation
            destination:        string;     // Destination of Cube
        }[];
    	climbing: 				number;		// 0 - No Climb, 1 - Self-Climb, 2 - Ramp Climb, 3 - One Robot Ramp Deploy, 4 - Two Robot Ramp Deploy
    };
	comments:					string;		// Additional Comments

    constructor() {
        this.team = -1;
        this.event = "";
        this.match = "";
        this.matchData = {
            readyCode: -1,
            robotPlacement: -1,
            fieldConfig: -1,
            autoLine: false,
            autoSwitchCubeCount: -1,
            autoScaleCubeCount: -1,
            cyclePaths: [{
                cycle: -1,
                source: "",
                pickUpOrientation: "",
                destination: "",
            }],
            climbing: -1,
        };
        this.comments = "";
    }
}