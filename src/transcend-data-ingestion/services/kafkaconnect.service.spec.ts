import { TestBed } from '@angular/core/testing';

import { KafkaconnectService } from './kafkaconnect.service';

describe('KafkaconnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KafkaconnectService = TestBed.get(KafkaconnectService);
    expect(service).toBeTruthy();
  });
});
