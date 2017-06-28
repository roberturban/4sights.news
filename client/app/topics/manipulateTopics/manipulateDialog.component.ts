import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {CategoryService} from "../../services/category.service";
import {ManipulationService} from "../../services/manipulation.service";


// MD Dialog Component -- Maybe better to be refactored to editTopic.component.ts

interface ICategory {
  _id: String,
  name: String
}

@Component({
  selector: 'dialogEdit',
  templateUrl: './editTopic.component.html',
  styleUrls: ['./manipulateDialog.component.scss']
})
export class DialogEdit implements OnInit {

  public dialog_topic;
  public categoriesAvailable;
  public categoriesMap =[];
  public topicCategories = [];
  pushObject = {};


  constructor(public dialogRef: MdDialogRef<any>,
              private categoryService: CategoryService,
              private manipulationService : ManipulationService) {
  }

  ngOnInit() {
    this.categoriesMap = this.manipulationService.initCategoriesMap(this.topicCategories,this.categoriesAvailable);
  }


  submitChanges(){
    this.dialog_topic.categories = this.manipulationService.mapCheckedOptions(this.categoriesMap);
    this.dialogRef.close(this.dialog_topic); 
  }

  updateCheckedOptions(value,event){
      value.value = event.checked;
  }


  
}

// Dialog for Adding of Topic
@Component({
  selector: 'dialogAdd',
  templateUrl: './addTopic.component.html',
  styleUrls: ['./manipulateDialog.component.scss']
})
export class DialogAdd implements OnInit {

  constructor(public dialogRef: MdDialogRef<any>,
              private formBuilder_topic: FormBuilder,
              private categoryService: CategoryService,
              private manipulationService: ManipulationService) {
  }

  addTopicForm: FormGroup;

  categoriesAvailable = [];

  //Used filter categoriesSelected before registration 
  categoriesSelected = [];
  //Necessary for mapping categoriesAvailable Objects with boolean
  categoriesMap =[];

  pushObject = {};

  title = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);
  image = new FormControl('', Validators.required);
  news_article_count = new FormControl('', Validators.required);
  location = new FormControl('', Validators.required);
  categories = new FormControl('', Validators.required);

  ngOnInit() {

    this.addTopicForm = this.formBuilder_topic.group({
      title: this.title,
      timestamp: this.timestamp,
      image: this.image,
      news_article_count: this.news_article_count,
      location: this.location,
      categories: this.categories
    });
    this.loadAvailableCategories();
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categoriesAvailable = data,
        this.categoriesMap = this.manipulationService.initCategoriesMap([],this.categoriesAvailable)},
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }
  updateCheckedOptions(value,event){
      value.value = event.checked;
  }


    
  submitTopic(){
    this.addTopicForm.controls['categories'].setValue(this.manipulationService.mapCheckedOptions(this.categoriesMap));
    this.dialogRef.close(this.addTopicForm); 
  }
}
