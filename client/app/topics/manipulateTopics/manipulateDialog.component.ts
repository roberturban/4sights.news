import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {CategoryService} from "../../services/category.service";


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

  compareFn(c1: ICategory, c2: ICategory): boolean {
    return c1._id === c2._id;
  }

  categoriesAvailable = [];

  constructor(public dialogRef: MdDialogRef<any>,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.loadAvailableCategories();
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => this.categoriesAvailable = data,
      error => console.log(error),
      () => console.log('categories loaded')
    );
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
              private categoryService: CategoryService) {
  }

  addTopicForm: FormGroup;

  categoriesAvailable = [];

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
      data => this.categoriesAvailable = data,
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }

}
