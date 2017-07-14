import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {CategoryService} from "../../services/category.service";
import {ManipulationService} from "../../services/manipulation.service";
import {TopicsService} from "../../services/topics.service";
import {ArticleSelectionComponent} from "./../../article-selection/article-selection.component";


@Component({
  selector: 'dialogEdit',
  templateUrl: './editTopic.component.html',
  styleUrls: ['./manipulateDialog.component.scss']
})
export class DialogEdit implements OnInit {
  @ViewChild(ArticleSelectionComponent) articleselection:ArticleSelectionComponent;

  public dialog_topic;
  public categoriesAvailable;
  public categoriesMap =[];
  public topicCategories = [];


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
    this.articleselection.saveArticleChangesOnServer();
  }

  updateCheckedOptions(value,event){
      value.value = event.checked;
  }

  selectedArticlesChanged(articles) {
    this.dialog_topic.news_articles = articles;
    this.dialog_topic.news_article_count = articles.lenght;
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
              private manipulationService: ManipulationService,
              private topicsService: TopicsService) {
  }

  @ViewChild(ArticleSelectionComponent) articleselection:ArticleSelectionComponent;

  addTopicForm: FormGroup;

  categoriesAvailable = [];

  //Used filter categoriesSelected before registration
  categoriesSelected = [];
  //Necessary for mapping categoriesAvailable Objects with boolean
  categoriesMap =[];

  title = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);
  image = new FormControl('', Validators.required);
  //news_article_count = new FormControl('', Validators.required);
  location = new FormControl('', Validators.required);
  categories = new FormControl('', Validators.required);
  news_articles: any = {};
  news_article_count = 0;

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

  selectedArticlesChanged(articles) {
    this.news_articles = articles;
    this.news_article_count = articles.length;
  }

  submitTopic() {
    this.addTopicForm.controls['categories'].setValue(this.manipulationService.mapCheckedOptions(this.categoriesMap));

    var topic = this.addTopicForm.value;
    topic.news_articles = this.news_articles;
    topic.news_article_count = this.news_article_count;

    this.dialogRef.close(topic);
    this.articleselection.saveArticleChangesOnServer();
    this.addTopicForm.reset();
  }
}
