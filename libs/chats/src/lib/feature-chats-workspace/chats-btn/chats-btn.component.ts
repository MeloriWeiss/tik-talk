import { Component, input } from '@angular/core';
import { AvatarCircleComponent, DateDiffPipe } from '@tt/common-ui';
import { ChatsListItem } from '@tt/data-access/chats';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, DateDiffPipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<ChatsListItem>();
}
