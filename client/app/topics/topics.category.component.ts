import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ToastComponent } from '../shared/toast/toast.component';
import { TopicService } from '../services/topic.service';
import { AuthService } from '../services/auth.service';

import { ITopics } from '../../../server/interfaces/ITopics';

import { DialogAdd, DialogEdit } from './manipulateTopics/manipulateDialog.component';


@Component({
  selector: 'app-category-topics',
  templateUrl: './topics.category.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsCategoryComponent implements OnInit {


  constructor(private http: Http,
              public toast: ToastComponent,
              private topicService: TopicService,
              private formBuilder_topic: FormBuilder,
              public dialog: MdDialog,
              public dialogAdd: MdDialog,
              public auth: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.getTopics();
    this.sub = this.route.params.subscribe(params => {
       this.active_category = params['category'];
       this.getTopics_category(this.active_category);
       // In a real app: dispatch action to load the details here.
    });

  }

    //Topics
  topic = {};
  topics = [];
  filter_topic: ITopics;
  filter_topics = [];

  topic_cancel = {};
  isLoading_topic = true;
  isEditing_topic = false;


  active_category: String;
  private sub: any;

 
  dialogRef: MdDialogRef<any>;

  categoriesAvailable =  [
    'Politics',
    'Technology',
    'Sports',
    'Economics'
  ];

  userCategoryPreferences = [];


  getTopics() {

    this.topicService.getTopics().subscribe(
      data => this.topics = data,
      error => console.log(error),
      () => this.isLoading_topic = false
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
    this.topicService.editTopic(topic).subscribe(
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

  // Dialog for Editing Topics

  open_edit(del_topic) {
    this.dialogRef = this.dialog.open(dialog);
    this.enableEditing_topic(del_topic);
    this.dialogRef.componentInstance.dialog_topic = del_topic;
    
    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result){
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
        if (!result){
          this.cancelEditing_topic();
          this.toast.setMessage('item cancled.', 'warning');
        } else {
           this.addTopic(result);
           this.toast.setMessage('item edited successfully.', 'success');
        }
        
    });
  }


  getTopics_category(value) {
    //had to make a promise due to asynchronous call
    this.topicService.getTopics().subscribe(
      data => this.filterTopicsByCategory(value,data),
      error => console.log(error),
      () => this.isLoading_topic = false
    );
  }

  filterTopicsByCategory(value,data){
    for (var i = 0; i < data.length; i++) {
      this.filter_topic = data[i];

      if (this.filter_topic.categories.find(category => category == value)) {
        this.filter_topics.push(this.filter_topic);
      }
    }
    this.topics = this.filter_topics;
    this.filter_topics = [];
  };  


  /*filterTopicsByCategories(values,data){
    for (var i = 0; i < data.length; i++) {
      this.filter_topic = data[i];
      if (this.filter_topic.categories.find(category => values.some(f => f == category))) {
        this.filter_topics.push(this.filter_topic);
      }
    }
    this.topics = this.filter_topics;
  };  */

}

const dialog = DialogEdit;
const dialogAdd = DialogAdd; 

