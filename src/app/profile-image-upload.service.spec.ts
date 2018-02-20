import { TestBed, inject } from '@angular/core/testing';

import { ProfileImageUploadService } from './profile-image-upload.service';

describe('ProfileImageUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileImageUploadService]
    });
  });

  it('should be created', inject([ProfileImageUploadService], (service: ProfileImageUploadService) => {
    expect(service).toBeTruthy();
  }));
});
