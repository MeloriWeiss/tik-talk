import { MessagesGroup, PatchedChat } from './chats.interface';

export interface ChatLoadedResponse {
  activeChat: PatchedChat;
  activeChatMessages: MessagesGroup[];
}
