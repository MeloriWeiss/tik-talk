import {Component, computed, effect, inject, signal} from '@angular/core';
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {DndDirective} from "../../../common-ui/directives/dnd.directive";
import {FormsModule} from "@angular/forms";
import {ProfileService} from "../../../data/services/profile.service";
import {environment} from "../../../../environments/environment";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [
    SvgIconComponent,
    DndDirective,
    FormsModule
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  profileService = inject(ProfileService);

  avatar: File | null = null;
  me = this.profileService.me;

  preview = signal<string>('/assets/svg/avatar-placeholder.svg');

  constructor() {
    toObservable(this.me)
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.preview.set(environment.baseApiUrl + this.me()?.avatarUrl);
      });
  }

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) {
      return;
    }

    const reader = new FileReader();

    reader.onload = event => {
      this.preview.set(event.target?.result?.toString() ?? '');
    }

    reader.readAsDataURL(file);

    this.avatar = file;
  }
}
