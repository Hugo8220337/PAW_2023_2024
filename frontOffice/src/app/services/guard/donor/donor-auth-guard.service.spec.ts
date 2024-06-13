import { TestBed } from '@angular/core/testing';

import { DonorAuthGuardService } from './donor-auth-guard.service';

describe('DonorAuthGuardService', () => {
  let service: DonorAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonorAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
