import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InternshipProfession,
  InternshipsListItem,
  MyMockTodoService,
} from './my-mock-todo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

interface InternshipForm {
  specialization: FormControl<string | null>;
  profession: FormControl<string | null>;
}

interface Internship {
  specialization?: string;
  profession?: string;
}

function getInternshipForm(
  internship: Internship = {}
): FormGroup<InternshipForm> {
  return new FormGroup({
    specialization: new FormControl<string>(internship.specialization ?? '', [
      Validators.required,
    ]),
    profession: new FormControl<string>(internship.profession ?? '', [
      Validators.required,
    ]),
  });
}

@Component({
  selector: 'app-exp-my-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './exp-my-form-todo.component.html',
  styleUrl: './exp-my-form-todo.component.scss',
})
export class ExpMyFormTodoComponent {
  myMockService = inject(MyMockTodoService);
  internshipsList: InternshipsListItem[] = [];
  commonInternshipsList: {
    professions?: InternshipProfession[];
    sub?: Subscription;
  }[] = [];

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    patronymic: new FormControl(''),
    phone: new FormControl('', [Validators.required]),
    education: new FormGroup({
      school: new FormControl('', [Validators.required]),
      faculty: new FormControl('', [Validators.required]),
      major: new FormControl('', [Validators.required]),
    }),
    internships: new FormArray<FormGroup<InternshipForm>>([
      getInternshipForm(),
    ]),
  });

  constructor() {
    this.myMockService
      .getInternships()
      .pipe(takeUntilDestroyed())
      .subscribe((internships) => {
        this.internshipsList = internships;
      });

    this.form.controls.internships.controls.forEach((internship, index) => {
      const sub = internship.controls.specialization.valueChanges.subscribe(
        (value) => {
          const currentInternship = this.internshipsList.find(
            (internship) => internship.value === value
          );

          if (currentInternship) {
            // TODO убрать index из замыкания и сделать поиск актуального индекса
            this.commonInternshipsList[index].professions =
              currentInternship.professions;
          }
        }
      );

      this.commonInternshipsList.push({ sub });
    });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    console.log('Форма валидна');
  }

  addInternship() {
    this.form.controls.internships.push(getInternshipForm());

    const index = this.form.controls.internships.length - 1;

    const sub = this.form.controls.internships.controls
      .at(index)
      ?.controls.specialization?.valueChanges.subscribe((value) => {
        const currentInternship = this.internshipsList.find(
          (internship) => internship.value === value
        );

        if (currentInternship) {
          this.commonInternshipsList[index].professions =
            currentInternship.professions;
        }
      });

    if (sub) {
      this.commonInternshipsList.push({ sub });
    }
  }

  removeInternship(index: number) {
    this.commonInternshipsList[index]?.sub?.unsubscribe();

    if (this.form.controls.internships.length > 1) {
      this.form.controls.internships.removeAt(index);
    }

    this.commonInternshipsList.splice(index, 1);
  }

  ngOnDestroy() {
    this.commonInternshipsList.forEach((internship) =>
      internship.sub?.unsubscribe()
    );
  }

  ngDoCheck() {
    console.log(this.commonInternshipsList);
  }
}
