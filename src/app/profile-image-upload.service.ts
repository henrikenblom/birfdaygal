import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ProfileImageUploadResponse} from '../profile-image-upload-response';
import {AuthService} from './auth.service';

@Injectable()
export class ProfileImageUploadService {

  constructor(private httpClient: HttpClient,
              public authService: AuthService) {
  }

  postFile(file: File): Promise<ProfileImageUploadResponse> {
    const endpoint = environment.profileImageUploadEndpoint;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('name', this.authService.userId);
    return this.httpClient.post(endpoint, formData).toPromise() as Promise<ProfileImageUploadResponse>;
  }
}
