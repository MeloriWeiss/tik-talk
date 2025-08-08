import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access/profile';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  profile = input<Profile>();
}
