import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutingFormComponent } from './scouting-form.component';

describe('ScoutingFormComponent', () => {
  let component: ScoutingFormComponent;
  let fixture: ComponentFixture<ScoutingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoutingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
