import {
  ChangeDetectionStrategy,
  Component, computed,
  forwardRef, HostBinding,
  HostListener, input
} from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'tt-badges-input',
  standalone: true,
  imports: [SvgIconComponent, FormsModule, AsyncPipe],
  templateUrl: './badges-input.component.html',
  styleUrl: './badges-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => BadgesInputComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgesInputComponent implements ControlValueAccessor {
  keyCode = input('enter');
  #code = computed(() => this.keyCode().toLowerCase());

  value$ = new BehaviorSubject<string[]>([]);
  #disabled = false;
  innerInput = '';

  @HostBinding('class.disabled')
  get disabled() {
    return this.#disabled;
  }

  @HostListener('keydown', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (event.code.toLowerCase() !== this.#code()) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    if (!this.innerInput) {
      return;
    }
    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value$.value);
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.value$.next([]);
      return;
    }
    this.value$.next(stack);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.#disabled = isDisabled;
  }

  onTagDelete(index: number) {
    const tags = [...this.value$.value];
    tags.splice(index, 1);
    this.value$.next(tags);
    this.onChange(this.value$.value);
  }

  onChange(value: string[] | null) {}

  onTouched() {}
}
