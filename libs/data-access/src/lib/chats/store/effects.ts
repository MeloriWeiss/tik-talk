import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { chatsActions } from './actions';
import { ChatsService } from '../services';
import { map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatsEffects {
  actions$ = inject(Actions);
  chatsService = inject(ChatsService);
  router = inject(Router)

  getMyChats = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.getMyChats),
      switchMap(() => {
        return this.chatsService.getMyChats();
      }),
      map((res) => chatsActions.chatsLoaded({ chats: res }))
    );
  });

  getChatById = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.getChatById),
      switchMap(({ chatId }) => {
        return this.chatsService.getChatById(chatId);
      }),
      map((res) => chatsActions.chatLoaded(res))
    );
  });

  createChat = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.createChat),
      switchMap(({ userId }) => {
        return this.chatsService.createChat(userId)
          .pipe(
            tap(chat => {
              this.router.navigate(['chats', chat.id]).then();
            })
          );
      }),
      map((res) => chatsActions.chatCreated({ chat: res }))
    );
  });
}
