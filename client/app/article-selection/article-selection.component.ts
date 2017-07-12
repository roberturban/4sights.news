import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from "../services/article.service";
import { TopicService } from "../services/topic.service";

@Component({
  selector: 'app-article-selection',
  templateUrl: './article-selection.component.html',
  styleUrls: ['./article-selection.component.scss'],
  encapsulation: ViewEncapsulation.None //TODO: check this again
})
export class ArticleSelectionComponent implements OnInit, OnDestroy {

  constructor(private articleService: ArticleService,
              private topicService: TopicService
  ) { }

  @Input() exttopic;
  topic: any = {};
  searchterm: String = "";
  all_articles = [];
  isLoadingTopic = true;
  isLoadingArticles = true;
  isLoading = true;
  changed_articles = [];

  ngOnInit() {
    this.topicService.getTopic(this.exttopic).subscribe(
      data => {
        this.topic = data;
        console.log(data);
        this.isLoadingTopic = false;
        this.checkLoading();
      },
      error => console.log(error),
      () => console.log('Topic updated')
    );
    this.articleService.getArticles().subscribe(
      data => {
        console.log("Total number: " + data.length);
        this.all_articles = data.slice(4,7);
        console.log(this.all_articles);
        this.isLoadingArticles = false;
        this.checkLoading();
      },
      error => console.log(error),
      () => console.log('articles loaded')
    );
  }

  ngOnDestroy() {
    console.log("Number of articles to update: " + this.changed_articles.length);
    //TODO: this should be removed and called from parent component
    this.saveChanges();
  }

  //TODO: should be called from parent component
  saveChanges() {
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

  checkLoading() {
    if (!this.isLoadingArticles && !this.isLoadingTopic) {
      this.isLoading = false;
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
    //for some reason the topic provided from via input() does not have the article documents
    var arr = [];
    for (var i = 0; i < this.topic.news_articles.length; i++) {
      arr.push(this.topic.news_articles[i]._id);
    }
    this.exttopic.news_articles = arr;
    this.exttopic.news_article_count = arr.length;
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
    /*
    const transformed = this.changed_articles.map((x) => {
      x._id;
    });
    console.log(transformed);
    const index = this.changed_articles.map((x) => {x._id;}).indexOf(article._id);
    console.log("index: " + index);
    if(index < 0) {
      this.changed_articles.push(article);
      console.log("article added to changed array");
      console.log(article);
    }
    */
    for (var i = 0; i < this.changed_articles.length; i++) {
      if(this.changed_articles[i]._id == article._id) {
        return;
      }
    }
    this.changed_articles.push(article);
    console.log("pushed");
    console.log(this.changed_articles);
  }
}