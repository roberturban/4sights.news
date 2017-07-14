import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';
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

  @Input() exttopic;
  topic: any = {};
  searchterm: String = "";
  all_articles = [];
  isLoadingTopic = true;
  isLoadingArticles = true;
  changed_articles = [];

  ngOnInit() {
    this.topicService.getSingleTopic(this.exttopic._id).subscribe(
      data => {
        this.topic = data;
        console.log(data);
        this.isLoadingTopic = false;
      },
      error => console.log(error),
      () => console.log('Topic updated')
    );
    this.articleService.getArticles().subscribe(
      data => {
        this.all_articles = data;
        console.log(data);
        console.log(this.all_articles);
        this.isLoadingArticles = false;
      },
      error => console.log(error),
      () => console.log('articles loaded')
    );
  }

  ngOnDestroy() {
    //TODO: this should be removed and called from parent component
    this.saveArticleChangesOnServer();
  }

  //TODO: should be called from parent component
  saveArticleChangesOnServer() {
    //consider new endpoint for bulk savings
    console.log("Number of articles to update: " + this.changed_articles.length);
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

  formatDate(date) {
    if(!date) {
      return "";
    }
    const newdate = new Date(date);
    const year = newdate.getFullYear();
    const month = newdate.getMonth();
    const day = newdate.getDate();

    return year + "." + month + "." + day;
  }

  setOrigTopic() {
    var arr = [];
    for (var i = 0; i < this.topic.news_articles.length; i++) {
      arr.push(this.topic.news_articles[i]._id);
    }
    this.exttopic.news_articles = arr;
    this.exttopic.news_article_count = arr.length;
  }

  removeSelectedCheck(value, event) {
      this.uncheck(value);
  }

  uncheck(article) {
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

  addSelectedCheck(value, event) {
      this.check(value);
  }

  check(article) {
    for (var i = 0; i < this.all_articles.length; i++) {
      if(this.all_articles[i]._id == article._id) {
        this.all_articles.splice(i, 1);
        break;
      }
    }
    article.topic = this.topic._id;
    this.topic.news_articles.push(article);
    this.setOrigTopic();
    this.addToChanged(article);
  }

  moveup(article) {
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

  movedown(article) {
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

  addToChanged(article) {
    for (var i = 0; i < this.changed_articles.length; i++) {
      if(this.changed_articles[i]._id == article._id) {
        return;
      }
    }
    this.changed_articles.push(article);
  }
}
