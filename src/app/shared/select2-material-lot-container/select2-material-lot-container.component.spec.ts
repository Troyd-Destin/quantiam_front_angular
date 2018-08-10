import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2MaterialLotContainerComponent } from './select2-material-lot-container.component';

describe('Select2MaterialLotContainerComponent', () => {
  let component: Select2MaterialLotContainerComponent;
  let fixture: ComponentFixture<Select2MaterialLotContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2MaterialLotContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2MaterialLotContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
