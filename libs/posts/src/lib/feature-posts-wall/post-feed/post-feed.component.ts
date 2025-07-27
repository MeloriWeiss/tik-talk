import { Component, inject } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { firstValueFrom } from 'rxjs';
import { PostService } from '../../data';
import { GlobalStoreService } from '@tt/shared';
import { MessageInputComponent } from '../../../../../shared/src/lib/components';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostComponent,
    MessageInputComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;
  profile = inject(GlobalStoreService).me;

  constructor() {
    firstValueFrom(this.postService.fetchPosts()).then();
  }

  onCreatePost(text: string) {
    firstValueFrom(
      this.postService.createPost({
        title: 'Клёвый пост',
        content: text,
        authorId: this.profile()!.id,
      })
    ).then();
  }
}
