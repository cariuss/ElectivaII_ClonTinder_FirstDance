import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateSwipeRequest, CreateSwipeResponse, SwipeHistory } from '../../shared/models/swipe';
import { BaseApiResponse } from '../../shared/models/base.api.response';

@Injectable({
  providedIn: 'root'
})
export class SwipeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createSwipe(swipe: CreateSwipeRequest): Observable<BaseApiResponse<CreateSwipeResponse>> {
    return this.http.post<BaseApiResponse<CreateSwipeResponse>>(`${this.apiUrl}/swipes`, swipe);
  }

  getSwipeHistory(): Observable<BaseApiResponse<SwipeHistory[]>> {
    return this.http.get<BaseApiResponse<SwipeHistory[]>>(`${this.apiUrl}/swipes/history`);
  }
}
