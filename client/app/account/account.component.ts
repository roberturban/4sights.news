import { Component, OnInit, NgZone } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { SnackBarService } from '../services/snackbar.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CategoryService } from '../services/category.service';
import { ManipulationService } from '../services/manipulation.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private auth: AuthService,
              public snackBar: MdSnackBar,
              private userService: UserService,
              private categoryService: CategoryService,
              private manipulationService : ManipulationService,
              private zone: NgZone) {
               }

  //SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

  // User handling
  user = {};
  isLoading = true;
  categoriesAvailable = [];
  userCategoryPreferencesMap = [];

  ngOnInit() {
    this.getUser();
    this.loadAvailableCategories();
  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => this.user = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  save(user) {
    user.categories = this.manipulationService.mapCheckedOptions(this.userCategoryPreferencesMap);
    this.userService.editUser(user).subscribe(
      res => {
        this.snackBarService.createSnackBar('Account settings saved', true, 'Ok','', 3000);
        this.auth.updateUser(res.json().token);
        this.getUser()
      },
      error => console.log(error)
    );
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categoriesAvailable = data,
        this.userCategoryPreferencesMap = this.manipulationService.initCategoriesMap(this.auth.currentUser.categories, this.categoriesAvailable)
       },
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }

  updateCheckedOptions(value,event){
      value.value = event.checked;
  }




}
