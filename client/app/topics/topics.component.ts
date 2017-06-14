import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ToastComponent } from '../shared/toast/toast.component';
import { TopicsService } from '../services/topics.service';
import { TopicService } from '../services/topic.service';



@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {


  constructor(private http: Http,
              public toast: ToastComponent,
              private topicsService : TopicsService,
              private topicService: TopicService,
              private formBuilder_topic: FormBuilder,
              public dialog: MdDialog,
              public dialogAdd: MdDialog) { }

  ngOnInit() {

    //this.getTopics_data();
    this.getTopics();
  }


    //Topics
  topic = {};
  topics = [];
  topic_cancel = {};
  isLoading_topic = true;
  isEditing_topic = false;

 
  dialogRef: MdDialogRef<any>;


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




  /* ------------ FIRST TRY WITH LOCAL JSON
  topics_data = {};

  getTopics_data() {

    this.topicsService.getTopics().subscribe(
      data => this.topics_data = data,
      error => console.log(error)
    );
    console.log(this.topics_data);
  }
  */

}

// MD Dialog Component -- Maybe better to be refactored to editTopic.component.ts
@Component({
  selector: 'dialogEdit',
  templateUrl: './editTopic.component.html',
  styleUrls: ['./topics.component.scss']
})
export class DialogEdit{

  public dialog_topic;

  //besser wenn man irgendwie das auslagert
  categoriesAvailable =  [
    'Politics',
    'Technology',
    'Sports',
    'Economics'
  ];


  constructor(public dialogRef: MdDialogRef<any>) {}
    
  }


// Dialog for Adding of Topic
 @Component({
  selector: 'dialogAdd',
  templateUrl: './addTopic.component.html',
  styleUrls: ['./topics.component.scss']
})
export class DialogAdd implements OnInit{

  constructor(public dialogRef: MdDialogRef<any>,
              private formBuilder_topic: FormBuilder,) {
    
  }
    
    addTopicForm: FormGroup;
    
    categoriesAvailable =  [
    'Politics',
    'Technology',
    'Sports',
    'Economics'
    ];
    title = new FormControl('', Validators.required);
    timestamp = new FormControl('', Validators.required);
    image = new FormControl('', Validators.required);
    news_article_count = new FormControl('', Validators.required);
    location = new FormControl('', Validators.required);
    categories = new FormControl('', Validators.required);  

    ngOnInit() {

    //this.getTopics_data();
    //this.getTopics();
    this.addTopicForm = this.formBuilder_topic.group({
      title: this.title,
      timestamp: this.timestamp,
      image: this.image,
      news_article_count: this.news_article_count,
      location: this.location,
      categories: this.categories
    });
  }

  }


const dialog = DialogEdit;
const dialogAdd = DialogAdd; 
