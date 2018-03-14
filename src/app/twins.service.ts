import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AuthService} from './auth.service';
import {TwinsComparisonResult} from '../twins-comparison-result';

@Injectable()
export class TwinsService {

  constructor(private httpClient: HttpClient,
              public authService: AuthService) {
  }

  compareByPhoto(file: File): Promise<TwinsComparisonResult> {
    const endpoint = environment.twinsImageUploadEndpoint;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.authService.userId);
    return this.httpClient.post(endpoint, formData).toPromise() as Promise<TwinsComparisonResult>;
  }

  compareByProfilePicture() {
  }
}
