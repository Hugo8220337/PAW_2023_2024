import { TestBed } from '@angular/core/testing';

import { DonationRequestsService } from './donation-requests.service';

describe('DonationRequestsService', () => {
  let service: DonationRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
