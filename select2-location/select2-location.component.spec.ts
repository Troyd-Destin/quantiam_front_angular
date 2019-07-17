import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2LocationComponent } from './select2-location.component';

describe('Select2LocationComponent', () => {
  let component: Select2LocationComponent;
  let fixture: ComponentFixture<Select2LocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2LocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
