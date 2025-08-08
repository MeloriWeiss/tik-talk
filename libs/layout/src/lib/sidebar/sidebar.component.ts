import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { AsyncPipe } from '@angular/common';
import {
  profileActions,
  ProfileService,
  selectMe,
} from '@tt/data-access/profile';
import { Store } from '@ngrx/store';
import { ChatsService, isErrorMessage } from '@tt/data-access/chats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '@tt/data-access/auth';

enum menuLinks {
  ME = 'profile/me',
  CHATS = 'chats',
  SEARCH = 'search',
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SubscriberCardComponent,
    RouterLink,
    SvgIconComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  store = inject(Store);
  #chatsService = inject(ChatsService);
  #authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  unreadMessagesCount = this.#chatsService.unreadMessagesCount;
  me = this.store.selectSignal(selectMe);

  subscribers$ = this.profileService.getSubscribersShortList(3);
  menuLinks = menuLinks;
  connectWSSubscription!: Subscription;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: this.menuLinks.ME,
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: this.menuLinks.CHATS,
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: this.menuLinks.SEARCH,
    },
  ];

  constructor() {
    this.connectWs();
  }

  connectWs() {
    this.connectWSSubscription?.unsubscribe();
    this.connectWSSubscription = this.#chatsService
      .connectWs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (message) => {
        if (isErrorMessage(message)) {
          await firstValueFrom(this.#authService.refreshAuthToken());
          this.connectWs();
        }
      });
  }

  ngOnInit() {
    this.store.dispatch(profileActions.getMe());
  }
}
