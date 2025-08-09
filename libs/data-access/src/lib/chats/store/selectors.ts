import { createSelector } from '@ngrx/store';
import { chatsFeature } from './reducer';

export const selectChats = createSelector(
  chatsFeature.selectChats,
  (chats) => chats
);

export const selectActiveChat = createSelector(
  chatsFeature.selectActiveChat,
  (activeChat) => activeChat
);

export const selectActiveChatMessages = createSelector(
  chatsFeature.selectActiveChatMessages,
  (activeChatMessages) => activeChatMessages
);

export const selectUnreadMessagesCount = createSelector(
  chatsFeature.selectUnreadMessagesCount,
  (unreadMessagesCount) => unreadMessagesCount
);
