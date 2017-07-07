import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { ArticleService } from '../services/article.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';


@Component({
  selector: 'app-article-selection',
  templateUrl: './article-selection.component.html',
  styleUrls: ['./article-selection.component.scss'],
  encapsulation: ViewEncapsulation.None,  //TODO: check this again
})
export class ArticleSelectionComponent implements OnInit {
  topic = {};
  isLoading = true;

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private articleService: ArticleService,
              public dialogEdit: MdDialog) { }

  ngOnInit() {
    this.getUsers();
    this.loadAvailableCategories();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.users = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}