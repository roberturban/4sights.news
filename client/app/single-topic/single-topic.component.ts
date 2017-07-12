import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, Optional, Input} from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';

import { ToastComponent } from '../shared/toast/toast.component';
import { SingleTopicService } from '../services/single-topic.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from "../services/category.service";

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
              private route: ActivatedRoute) { }

  topic: {};
  articles: [any];
  first_articles = [];
  sub: any;
  topicID: any;
  isLoading_singleTopic = false;

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
        this.first_articles = this.articles.slice(0,4);
      },
      error => console.log(error),
      () => {
        this.isLoading_singleTopic = false;
        console.log('topic loaded', this.topic, this.articles, this.first_articles);
      }
    );
  }

}
