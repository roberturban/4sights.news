import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, Optional, Input} from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ToastComponent } from '../shared/toast/toast.component';
import { SingleTopicService } from '../services/single-topic.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from "../services/category.service";
import { SelectSourcesDialog } from './select-sources/select-sources.component';


@Component({
  moduleId: module.id,
  selector: 'app-single-topic',
  templateUrl: './single-topic.component.html',
  styleUrls: ['./single-topic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SingleTopicComponent implements OnInit, OnDestroy {

  constructor(private http: Http,
              public toast: ToastComponent,
              private singleTopicService: SingleTopicService,
              public auth: AuthService,
              private route: ActivatedRoute,
              public dialogSelectSource: MdDialog) { }

  topic: {};
  articles: [any];
  currentArticles = [];
  sub: any;
  topicID: any;
  isLoading_singleTopic = false;

  dialogRef: MdDialogRef<any>;

  ngOnInit() {
    this.sub = this.route.params
      .subscribe((params:Params) => {this.topicID = params.id});
    this.getSingleTopic();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getSingleTopic() {
    this.isLoading_singleTopic = true;
    this.singleTopicService.getSingleTopic(this.topicID).subscribe(
      data => {
        this.topic = data;
        this.articles = this.topic["news_articles"];
        this.currentArticles = this.articles.slice(0,4);
      },
      error => console.log(error),
      () => {
        this.isLoading_singleTopic = false;
        console.log('topic loaded', this.topic, this.articles, this.currentArticles);
      }
    );
  }

  visitExternalLink(link){
    console.log(link.url, 'href');
     window.open(link.url, '_blank');
  }

  selectSources(){
    this.dialogRef = this.dialogSelectSource.open(SelectSourcesDialog, {
      panelClass: 'custom-overlay-pane-class',
    });
    this.dialogRef.componentInstance.allArticles = this.articles;
    this.dialogRef.componentInstance.currentArticles = this.currentArticles;
  }

}
