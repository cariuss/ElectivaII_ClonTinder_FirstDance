import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../../shared/models/message';
import { BaseApiResponse } from '../../shared/models/base.api.response';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessagesByMatchId(matchId: string): Observable<BaseApiResponse<Message[]>> {
    return this.http.get<BaseApiResponse<Message[]>>(`${this.apiUrl}/messages/${matchId}`);
  }
}
