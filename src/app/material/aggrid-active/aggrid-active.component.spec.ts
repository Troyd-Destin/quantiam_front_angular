import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggridActiveComponent } from './aggrid-active.component';

describe('AggridActiveComponent', () => {
  let component: AggridActiveComponent;
  let fixture: ComponentFixture<AggridActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggridActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggridActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
