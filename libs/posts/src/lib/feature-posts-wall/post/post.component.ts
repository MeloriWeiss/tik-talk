import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { CommentComponent } from '../../ui';
import {
  AvatarCircleComponent,
  DateDiffPipe,
  SvgIconComponent,
} from '@tt/common-ui';
import {
  Post,
  PostComment,
  postsActions,
  selectCommentsByPostId,
} from '@tt/data-access/posts';
import { MessageInputComponent } from '@tt/shared';
import { Store } from '@ngrx/store';
import { selectMe } from '@tt/data-access/profile';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    CommentComponent,
    DateDiffPipe,
    MessageInputComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  store = inject(Store);

  post = input<Post>();
  profile = this.store.selectSignal(selectMe);
  comms!: Signal<PostComment[]>;

  comments = computed(() => {
    if (this.comms()?.length > 0) {
      return this.comms();
    }
    return this.post()?.comments;
  });

  @ViewChild('commentsContainer') commentsContainer!: ElementRef;

  constructor() {
    effect(() => {
      this.comments();
      requestAnimationFrame(() => {
        this.commentsContainer.nativeElement.scrollTop =
          this.commentsContainer.nativeElement.scrollHeight;
      });
    });
  }

  ngOnInit() {
    this.comms = this.store.selectSignal(
      selectCommentsByPostId(this.post()!.id)
    );
  }

  async onCreatedComment(text: string) {
    this.store.dispatch(
      postsActions.createComment({
        payload: {
          text: text,
          authorId: this.profile()!.id,
          postId: this.post()!.id,
        },
      })
    );
  }
}
