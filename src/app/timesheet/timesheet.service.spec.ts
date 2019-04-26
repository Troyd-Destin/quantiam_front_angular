import { TestBed } from '@angular/core/testing';

import { TimesheetService } from './timesheetData.service';

describe('TimesheetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimesheetService = TestBed.get(TimesheetService);
    expect(service).toBeTruthy();
  });
});
