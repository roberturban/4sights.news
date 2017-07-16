import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { SnackBarService } from '../services/snackbar.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TopicsService } from '../services/topics.service';
import { CategoryService } from "../services/category.service";
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { DialogEdit } from '../topics/manipulateTopics/manipulateDialog.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {

  constructor(public auth: AuthService,
    public snackBar: MdSnackBar,
    private userService: UserService,
    private topicService: TopicsService,
    private categoryService: CategoryService,
    public dialogEdit: MdDialog,
    private zone: NgZone)
  {
    // listens on
    this.userService.getUsers().subscribe((state) => {
      this.zone.run(() => {
        console.log('user source has been changed.');
      });
    });
  }

  // SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

  users = [];
  topics = [];
  topic = {};
  isLoading = true;
  isEditing_topics = false;
  isEditing_users = true;
  isEditing_topic = false;
  dialogRef: MdDialogRef<any>;
  categoriesAvailable = [];
  source: LocalDataSource;

  //user table settings
  settings = {
      columns: {
        name: {
          title: 'Name',
          filter: false
        },
        surname: {
          title: 'Surname',
          filter: false
        },
        email: {
          title: 'Email',
          filter: false
        },
        role: {
          title: 'Role',
          filter: false
        },
        button: {
          title: 'Delete',
          type: 'custom',
          filter: false,
          class: 'custom-button',
          renderComponent: ButtonViewComponent
        }
       },
       hideSubHeader: true,
       actions:{
         add: false,
         edit: false,
         delete: false
       }
  };



  ngOnInit() {
    this.getUsers();
    this.getTopics();
    this.loadAvailableCategories();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data,
        this.source = new LocalDataSource(this.users)
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteTopic(topic) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
        this.topicService.deleteTopic(topic).subscribe(
          res => {
            const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
            this.topics.splice(pos, 1);
            this.snackBarService.createSnackBar('Item deleted successfully', true, 'Ok','', 3000)
          },
          error => console.log(error)
        );
      }
  }

  getTopics() {
    this.topicService.getTopics().subscribe(
      data => this.topics = data,
      error => console.log(error)
    );
  }

  editTopic(topic) {
    this.topicService.editTopic(topic).subscribe(
      res => {
        this.isEditing_topic = false;
        this.topic = topic;
        this.snackBarService.createSnackBar('Item edited successfully', true, 'Ok','', 3000)
      },
      error => console.log(error)
    );
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categoriesAvailable = data;
      },
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }

  close_editing(form){
    if(form == 'user'){
      this.isEditing_users = false;
    } else {
      this.isEditing_topics = false;
    }
  }

  open_editing(form){
    if(form == 'user'){
      this.isEditing_users = true;
    } else {
      this.isEditing_topics = true;
    }
  }

  onSearch(query: string = '') {
    if(query.length == 0){
        this.source.setFilter([]);
    } else {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'name',
        search: query
      },
      {
        field: 'surname',
        search: query
      },
      {
        field: 'email',
        search: query
      },
      {
        field: 'role',
        search: query
      }
    ], false); }
  // second parameter specifying whether to perform 'AND' or 'OR' search
  // (meaning all columns should contain search query or at least one)
  // 'AND' by default, so changing to 'OR' by setting false here
  }


    // Dialog for editing topics
  open_edit_topic(del_topic) {
    this.dialogRef = this.dialogEdit.open(dialogEdit, {
      panelClass: 'bbb',
    });
    this.isEditing_topic = true;
    this.topic = del_topic;
    this.dialogRef.componentInstance.dialog_topic = del_topic;
    this.dialogRef.componentInstance.categoriesAvailable = this.categoriesAvailable;
    this.dialogRef.componentInstance.topicCategories = del_topic.categories;

    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result) {
          //this.cancelEditing_topic();
          this.snackBarService.createSnackBar('Item canceled', true, 'Ok','', 3000)
        } else {
          this.editTopic(result);
          this.snackBarService.createSnackBar('Item edited successfully', true, 'Ok','', 3000)
        }
      });
  }

}


const dialogEdit = DialogEdit;



@Component({
  selector: 'button-view',
  template: `
    <button md-button (click)="onClick()" [disabled]="auth.currentUser._id === rowData._id">
                      <i class="material-icons">delete</i>
    </button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  constructor(
    public userService: UserService,
    public snackBar: MdSnackBar,
    public admin: AdminComponent,
    public auth: AuthService){}

  // SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.deleteUser(this.rowData);
  }

  deleteUser(user) {
      if (window.confirm('Are you sure you want to permanently delete this user?')) {
        this.userService.deleteUser(user).subscribe(
          data => {
            this.snackBarService.createSnackBar('User deleted successfully', true, 'Ok','', 3000)
            this.admin.getUsers()
        },
          error => console.log(error)
        );
      }
  }
}
