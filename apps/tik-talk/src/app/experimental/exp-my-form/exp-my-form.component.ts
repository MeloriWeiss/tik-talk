import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InternshipProfession, MyMockService } from './my-mock.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoOptions } from '@maskito/core';

interface EducationForm {
  school: FormControl<string | null>;
  faculty: FormControl<string | null>;
  major: FormControl<string | null>;
}

function getEducationForm(): FormGroup<EducationForm> {
  return new FormGroup({
    school: new FormControl('', [Validators.required]),
    faculty: new FormControl('', [Validators.required]),
    major: new FormControl('', [Validators.required]),
  });
}

function getProfessionControl(initialValue: string = ''): FormControl<string | null> {
  return new FormControl<string>(initialValue ?? '', [Validators.required]);
}

const validateRepeatedProfessions: ValidatorFn = (control: AbstractControl) => {
  return control.value.length === new Set(control.value).size
    ? null
    : { repeatedProfessions: { message: 'Профессии не должны повторяться' } };
};

@Component({
  selector: 'app-exp-my-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaskitoDirective],
  templateUrl: './exp-my-form.component.html',
  styleUrl: './exp-my-form.component.scss',
})
export class ExpMyFormComponent {
  myMockService = inject(MyMockService);
  internships = this.myMockService.internships;
  currentProfessions: InternshipProfession[] = [];

  maskitoOptions: MaskitoOptions = {
    mask: [
      '+',
      '7',
      ' ',
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
  };

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    patronymic: new FormControl(''),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)
    ]),
    educations: new FormArray<FormGroup<EducationForm>>([getEducationForm()]),
    internship: new FormGroup({
      specialization: new FormControl<string>('', [Validators.required]),
      professions: new FormArray<FormControl<string | null>>(
        [getProfessionControl()],
        validateRepeatedProfessions
      ),
    }),
  });

  constructor() {
    this.myMockService.getInternships().pipe(takeUntilDestroyed()).subscribe();

    this.form.controls.internship.controls.specialization.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const currentProfessions = this.internships().find(
          (internship) => internship.value === value
        )?.professions;

        if (currentProfessions) {
          this.currentProfessions = currentProfessions;
        }

        this.form.controls.internship.controls.professions.controls.forEach(
          (profession) => {
            profession.reset('');
          }
        );
      });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    console.log('Форма валидна');
    console.log(this.form.value);
  }

  addInternship() {
    if (
      this.form.controls.internship.controls.professions.length <
      this.currentProfessions.length
    ) {
      this.form.controls.internship.controls.professions.push(
        getProfessionControl()
      );
    }
  }

  removeInternship(index: number) {
    if (this.form.controls.internship.controls.professions.length > 1) {
      this.form.controls.internship.controls.professions.removeAt(index);
    }
  }

  addEducation() {
    this.form.controls.educations.push(getEducationForm());
  }

  removeEducation(index: number) {
    if (this.form.controls.educations.length > 1) {
      this.form.controls.educations.removeAt(index);
    }
  }
}
