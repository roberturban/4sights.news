import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { SnackBarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { CategoryService } from '../services/category.service';
import { ManipulationService } from "../services/manipulation.service";

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

  categories = new FormControl('', [Validators.required]);


  categoriesAvailable = [];
  //Used filter categoriesSelected before registration
  categoriesSelected = [];
  //Necessary for mapping categoriesAvailable Objects with boolean
  categoriesMap =[];

  pushObject = {};

  // SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public snackBar: MdSnackBar,
              private userService: UserService,
              private categoryService: CategoryService,
              private manipulationService: ManipulationService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      categories: this.categories
    });
    this.loadAvailableCategories();
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categoriesAvailable = data,
        this.categoriesMap = this.manipulationService.initCategoriesMap([],this.categoriesAvailable)
      },
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }

  register() {
    this.registerForm.controls['categories'].setValue(this.manipulationService.mapCheckedOptions(this.categoriesMap));
    this.userService.register(this.registerForm.value).subscribe(
      res => {
        this.snackBarService.createSnackBar('Successfully registered', false, '','', 1000)
        this.router.navigate(['/login']);
      },
      error => this.snackBarService.createSnackBar('Email already exists', false, '','', 1000)
    );
  }

  updateCheckedOptions(value,event){
      value.value = event.checked;
  }

}
