import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMaterialLotContainerComponent } from './select-material-lot-container.component';

describe('SelectMaterialLotContainerComponent', () => {
  let component: SelectMaterialLotContainerComponent;
  let fixture: ComponentFixture<SelectMaterialLotContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMaterialLotContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMaterialLotContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
