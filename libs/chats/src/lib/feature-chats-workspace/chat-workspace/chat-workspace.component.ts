import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatMessagesWrapperComponent } from './chat-messages-wrapper/chat-messages-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { chatsActions, selectActiveChat } from '@tt/data-access/chats';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [ChatHeaderComponent, ChatMessagesWrapperComponent],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(Store);

  activeChat = this.store.selectSignal(selectActiveChat);

  constructor() {
    this.activatedRoute.params
      .pipe(
        takeUntilDestroyed(),
        switchMap(({ id }) => {
          if (id === 'new') {
            return this.activatedRoute.queryParams.pipe(
              filter(({ userId }) => userId),
              switchMap(({ userId }) => {
                this.store.dispatch(chatsActions.createChat({ userId }));
                return of(null);
              })
            );
          }
          this.store.dispatch(chatsActions.getChatById({ chatId: id }));
          return of(null);
        })
      )
      .subscribe();
  }

  // activeChat2$ = this.route.params.pipe(
  //   switchMap(({ id }) => {
  //     return timer(0, 500000).pipe(
  //       switchMap(() => {
  //         if (id === 'new') {
  //           return this.route.queryParams.pipe(
  //             filter(({ userId }) => userId),
  //             switchMap(({ userId }) => {
  //               return this.chatsService.createChat(userId).pipe(
  //                 switchMap((chat) => {
  //                   this.router.navigate(['chats', chat.id]).then();
  //                   return of(null);
  //                 })
  //               );
  //             })
  //           );
  //         }
  //         return this.chatsService.getChatById(id);
  //       })
  //     );
  //   })
  // );
}
