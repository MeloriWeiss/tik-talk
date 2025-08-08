import { Component, inject } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map, startWith, switchMap, tap } from 'rxjs';
import { ScrollBlockDirective, SvgIconComponent } from '@tt/common-ui';
import { ChatsService } from '@tt/data-access/chats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ScrollBlockDirective,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('');

  chats$ = this.chatsService.messages$.pipe(
    switchMap(() => {
      return this.chatsService.getMyChats().pipe(
        switchMap((chats) => {
          return this.filterChatsControl.valueChanges.pipe(
            startWith(''),
            map((inputValue) => {
              return chats
                .filter((chat) => {
                  return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
                    .toLowerCase()
                    .includes(inputValue?.toLowerCase() ?? '');
                })
            })
          );
        })
      );
    })
  );
}
