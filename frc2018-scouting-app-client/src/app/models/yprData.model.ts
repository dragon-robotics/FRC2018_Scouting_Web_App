export class YPRData {
	event: string;
	team: number;
	YPR: number;
	OPR: number;
	DPR: number;
	CCWM: number;
	cycleTimeRating: number;
	autoRating: number;
	pickUpRating: number;
	climbRating: number;
	efficiencyRating: number;
	numberOfCubesRating: number;

	constructor() {
        this.event = "";
        this.team = -1;
        this.YPR = -1;
        this.OPR = -1;
        this.DPR = -1;
        this.CCWM = -1;
        this.cycleTimeRating = -1;
        this.autoRating = -1;
        this.pickUpRating = -1;
        this.climbRating = -1;
        this.efficiencyRating = -1;
        this.numberOfCubesRating = -1;
    }
}