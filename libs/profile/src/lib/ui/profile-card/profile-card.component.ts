import { Component, Input } from '@angular/core';
import { AvatarCircleComponent, ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access/profile';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe, AvatarCircleComponent, RouterLink, SvgIconComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
