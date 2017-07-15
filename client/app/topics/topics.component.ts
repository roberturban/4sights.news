import {Component, OnInit, HostListener, Inject, Optional, Input, Pipe, ViewEncapsulation} from '@angular/core';
import {Http} from '@angular/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';

import {SnackBarService} from '../services/snackbar.service';
import {TopicsService} from '../services/topics.service';
import {AuthService} from '../services/auth.service';
import {CategoryService} from "../services/category.service";
import {DialogAdd, DialogEdit} from './manipulateTopics/manipulateDialog.component';
import {DialogFollowCategories} from './followCategories/followCategoryDialog.component';


@Component({
  moduleId: module.id,
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {

  constructor(private http: Http,
              private topicsService: TopicsService,
              private formBuilder_topic: FormBuilder,
              public dialogEdit: MdDialog,
              public dialogAdd: MdDialog,
              public dialogFollow: MdDialog,
              public auth: AuthService,
              private route: ActivatedRoute,
              private categoryService: CategoryService,
              public snackBar: MdSnackBar) {
  }

  // Topics and Cards
  topic = {};
  topics = [];
  filteredTopics = [];
  isLoading_topic = true;
  isEditing_topic = false;

  // Dialog for Manipulation
  dialogRef: MdDialogRef<any>;

  // Categories
  userHasPreferences = false;
  categoriesAvailable = [];
  userCategoryPreferences = [];

  // Menu for Toolbar
  selected = '';
  menuButton: boolean;

  // Flexbox Grid css fix
  windowWidth: number;
  missingItems: number;
  missingItemsArray = [];

  // SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.getTopics(null, this.auth.currentUser);
    } else {
      this.getTopics();
    }
    /*set initial preferences to full, will be checked afterwards*/
    this.loadAvailableCategories();
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categoriesAvailable = data;
        this.setInitialPage();
      },
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }

  // Listens to resize events and calculates blank items to sustain a grid in flexbox
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.calculateLastRowItems();
    this.calculateMenuButton();
  }

  calculateLastRowItems() {
    // Calculates number of blank items
    this.missingItems = Math.floor((this.windowWidth - 100) / 288) - this.topics.length % Math.floor((this.windowWidth - 100) / 288);
    this.missingItemsArray = Array.from(Array(this.missingItems), (x, i) => i);
  }

  calculateMenuButton() {
    if (this.windowWidth < 800) {
      this.menuButton = true;
    } else {
      this.menuButton = false;
    }
  }

  getTopics(category = null, user = null) {
    this.topicsService.getTopics(category, user).subscribe(
      data => this.topics = data,
      error => console.log(error),
      () => {
        this.isLoading_topic = false;
        // Convert Timestamp
        this.topics.map(tp => {
          tp.timestamp = new Date(Date.parse(tp.timestamp)).toDateString();
        })
        // Calculate CSS Flexbox Last Row Items
        this.windowWidth = window.innerWidth;
        this.calculateLastRowItems();
        this.calculateMenuButton();
        ;
      }
    );
  }

  addTopic(topic) {
    this.topicsService.addTopic(topic).subscribe(
      res => {
        const newTopic = res.json();
        this.topics.push(newTopic);
        this.snackBarService.createSnackBar('Item added successfully', true, 'Ok', '', 3000)
      },
      error => console.log(error)
    );
  }

  editTopic(topic) {
    this.topicsService.editTopic(topic).subscribe(
      res => {
        this.isEditing_topic = false;
        this.topic = topic;
        this.snackBarService.createSnackBar('Item edited', true, 'Ok', '', 3000)
      },
      error => console.log(error)
    );
  }

  cancelEditing_topic() {
    this.isEditing_topic = false;
    this.topic = {};
    this.topics = [];
    this.snackBarService.createSnackBar('Editing cancelled', true, 'Ok', '', 3000)
    // reload the Topics to reset the editing
    this.getTopics();
  }

  deleteTopic(topic) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.topicsService.deleteTopic(topic).subscribe(
        res => {
          const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
          this.topics.splice(pos, 1);
          this.snackBarService.createSnackBar('Item deleted', true, 'Ok', '', 3000)
        },
        error => console.log(error)
      );
    }
  }

  setInitialPage() {
    this.userCategoryPreferences = this.categoriesAvailable;
    this.getUserCategoryPreferences();
  }

  getTopics_category(value) {
    if (value == 'Home') {
      this.setInitialPage();
    } else {
      this.getTopics(value);
      this.userCategoryPreferences = [value];
    }
    this.calculateLastRowItems();
    this.calculateMenuButton();
  }

  getUserCategoryPreferences() {
    //initiate with full
    if (this.auth.currentUser.categories.length > 0) {
      this.userCategoryPreferences = this.auth.currentUser.categories;
      this.userHasPreferences = true;
    }
  }

  // Dialog windows
  // Dialog for editing topics
  open_edit(del_topic) {
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
          this.cancelEditing_topic();
          this.snackBarService.createSnackBar('Editing canceled', true, 'Ok', '', 3000)
        } else {
          this.editTopic(result);
          this.snackBarService.createSnackBar('Item edited', true, 'Ok', '', 3000)
        }
      });
  }

  //Dialog for adding topics
  open_add() {
    this.dialogRef = this.dialogAdd.open(dialogAdd, {
      panelClass: 'bbb',
    });

    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result) {
          this.cancelEditing_topic();
          this.snackBarService.createSnackBar('Adding cancelled', true, 'Ok', '', 3000)
        } else {
          this.addTopic(result);
          this.getTopics();
          console.log("reloading");
          this.snackBarService.createSnackBar('Item added', true, 'Ok', '', 3000)
        }
      });
  }

  //Dialog for changing subscription of categories
  open_followCategories() {
    this.dialogRef = this.dialogFollow.open(dialogFollow, {
      panelClass: 'custom-overlay-pane-class',
    });
    this.dialogRef.componentInstance.categoriesAvailable = this.categoriesAvailable;
    this.dialogRef.componentInstance.user = this.auth.currentUser;
    this.dialogRef.componentInstance.userCategoryPreferences = this.userCategoryPreferences;

    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result) {
          this.snackBarService.createSnackBar('Subscription not updated', true, 'Ok', '', 3000)
        } else {
          this.snackBarService.createSnackBar('Updated succesfully', true, 'Ok', '', 3000)
        }
      });
  }
}

const dialogEdit = DialogEdit;
const dialogAdd = DialogAdd;
const dialogFollow = DialogFollowCategories;
