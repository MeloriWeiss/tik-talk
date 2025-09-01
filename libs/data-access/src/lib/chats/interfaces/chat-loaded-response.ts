import { MessagesGroup, PatchedChat } from './chats.interface';

export interface ChatLoadedResponse {
  activeChat: PatchedChat | null;
  activeChatMessages: MessagesGroup[];
}
