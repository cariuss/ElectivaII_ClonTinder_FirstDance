import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { SwipeService } from '../../../core/services/swipe.service';
import { User } from '../../../shared/models/user';
import { SwipeType } from '../../../shared/models/swipe';
import { PotentialMatchesResponse } from '../../../shared/models/potential-matches';
import { BaseApiResponse } from '../../../shared/models/base.api.response';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  potentialMatches: User[] = [];
  currentUser: User | null = null;
  lastId: string | undefined;
  isLoading: boolean = false;
  hasMoreUsers: boolean = true;

  constructor(
    private userService: UserService,
    private swipeService: SwipeService
  ) { }

  ngOnInit(): void {
    this.loadPotentialMatches();
  }

  loadPotentialMatches(): void {
    if (this.isLoading || !this.hasMoreUsers) return;

    this.isLoading = true;
    this.userService.getPotentialMatches(this.lastId?.toString()).subscribe({
      next: (response: BaseApiResponse<PotentialMatchesResponse>) => {
        if (response.data!.users && response.data!.users.length > 0) {
          this.potentialMatches = [...this.potentialMatches, ...response.data!.users];
          this.currentUser = this.potentialMatches.shift() || null;
          this.lastId = response.data?.lastId;
        } else {
          this.hasMoreUsers = false;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar potential matches:', err);
        this.isLoading = false;
        this.hasMoreUsers = false;
      }
    });
  }

  onSwipe(user: User, type: SwipeType): void {
    if (!user.id) {
      console.warn('Cannot swipe: User ID is missing.');
      this.moveToNextUser();
      return;
    }

    const swipeData = { targetUserId: user.id, swipeType: type };
    this.swipeService.createSwipe(swipeData).subscribe({
      next: (response) => {
        console.log(`Swipe ${type} exitoso para ${user.name}. ¿Match? ${response.data?.isMatch}`);
        if (response.data?.isMatch) {

          alert(`¡Es un Match con ${user.name}!`);
        }
        this.moveToNextUser();
      },
      error: (err) => {
        console.error(`Error al hacer swipe ${type} para ${user.name}:`, err);

        this.moveToNextUser();
      }
    });
  }

  moveToNextUser(): void {
    if (this.potentialMatches.length > 0) {
      this.currentUser = this.potentialMatches.shift() || null;
    }

    if (this.hasMoreUsers) {

      this.currentUser = null;
      this.loadPotentialMatches();
    } else {
      this.currentUser = null;
      console.log('No hay más usuarios disponibles.');
    }
  }

  onCardAnimationDone(): void {
  }
}
