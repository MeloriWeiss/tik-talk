import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { DadataService } from '../../data/index';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DadataSuggestion } from '../../data/interfaces/dadata.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressInputComponent implements ControlValueAccessor {
  #dadataService = inject(DadataService);

  isDropdownOpened = signal(false);

  innerSearchControl = new FormControl('');

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
  });

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap((val) => {
      return this.#dadataService.getSuggestion(val ?? '').pipe(
        tap((res) => {
          this.isDropdownOpened.set(!!res.length);
        })
      );
    })
  );

  constructor() {
    this.addressForm.valueChanges
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          const address = Object.values(this.addressForm.value).join(', ');
          this.innerSearchControl.setValue(address, { emitEvent: false });
          this.onChange(address);
        })
      )
      .subscribe();
  }

  writeValue(address: string): void {
    const [city, street, building] = address.split(/\s*,\s*/);
    this.addressForm.patchValue({
      city,
      street,
      building,
    });
    this.innerSearchControl.setValue(address, { emitEvent: false });
  }

  setDisabledState(isDisabled: boolean): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value: any) {}

  onTouched() {}

  onSuggestionPick(suggest: DadataSuggestion) {
    this.isDropdownOpened.set(false);

    const formData = {
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house,
    };
    this.addressForm.setValue(formData, { emitEvent: false });
    this.innerSearchControl.setValue(suggest.value, { emitEvent: false });
    this.onChange(Object.values(formData).join(', '));
  }
}
