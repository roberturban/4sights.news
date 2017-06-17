import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';


// MD Dialog Component -- Maybe better to be refactored to editTopic.component.ts
@Component({
  selector: 'dialogEdit',
  templateUrl: './editTopic.component.html',
  styleUrls: ['../topics.component.scss']
})
export class DialogEdit {

  public dialog_topic;

  //besser wenn man irgendwie das auslagert
  categoriesAvailable = [
    'Politics',
    'Economics',
    'Technology',
    'Sports',
    'Finance',
    'Culture',
    'Science'
  ];

  constructor(public dialogRef: MdDialogRef<any>) {
  }

}


// Dialog for Adding of Topic
@Component({
  selector: 'dialogAdd',
  templateUrl: './addTopic.component.html',
  styleUrls: ['../topics.component.scss']
})
export class DialogAdd implements OnInit {

  constructor(public dialogRef: MdDialogRef<any>,
              private formBuilder_topic: FormBuilder,) {

  }

  addTopicForm: FormGroup;

  categoriesAvailable = [
    'Politics',
    'Economics',
    'Technology',
    'Sports',
    'Finance',
    'Culture',
    'Science'
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
