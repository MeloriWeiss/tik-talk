import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { startWith } from 'rxjs';
import { ScrollBlockDirective, SvgIconComponent } from '@tt/common-ui';
import { chatsActions, ChatsService, selectChats } from '@tt/data-access/chats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    RouterLink,
    RouterLinkActive,
    ScrollBlockDirective,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);
  store = inject(Store);

  filterChatsControl = new FormControl('');

  chats = this.store.selectSignal(selectChats);

  constructor() {
    this.chatsService.messages$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.store.dispatch(chatsActions.getMyChats());
    });

    this.filterChatsControl.valueChanges
      .pipe(takeUntilDestroyed(), startWith(''))
      .subscribe((inputValue) => {
        this.store.dispatch(chatsActions.filterChats({ value: inputValue }));
      });
  }

  // chats$ = this.chatsService.messages$.pipe(
  //   switchMap(() => {
  //     return this.chatsService.getMyChats().pipe(
  //       switchMap((chats) => {
  //         return this.filterChatsControl.valueChanges.pipe(
  //           startWith(''),
  //           map((inputValue) => {
  //             return chats.filter((chat) => {
  //               return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
  //                 .toLowerCase()
  //                 .includes(inputValue?.toLowerCase() ?? '');
  //             });
  //           })
  //         );
  //       })
  //     );
  //   })
  // );
}
