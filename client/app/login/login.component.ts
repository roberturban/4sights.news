import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { SnackBarService } from '../services/snackbar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              public snackBar: MdSnackBar) { }

  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  // SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

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
      res => {
        this.router.navigate(['/']);
        this.snackBarService.createSnackBar('Successfully logged in', false, '','', 1000)
      },
      error => this.snackBarService.createSnackBar('Invalid email or password', true, 'Ok','', 3000)
    );
  }

}
