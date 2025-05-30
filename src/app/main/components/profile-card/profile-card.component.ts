import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../shared/models/user';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  animations: [
    trigger('cardSwipe', [
      state('initial', style({
        transform: 'translateX(0) rotate(0)',
        opacity: 1
      })),
      state('left', style({
        transform: 'translateX(-400px) rotate(-15deg)',
        opacity: 0
      })),
      state('right', style({
        transform: 'translateX(400px) rotate(15deg)',
        opacity: 0
      })),
      transition('* => left', [
        animate('0.5s ease-in-out')
      ]),
      transition('* => right', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})
export class ProfileCardComponent {
  @Input() user: User | null = null;
  @Output() swipeLeft = new EventEmitter<User>();
  @Output() swipeRight = new EventEmitter<User>();
  @Output() cardAnimationDone = new EventEmitter<void>();

  swipeState: 'initial' | 'left' | 'right' = 'initial';


  private startX: number = 0;
  private currentX: number = 0;
  private isDragging: boolean = false;
  private threshold: number = 75;

  onPanStart(event: any): void {
    this.isDragging = true;
    this.startX = event.center.x;
    this.swipeState = 'initial';
  }

  onPan(event: any): void {
    if (!this.isDragging) return;
    this.currentX = event.center.x;
    const deltaX = this.currentX - this.startX;


    const rotation = deltaX / 20;
    this.swipeState = 'initial';
    (event.target as HTMLElement).style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    (event.target as HTMLElement).style.opacity = `${1 - Math.abs(deltaX) / 300}`;
  }

  onPanEnd(event: any): void {
    this.isDragging = false;
    const deltaX = this.currentX - this.startX;

    if (deltaX > this.threshold) {
      this.doSwipeRight();
    } else if (deltaX < -this.threshold) {
      this.doSwipeLeft();
    } else {

      this.resetCardPosition(event.target as HTMLElement);
    }
    this.startX = 0;
    this.currentX = 0;
  }

  doSwipeLeft(): void {
    if (this.user) {
      this.swipeState = 'left';
    }
  }

  doSwipeRight(): void {
    if (this.user) {
      this.swipeState = 'right';
    }
  }


  onAnimationDone(event: any): void {
    if (event.fromState !== 'void' && (event.toState === 'left' || event.toState === 'right')) {
      if (event.toState === 'left' && this.user) {
        this.swipeLeft.emit(this.user);
      } else if (event.toState === 'right' && this.user) {
        this.swipeRight.emit(this.user);
      }
      this.cardAnimationDone.emit();
      this.resetCardPosition(event.element);
    }
  }


  private resetCardPosition(element: HTMLElement): void {
    element.style.transform = 'translateX(0) rotate(0)';
    element.style.opacity = '1';
    this.swipeState = 'initial';
  }
}
