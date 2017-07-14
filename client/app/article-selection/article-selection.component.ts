import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ArticleService } from "../services/article.service";
import { SingleTopicService } from "../services/single-topic.service";

@Component({
  selector: 'app-article-selection',
  templateUrl: './article-selection.component.html',
  styleUrls: ['./article-selection.component.scss'],
  encapsulation: ViewEncapsulation.None //TODO: check this again
})
export class ArticleSelectionComponent implements OnInit, OnDestroy {

  constructor(private articleService: ArticleService,
              private topicService: SingleTopicService
  ) { }

  @Input() exttopic: any = {};

  private topic: any = {
    news_articles: []
  };
  private searchterm: String = "";
  private all_articles = [];
  private isLoadingTopic = true;
  private isLoadingArticles = true;
  private changed_articles = [];

  @Output() onSelectionChange = new EventEmitter();

  ngOnInit() {
    if(this.exttopic._id) {
      this.topicService.getSingleTopic(this.exttopic._id).subscribe(
        data => {
          this.topic = data;
          this.isLoadingTopic = false;
        },
        error => console.log(error),
        () => console.log('Topic updated')
      );
    }
    else {
      this.isLoadingTopic = false;
    }
    this.articleService.getArticles().subscribe(
      data => {
        this.all_articles = data;
        this.isLoadingArticles = false;
      },
      error => console.log(error),
      () => console.log('articles loaded')
    );
  }

  ngOnDestroy() {
    //TODO: this should be removed and called from parent component
    //this.saveArticleChangesOnServer();
  }

  //TODO: should be called from parent component
  saveArticleChangesOnServer() {
    //consider new endpoint for bulk savings
    console.log("Number of articles updated: " + this.changed_articles.length);
    for (var i = 0; i < this.changed_articles.length; i++) {
      this.articleService.editArticle(this.changed_articles[i]).subscribe(
        res => {
          console.log("Article saved on server: ");
          console.log(res);
        },
        error => console.log(error)
      );
    }
  }

  private formatDate(date) {
    if(!date) {
      return "";
    }
    const newdate = new Date(date);
    const year = newdate.getFullYear();
    const month = newdate.getMonth();
    const day = newdate.getDate();

    return year + "." + month + "." + day;
  }

  private setOrigTopic() {
    var arr = [];
    for (var i = 0; i < this.topic.news_articles.length; i++) {
      arr.push(this.topic.news_articles[i]._id);
    }
    this.exttopic.news_articles = arr;
    this.exttopic.news_article_count = arr.length;

    this.onSelectionChange.emit(arr);
  }

  private removeSelectedCheck(value, event) {
      this.uncheck(value);
  }

  private uncheck(article) {
    for (var i = 0; i < this.topic.news_articles.length; i++) {
      if(this.topic.news_articles[i]._id == article._id) {
        this.topic.news_articles.splice(i, 1);
        break;
      }
    }
    article.topic = null;
    this.all_articles.push(article);
    this.setOrigTopic();
    this.addToChanged(article);
  }

  private addSelectedCheck(value, event) {
      this.check(value);
  }

  private check(article) {
    for (var i = 0; i < this.all_articles.length; i++) {
      if(this.all_articles[i]._id == article._id) {
        this.all_articles.splice(i, 1);
        break;
      }
    }
    article.topic = this.topic._id;

    if(this.topic.news_articles.count == 0) {
      this.topic = {
        news_articles: [article]
      }
    } else {
      this.topic.news_articles.push(article);
    }

    this.setOrigTopic();
    this.addToChanged(article);
  }

  private moveup(article) {
    for (var i = 0; i < this.topic.news_articles.length; i++) {
      if(this.topic.news_articles[i]._id == article._id && i > 0) {
        const temp = this.topic.news_articles[i];
        this.topic.news_articles[i] = this.topic.news_articles[i - 1];
        this.topic.news_articles[i - 1] = temp;
        break;
      }
    }
    this.setOrigTopic();
  }

  private movedown(article) {
    for (var i = 0; i < this.topic.news_articles.length; i++) {
      if(this.topic.news_articles[i]._id == article._id && i < (this.topic.news_articles.length -1)) {
        const temp = this.topic.news_articles[i];
        this.topic.news_articles[i] = this.topic.news_articles[i + 1];
        this.topic.news_articles[i + 1] = temp;
        break;
      }
    }
    this.setOrigTopic();
  }

  private addToChanged(article) {
    for (var i = 0; i < this.changed_articles.length; i++) {
      if(this.changed_articles[i]._id == article._id) {
        return;
      }
    }
    this.changed_articles.push(article);
  }
}
