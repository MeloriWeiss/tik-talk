import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NoReactValidator } from './no-react.validator';

@Component({
  selector: 'app-exp-td-forms',
  standalone: true,
  imports: [FormsModule, JsonPipe, NoReactValidator],
  templateUrl: './exp-td-forms.component.html',
  styleUrl: './exp-td-forms.component.scss',
})
export class ExpTdFormsComponent {
  person = {
    name: '',
    lastName: '',
    address: {
      street: '',
      building: 0,
    },
  };

  hobby = '';

  onChange(value: string) {
    console.log(value);
    this.person.name = value;
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }
}
