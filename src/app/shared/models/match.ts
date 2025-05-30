import { User } from "./user";

export interface MatchHistory {
  id: string;
  userId: string;
  targetUserId: string;
  createdAt: string;
  targetUser: User;
}
