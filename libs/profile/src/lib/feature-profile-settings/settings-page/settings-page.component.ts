import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MainTextareaComponent, SvgIconComponent } from '@tt/common-ui';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui/index';
import { ProfileService } from '@tt/data-access/profile';
import { AuthService } from '@tt/data-access/auth';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    RouterLink,
    AvatarUploadComponent,
    MainTextareaComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  router = inject(Router);
  authService = inject(AuthService);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  onTextareaInput(value: string) {
    this.form.patchValue({ description: value });
  }

  onSave() {
    this.form.markAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      ).then();
    }

    firstValueFrom(
    //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
    ).then(() => {
      this.router.navigate(['/profile/me']).then();
    });
  }

  splitStack(stack: string | null | undefined | string[]): string[] {
    if (!stack) {
      return [];
    }
    if (Array.isArray(stack)) {
      return stack;
    }
    return stack.split(/\s*,\s*/);
  }

  mergeStack(stack: string | null | undefined | string[]): string {
    if (!stack) {
      return '';
    }
    if (Array.isArray(stack)) {
      return stack.join(', ');
    }
    return stack;
  }

  logout() {
    this.authService.logout();
  }
}
