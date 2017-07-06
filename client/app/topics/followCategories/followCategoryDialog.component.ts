import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { CategoryService } from "../../services/category.service";
import { ManipulationService } from "../../services/manipulation.service";
import { UserService } from '../../services/user.service';


@Component({
  selector: 'dialogEdit',
  templateUrl: './followCategoryDialog.component.html',
  styleUrls: ['./followCategoryDialog.component.scss']
})
export class DialogFollowCategories implements OnInit {

  categoriesAvailable = [];
  userCategoryPreferencesMap = [];
  userCategoryPreferences = [];
  user = {};


  constructor(public dialogRef: MdDialogRef<any>,
              private categoryService: CategoryService,
              private manipulationService : ManipulationService,
              private userService : UserService ) {
  }

  ngOnInit() {
    this.userCategoryPreferencesMap = this.manipulationService.initCategoriesMap(this.userCategoryPreferences,this.categoriesAvailable);
  }


  updateCheckedOptions(value,event){
      value.value = event.checked;
  }

  save(user) {
    user.categories = this.manipulationService.mapCheckedOptions(this.userCategoryPreferencesMap);
    this.userService.editUser(user).subscribe(
      res => this.dialogRef.close(true),
      error => console.log(error)
    );
  }


  
}