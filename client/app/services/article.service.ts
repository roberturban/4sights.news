import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ArticleService {

  private getHeaders = function() {
    return new Headers({
      'Content-Type': 'application/json',
      'Charset': 'UTF-8',
      'Authorization': localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : null
    });
  }

  private getOptions = function() {
    return new RequestOptions({headers: this.getHeaders()});
  }

  constructor(private http: Http) { }

  getArticles(): Observable<any> {
    return this.http.get('/api/articles', this.getOptions()).map(res => res.json());
  }

  getArticle(article): Observable<any> {
    return this.http.get(`/api/articles/${article._id}`, this.getOptions()).map(res => res.json());
  }

  editArticle(article): Observable<any> {
    return this.http.put(`/api/articles/${article._id}`, JSON.stringify(article), this.getOptions());
  }
}

