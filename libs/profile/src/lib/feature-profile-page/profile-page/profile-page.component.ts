import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ScrollBlockDirective } from '@tt/common-ui';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { ProfileService } from '../../data/index';
import { ProfileHeaderComponent } from '../../ui';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
    ScrollBlockDirective,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(6);

  isMyPage = signal(false);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()!.id);

      if (this.isMyPage()) {
        return this.me$;
      }
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } }).then();
  }
}
