import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              public snackBar: MdSnackBar) { }

  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  // SnackBar config
  errorText = "";
  label: boolean;
  labelText = "";
  addExtraClass = true;

  createSnackBar(errorText, label, labelText, addExtraClass){
    let config = new MdSnackBarConfig();
    config.extraClasses = this.addExtraClass ? ['addExtraClass'] : null;
    this.errorText = errorText;
    this.label = label;
    this.labelText = labelText;
    this.snackBar.open(this.errorText, this.label && this.labelText, config);
  }

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      res => this.router.navigate(['/']),
      error => this.createSnackBar('Invalid email or password!', true, 'Ok', '')
    );
  }

}
