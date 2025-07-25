import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ChatsListItem} from "../../../data/interfaces/chats.interface";
import {DateDiffPipe} from "../../../helpers/pipes/date-diff.pipe";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DateDiffPipe
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<ChatsListItem>();
}
