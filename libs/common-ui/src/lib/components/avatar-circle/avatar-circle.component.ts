import { Component, input } from '@angular/core';
import { ImgUrlPipe } from '../../pipes/index';

@Component({
  selector: 'app-avatar-circle',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
})
export class AvatarCircleComponent {
  initialUrl = 'assets/svg/avatar-placeholder.svg';

  avatarUrl = input<string | null | undefined>(this.initialUrl);
}
