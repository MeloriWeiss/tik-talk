import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

type PasswordTypes = 'text' | 'password';

@Component({
  selector: 'tt-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TtInputComponent implements ControlValueAccessor {
  cdr = inject(ChangeDetectorRef);

  type = input<PasswordTypes>('text');
  placeholder = input('Введите...');

  buttonDisabled = computed(() => this.type() !== 'password');
  baseType = computed<PasswordTypes>(() => {
    const type = this.type();
    if (type !== 'password') {
      return type;
    }
    return this.isPasswordVisible() ? 'text' : 'password';
  });

  isPasswordVisible = signal<boolean>(false);
  disabled = signal(false);

  onChange: any;
  onTouched: any;

  value: string | null = null;

  writeValue(val: string | null): void {
    this.value = val;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onModelChange(val: string | null) {
    this.onChange(val);
  }

  togglePasswordVisibility() {
    if (this.type() === 'password') {
      this.isPasswordVisible.set(!this.isPasswordVisible());
    }
  }
}
