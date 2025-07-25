import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  QueryList,
  signal,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ChatMessageComponent} from "./chat-messages-group/chat-message/chat-message.component";
import {MessageInputComponent} from "../../../../common-ui/message-input/message-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {PatchedChat} from "../../../../data/interfaces/chats.interface";
import {firstValueFrom} from "rxjs";
import {ScrollBlockDirective} from "../../../../common-ui/directives/scroll-block.directive";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {ChatMessagesGroupComponent} from "./chat-messages-group/chat-messages-group.component";

@Component({
  selector: 'app-chat-messages-wrapper',
  standalone: true,
  imports: [
    MessageInputComponent,
    ScrollBlockDirective,
    ChatMessagesGroupComponent

  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss'
})
export class ChatMessagesWrapperComponent {
  chatsService = inject(ChatsService);

  chat = input.required<PatchedChat>();
  messagesGroups = this.chatsService.activeChatMessages;

  currentMessagesGroupDate = signal<string>('');

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor() {
    toObservable(this.chat)
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        this.currentMessagesGroupDate.set(this.messagesGroups()[this.messagesGroups().length - 1]?.date);
      });
  }

  onChangeGroupDate(date: string) {
    this.currentMessagesGroupDate.set(date);
  }


  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText));
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));

    requestAnimationFrame(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    });
  }
}
