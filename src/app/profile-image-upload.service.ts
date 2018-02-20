import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ProfileImageUploadResponse} from '../profile-image-upload-response';

@Injectable()
export class ProfileImageUploadService {

  constructor(private httpClient: HttpClient) {
  }

  postFile(file: File, name: string): Promise<ProfileImageUploadResponse> {
    console.log(name);
    const endpoint = environment.profileImageUploadEndpoint;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    return this.httpClient.post(endpoint, formData).toPromise() as Promise<ProfileImageUploadResponse>;
  }
}
