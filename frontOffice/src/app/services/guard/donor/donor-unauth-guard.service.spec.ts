import { TestBed } from '@angular/core/testing';

import { DonorUnauthGuardService } from './donor-unauth-guard.service';

describe('DonorUnauthGuardService', () => {
  let service: DonorUnauthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonorUnauthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
