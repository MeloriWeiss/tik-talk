import { Profile } from '@tt/data-access/profile';

export interface ChatsListItem {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: string;
  unreadMessages: number;
}

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface PatchedChat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: MessagesGroup[];
  companion?: Profile;
}

export interface MessagesGroup {
  date: string;
  messages: Message[];
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt: string;
  user?: Profile;
  isMine?: boolean;
}
