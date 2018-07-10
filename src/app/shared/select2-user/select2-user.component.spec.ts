import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2UserComponent } from './select2-user.component';

describe('Select2UserComponent', () => {
  let component: Select2UserComponent;
  let fixture: ComponentFixture<Select2UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2UserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
