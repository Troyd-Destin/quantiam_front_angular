import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2MaterialLotComponent } from './select2-material-lot.component';

describe('Select2MaterialLotComponent', () => {
  let component: Select2MaterialLotComponent;
  let fixture: ComponentFixture<Select2MaterialLotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2MaterialLotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2MaterialLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
