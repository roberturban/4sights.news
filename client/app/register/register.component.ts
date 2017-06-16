import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  name = new FormControl('', [Validators.required,
                                  Validators.minLength(2),
                                  Validators.maxLength(30),
                                  Validators.pattern('[a-zA-Z_-\\s]*')]);

  surname = new FormControl('', [Validators.required,
                                  Validators.minLength(2),
                                  Validators.maxLength(30),
                                  Validators.pattern('[a-zA-Z_-\\s]*')]);

  email = new FormControl('', [Validators.required,
                                Validators.minLength(3),
                                Validators.maxLength(100),
                                Validators.pattern(EMAIL_REGEX)]);

  password = new FormControl('', [Validators.required,
                                  Validators.minLength(6)]);

  role = new FormControl('', [Validators.required]);

  categories = new FormControl('', [Validators.required]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      role: this.role,
      categories: this.categories
    });
  }

  setClassName() {
    console.log(this.name.hasError('required') && this.name.dirty);
    return this.name.hasError('required') && this.name.dirty;
  }

  setClassSurname() {
    return !this.surname.pristine && !this.surname.valid ;
  }

  setClassEmail() {
    return !this.email.pristine && !this.email.valid;
  }
  setClassPassword() {
    return !this.password.pristine && !this.password.valid;
  }

  register() {
    this.userService.register(this.registerForm.value).subscribe(
      res => {
        this.toast.setMessage('you successfully registered!', 'success');
        this.router.navigate(['/login']);
      },
      error => this.toast.setMessage('email already exists', 'danger')
    );
  }
}
