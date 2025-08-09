import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AvatarCircleComponent, DateDiffPipe } from '@tt/common-ui';
import { ChatsListItem } from '@tt/data-access/chats';
import { selectMe } from '@tt/data-access/profile';
import { Store } from '@ngrx/store';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, DateDiffPipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsBtnComponent {
  me = inject(Store).selectSignal(selectMe);

  chat = input<ChatsListItem>();
}
