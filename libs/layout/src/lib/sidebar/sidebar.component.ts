import { Component, inject, OnInit } from '@angular/core';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { AsyncPipe } from '@angular/common';
import { profileActions, ProfileService, selectMe } from '@tt/data-access/profile';
import { Store } from '@ngrx/store';

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

  subscribers$ = this.profileService.getSubscribersShortList(3);
  me = this.store.selectSignal(selectMe);

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    this.store.dispatch(profileActions.getMe());
  }
}
