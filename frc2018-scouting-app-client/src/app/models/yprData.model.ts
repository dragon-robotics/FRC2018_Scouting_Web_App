export class YPRData {
	event: string;
	team: number;
	YPR: number;
	OPR: number;
	DPR: number;
	CCWM: number;
	Pickup: number;
	NumOfCubes: number;
	CycleTime: number;
	Efficiency: number;
	Auto: number;
	Climb: number;

	constructor() {
        this.event = "";
        this.team = -1;
        this.YPR = -1;
        this.OPR = -1;
        this.DPR = -1;
        this.CCWM = -1;
        this.Pickup = -1;
        this.NumOfCubes = -1;
        this.CycleTime = -1;
        this.Efficiency = -1;
        this.Auto = -1;
        this.Climb = -1;
    }
}