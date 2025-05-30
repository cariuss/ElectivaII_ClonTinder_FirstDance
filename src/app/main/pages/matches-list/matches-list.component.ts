import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatchService } from '../../../core/services/match.service';
import { MatchHistory } from '../../../shared/models/match';
import { ChatService } from '../../../core/services/chat.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-matches-list',
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.scss']
})
export class MatchesListComponent implements OnInit, OnDestroy {
  matches: MatchHistory[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedMatch: MatchHistory | null = null;
  chatPartnerUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private matchService: MatchService,
    private chatService: ChatService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMatches();
    this.chatService.connect();


    this.chatService.getJoinedRoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {


        console.log(`Unido a la sala: ${payload.roomId}`);
      });
  }

  loadMatches(): void {
    this.isLoading = true;
    this.matchService.getMatchHistory().subscribe({
      next: (matches) => {
        this.matches = matches.data?.matches!;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial de matches:', err);
        this.errorMessage = 'No se pudo cargar tu historial de matches.';
        this.isLoading = false;
      }
    });
  }









  async selectMatch(match: MatchHistory): Promise<void> {
    this.selectedMatch = match;
    this.errorMessage = null;

    try {

      this.chatPartnerUser = this.selectedMatch!.targetUser;

      this.chatService.joinChat({ otherUserId: match.targetUserId });

    } catch (error) {
      console.error('Error al seleccionar match o cargar detalles del usuario:', error);
      this.errorMessage = 'No se pudo cargar la información del match.';
      this.selectedMatch = null;
      this.chatPartnerUser = null;
    }
  }


  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
