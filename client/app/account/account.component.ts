import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
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

  user = {};
  isLoading = true;
  categoriesAvailable = [];
  userCategoryPreferencesMap = [];


  constructor(private auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService,
              private categoryService: CategoryService,
              private manipulationService : ManipulationService) { }

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
      res => this.toast.setMessage('account settings saved!', 'success'),
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
