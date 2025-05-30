import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user';
import { PotentialMatchesResponse } from '../../shared/models/potential-matches';
import { BaseApiResponse } from '../../shared/models/base.api.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMe(): Observable<BaseApiResponse<User>> {
    return this.http.get<BaseApiResponse<User>>(`${this.apiUrl}/users/me`);
  }

  updateProfile(user: Partial<User>): Observable<BaseApiResponse<User>> {
    return this.http.put<BaseApiResponse<User>>(`${this.apiUrl}/users/profile`, user);
  }

  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    return this.http.patch(`${this.apiUrl}/users/profile/photo`, formData);
  }

  uploadAdditionalPhotos(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('additionalProfilePhotos', file);
    });
    return this.http.patch(`${this.apiUrl}/users/profile/additional-photos`, formData);
  }

  getPotentialMatches(lastId?: string): Observable<BaseApiResponse<PotentialMatchesResponse>> {
    let params = {};
    if (lastId) {
      params = { lastId: lastId };
    }
    return this.http.get<BaseApiResponse<PotentialMatchesResponse>>(`${this.apiUrl}/users/potential-matches`, { params: params });
  }
}
