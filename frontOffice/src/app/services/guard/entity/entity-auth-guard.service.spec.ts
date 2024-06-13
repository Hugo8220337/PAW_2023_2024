import { TestBed } from '@angular/core/testing';

import { EntityAuthGuardService } from './entity-auth-guard.service';

describe('EntityAuthGuardService', () => {
  let service: EntityAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
