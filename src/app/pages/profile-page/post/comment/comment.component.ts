import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from "../../../../common-ui/avatar-circle/avatar-circle.component";
import {PostComment} from "../../../../data/interfaces/post.interface";
import {DateDiffPipe} from "../../../../helpers/pipes/date-diff.pipe";

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DateDiffPipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<PostComment>();
}
