import { TestBed, inject } from '@angular/core/testing';

import { CountDownService } from './count-down.service';

describe('CountDownService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountDownService]
    });
  });

  it('should be created', inject([CountDownService], (service: CountDownService) => {
    expect(service).toBeTruthy();
  }));
});
