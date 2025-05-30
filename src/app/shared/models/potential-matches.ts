import { User } from "./user";

export interface PotentialMatchesResponse {
  users: User[];
  lastId: string;
}
