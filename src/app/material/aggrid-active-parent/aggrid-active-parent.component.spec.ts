import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggridActiveParentComponent } from './aggrid-active-parent.component';

describe('AggridActiveParentComponent', () => {
  let component: AggridActiveParentComponent;
  let fixture: ComponentFixture<AggridActiveParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggridActiveParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggridActiveParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
