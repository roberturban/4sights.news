import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {CategoryService} from '../services/category.service';
import {ManipulationService} from "../services/manipulation.service";

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


  categoriesAvailable = [];
  //Used filter categoriesSelected before registration 
  categoriesSelected = [];
  //Necessary for mapping categoriesAvailable Objects with boolean
  categoriesMap =[];

  pushObject = {};

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private userService: UserService,
              private categoryService: CategoryService,
              private manipulationService: ManipulationService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      role: this.role,
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
        this.toast.setMessage('you successfully registered!', 'success');
        this.router.navigate(['/login']);
      },
      error => this.toast.setMessage('email already exists', 'danger')
    );
  }

  updateCheckedOptions(value,event){
      value.value = event.checked;
  }

}
