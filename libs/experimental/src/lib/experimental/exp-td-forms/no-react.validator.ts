import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[noReact]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NoReactValidator,
    },
  ],
})
export class NoReactValidator implements Validator {
  change!: () => void;

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return control.value?.toLowerCase() === 'react'
      ? { noReact: { message: `НИКАКИХ РЕАКТОВ!!! ${control.status}` } }
      : null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.change = fn;
  }
}
