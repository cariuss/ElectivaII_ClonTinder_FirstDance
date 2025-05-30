export type SwipeType = 'like' | 'dislike';

export interface CreateSwipeRequest {
  targetUserId: string;
  swipeType: SwipeType;
}

export interface CreateSwipeResponse {
  isMatch: boolean;
}

export interface SwipeHistory {
  userId: string;
  targetUserId: string;
  swipeType: SwipeType;
  timestamp: string;
}
