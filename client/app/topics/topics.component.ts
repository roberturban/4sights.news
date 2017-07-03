import { Component, OnInit, Inject, Optional, Input} from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ToastComponent } from '../shared/toast/toast.component';
import { TopicsService } from '../services/topics.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from "../services/category.service";

import { DialogAdd, DialogEdit } from './manipulateTopics/manipulateDialog.component';



@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  constructor(private http: Http,
              public toast: ToastComponent,
              private topicsService: TopicsService,
              private formBuilder_topic: FormBuilder,
              public dialog: MdDialog,
              public dialogAdd: MdDialog,
              public auth: AuthService,
              private route: ActivatedRoute,
              private categoryService: CategoryService) { }

  ngOnInit() {
    this.getTopics();
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
  filter_topics = [];

  topic_cancel = {};
  isLoading_topic = true;
  isEditing_topic = false;
  userHasPreferences = false;

  active_category: String;
  private sub: any;


  dialogRef: MdDialogRef<any>;

  categoriesAvailable = [];

  userCategoryPreferences = [];


  getTopics() {
    this.topicsService.getTopics().subscribe(
      data => this.topics = data,
      error => console.log(error),
      () => this.isLoading_topic = false
    );
  }

  addTopic(addTopicFormDialog) {
    this.topicsService.addTopic(addTopicFormDialog.value).subscribe(
      res => {
        const newTopic = res.json();
        this.topics.push(newTopic);
        addTopicFormDialog.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing_topic(topic) {
    this.isEditing_topic = true;
    this.topic = topic;
  }

  cancelEditing_topic() {
    this.isEditing_topic = false;
    this.topic = {};
    this.topics = [];
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the Topics to reset the editing
    this.getTopics();
  }

  editTopic(topic) {
    this.topicsService.editTopic(topic).subscribe(
      res => {
        this.isEditing_topic = false;
        this.topic = topic;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteTopic(topic) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.topicsService.deleteTopic(topic).subscribe(
        res => {
          const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
          this.topics.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  // Dialog for Editing Topics

  open_edit(del_topic) {
    this.dialogRef = this.dialog.open(dialog);
    this.enableEditing_topic(del_topic);
    this.dialogRef.componentInstance.dialog_topic = del_topic;

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

  // Dialog for Adding Topics
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

  setInitialPage(){
    this.userCategoryPreferences = this.categoriesAvailable;
    this.getUserCategoryPreferences();
  }

  getTopics_category(value) {
    if(value=='Home'){
      this.setInitialPage();
    } else{
      this.active_category = value;
      this.userCategoryPreferences = [value];
    }
  }

  getUserCategoryPreferences(){
    //initiate with full
    if(this.auth.currentUser.categories.length > 0){
      this.userCategoryPreferences = this.auth.currentUser.categories;
      this.userHasPreferences = true;
    }
  };

}

const dialog = DialogEdit;
const dialogAdd = DialogAdd;
