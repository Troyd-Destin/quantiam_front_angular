import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2MaterialSupplierComponent } from './select2-material-supplier.component';

describe('Select2MaterialSupplierComponent', () => {
  let component: Select2MaterialSupplierComponent;
  let fixture: ComponentFixture<Select2MaterialSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2MaterialSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2MaterialSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
