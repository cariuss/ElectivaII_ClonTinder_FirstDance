export interface Message {
  id?: number;
  senderId: string;
  matchId: string;
  content: string;
  timestamp?: string;
}

export interface MessagesResponse {
  messages: Message[];
}


export interface SocketSendMessagePayload {
  chatId: string;
  content: string;
}


export interface SocketJoinChatPayload {
  otherUserId: string;
}


export interface SocketJoinedPayload {
  roomId: string;
}
