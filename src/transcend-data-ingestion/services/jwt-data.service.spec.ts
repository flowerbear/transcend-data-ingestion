import { TestBed } from '@angular/core/testing';

import { JWTDataService } from './jwt-data.service';

describe('JWTDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JWTDataService = TestBed.get(JWTDataService);
    expect(service).toBeTruthy();
  });
});
