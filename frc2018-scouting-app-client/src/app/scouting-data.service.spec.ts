import { TestBed, inject } from '@angular/core/testing';

import { ScoutingDataService } from './scouting-data.service';

describe('ScoutingDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoutingDataService]
    });
  });

  it('should be created', inject([ScoutingDataService], (service: ScoutingDataService) => {
    expect(service).toBeTruthy();
  }));
});
