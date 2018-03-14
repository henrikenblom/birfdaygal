import { TestBed, inject } from '@angular/core/testing';

import { TwinsService } from './twins.service';

describe('TwinsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwinsService]
    });
  });

  it('should be created', inject([TwinsService], (service: TwinsService) => {
    expect(service).toBeTruthy();
  }));
});
