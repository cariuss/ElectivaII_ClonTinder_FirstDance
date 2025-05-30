import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchHistory } from '../../shared/models/match';
import { BaseApiResponse } from '../../shared/models/base.api.response';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMatchHistory(): Observable<BaseApiResponse<MatchHistoryResponse>> {
    return this.http.get<BaseApiResponse<MatchHistoryResponse>>(`${this.apiUrl}/matches/history`);
  }

}

export interface MatchHistoryResponse {
  matches: MatchHistory[];
}
