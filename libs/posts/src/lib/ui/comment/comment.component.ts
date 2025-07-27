import { Component, input } from '@angular/core';
import { PostComment } from '@tt/data-access/posts';
import { AvatarCircleComponent, DateDiffPipe } from '@tt/common-ui';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, DateDiffPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
