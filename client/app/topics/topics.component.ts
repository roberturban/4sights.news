import {Component, OnInit, HostListener} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import {TopicService} from '../services/topic.service';
import {AuthService} from '../services/auth.service';
import {CategoryService} from '../services/category.service';

import {ToastComponent} from '../shared/toast/toast.component';
import {DialogAdd, DialogEdit} from './manipulateTopics/manipulateDialog.component';
import {DialogFollowCategories} from './followCategories/followCategoryDialog.component';


@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  constructor(public toast: ToastComponent,
              private topicService: TopicService,
              public dialogEdit: MdDialog,
              public dialogAdd: MdDialog,
              public dialogFollow: MdDialog,
              public auth: AuthService,
              private categoryService: CategoryService) {
  }

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

  //Topics
  topic = {};
  topics = [];

  isLoading_topic = true;
  isEditing_topic = false;
  userHasPreferences = false;


  dialogRef: MdDialogRef<any>;

  categoriesAvailable = [];
  userCategoryPreferences = [];

  // Menu for Toolbar
  menuButton: boolean;

  // Flexbox
  windowWidth: number;
  missingItems: number;
  missingItemsArray = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.calculateLastRowItems();
    this.calculateMenuButton();
  }

  calculateLastRowItems() {
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
    this.topicService.getTopics(category, user).subscribe(
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

  addTopic(addTopicFormDialog) {
    this.topicService.addTopic(addTopicFormDialog.value).subscribe(
      res => {
        const newTopic = res.json();
        this.topics.push(newTopic);
        addTopicFormDialog.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  editTopic(topic) {
    this.topicService.editTopic(topic).subscribe(
      res => {
        this.isEditing_topic = false;
        this.topic = topic;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  cancelEditing_topic() {
    this.isEditing_topic = false;
    this.topic = {};
    this.topics = [];
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the Topics to reset the editing
    this.getTopics();
  }

  deleteTopic(topic) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.topicService.deleteTopic(topic).subscribe(
        res => {
          const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
          this.topics.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
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
    this.dialogRef = this.dialogEdit.open(dialogEdit);
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
          this.toast.setMessage('item cancled.', 'warning');
        } else {
          this.editTopic(result);
          this.toast.setMessage('item edited successfully.', 'success');
        }
      });
  }

  //Dialog for adding topics
  open_add() {
    this.dialogRef = this.dialogAdd.open(dialogAdd);

    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result) {
          this.cancelEditing_topic();
          this.toast.setMessage('item cancled.', 'warning');
        } else {
          this.addTopic(result);
          this.getTopics();
          this.toast.setMessage('item edited successfully.', 'success');
        }

      });
  }

  //Dialog for changing subscription of categories
  open_followCategories() {
    this.dialogRef = this.dialogFollow.open(dialogFollow);
    this.dialogRef.componentInstance.categoriesAvailable = this.categoriesAvailable;
    this.dialogRef.componentInstance.user = this.auth.currentUser;
    this.dialogRef.componentInstance.userCategoryPreferences = this.userCategoryPreferences;

    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result) {
          this.toast.setMessage('subscription was not updated!.', 'warning');
        } else {
          this.toast.setMessage('subscription updated successfully.', 'success');
        }
      });
  }


}

const dialogEdit = DialogEdit;
const dialogAdd = DialogAdd;
const dialogFollow = DialogFollowCategories;
