import { TestBed } from '@angular/core/testing';

import { EntityUnauthGuardService } from './entity-unauth-guard.service';

describe('EntityUnauthGuardService', () => {
  let service: EntityUnauthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityUnauthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
