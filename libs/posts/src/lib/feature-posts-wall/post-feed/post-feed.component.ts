import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { postsActions, selectPosts } from '@tt/data-access/posts';
import { MessageInputComponent } from '@tt/shared';
import { Store } from '@ngrx/store';
import { selectMe } from '@tt/data-access/profile';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostComponent, MessageInputComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent {
  store = inject(Store);

  feed = this.store.selectSignal(selectPosts);
  profile = this.store.selectSignal(selectMe);

  constructor() {
    this.store.dispatch(postsActions.fetchPosts());
  }

  onCreatePost(text: string) {
    this.store.dispatch(
      postsActions.createPost({
        payload: {
          title: 'Клёвый пост',
          content: text,
          authorId: this.profile()!.id,
        },
      })
    );
  }
}
