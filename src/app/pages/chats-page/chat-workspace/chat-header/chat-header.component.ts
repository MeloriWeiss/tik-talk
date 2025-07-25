import {Component, input} from '@angular/core';
import {Profile} from "../../../../data/interfaces/profile.interface";
import {AvatarCircleComponent} from "../../../../common-ui/avatar-circle/avatar-circle.component";

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  profile = input.required<Profile>();
}
