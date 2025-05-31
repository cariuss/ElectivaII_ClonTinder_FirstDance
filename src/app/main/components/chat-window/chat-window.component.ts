import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { MessageService } from '../../../core/services/message.service';
import { Message } from '../../../shared/models/message';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnChanges, OnDestroy {
  @Input() matchId: string | null = null;
  @Input() chatPartner: User | null = null;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  newMessage: string = '';
  isLoadingMessages: boolean = false;
  errorMessage: string | null = null;
  currentUserId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private authService: AuthService
  ) {

    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId = decodedToken.userId;
      } catch (e) {
        console.error('Error decodificando el token:', e);
        this.currentUserId = null;
      }
    }
  }

  ngOnInit(): void {
    this.chatService.getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: Message) => {

        this.messages.push(message);
        this.scrollToBottom();

      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchId'] && this.matchId) {
      this.messages = [];
      this.loadMessages();
    }
  }

  loadMessages(): void {
    if (!this.matchId) return;

    this.isLoadingMessages = true;
    this.errorMessage = null;

    this.messageService.getMessagesByMatchId(this.matchId).subscribe({
      next: (response) => {
        this.messages = response.data || [];
        this.isLoadingMessages = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
        this.isLoadingMessages = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.matchId) return;

    const messageToSend = {
      chatId: this.matchId,
      content: this.newMessage.trim()
    };

    this.chatService.sendMessage(messageToSend);


    this.messages.push({
      senderId: this.currentUserId || 'unknown',
      matchId: this.matchId,
      content: this.newMessage.trim(),
      timestamp: new Date().toISOString()
    });

    this.newMessage = '';
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
