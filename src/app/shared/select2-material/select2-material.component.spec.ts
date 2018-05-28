import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2MaterialComponent } from './select2-material.component';

describe('Select2MaterialComponent', () => {
  let component: Select2MaterialComponent;
  let fixture: ComponentFixture<Select2MaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2MaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2MaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
