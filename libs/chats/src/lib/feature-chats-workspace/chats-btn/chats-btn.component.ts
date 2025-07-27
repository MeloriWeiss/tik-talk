import { Component, input } from '@angular/core';
import { ChatsListItem } from '../../data/interfaces/chats.interface';
import { AvatarCircleComponent, DateDiffPipe } from '@tt/common-ui';

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
