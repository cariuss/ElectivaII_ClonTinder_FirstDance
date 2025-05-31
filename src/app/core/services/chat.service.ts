import { Injectable, OnDestroy } from '@angular/core';
import io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Message, SocketJoinedPayload, SocketSendMessagePayload, SocketJoinChatPayload } from '../../../app/shared/models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private socket: any;
  private messages$: Subject<Message> = new Subject<Message>();
  private joinedRoom$: Subject<SocketJoinedPayload> = new Subject<SocketJoinedPayload>();
  private currentRoomId: string | null = null;

  constructor(private authService: AuthService) {
    this.socket = io(environment.socketUrl);
  }


  connect(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No JWT token found for Socket.io connection.');
      return;
    }


    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }

    this.socket = io(environment.socketUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Socket.io conectado:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.io desconectado.');
      this.currentRoomId = null;
    });

    this.socket.on('connect_error', (err: Error) => {
      console.error('Socket.io connection error:', err.message);
    });


    this.socket.on('joined', (payload: SocketJoinedPayload) => {
      this.currentRoomId = payload.roomId;
      this.joinedRoom$.next(payload);
    });


    this.socket.on('receiveMessage', (message: Message) => {
      this.messages$.next(message);
    });
  }


  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
      this.currentRoomId = null;
    }
  }


  joinChat(payload: SocketJoinChatPayload): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinChat', payload);
    } else {
      console.error('Socket no conectado. No se pudo unir al chat.');
    }
  }


  sendMessage(payload: SocketSendMessagePayload): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('sendMessage', payload);
    } else {
      console.error('Socket no conectado. No se pudo enviar el mensaje.');
    }
  }


  getMessages(): Observable<Message> {
    return this.messages$.asObservable();
  }


  getJoinedRoom(): Observable<SocketJoinedPayload> {
    return this.joinedRoom$.asObservable();
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messages$.complete();
    this.joinedRoom$.complete();
  }
}
