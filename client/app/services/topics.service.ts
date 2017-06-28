import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TopicsService {

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

  getTopics(): Observable<any> {
    return this.http.get('/api/topics', this.getOptions()).map(res => res.json());
  }

  countTopics(): Observable<any> {
    return this.http.get('/api/topics/count', this.getOptions()).map(res => res.json());
  }

  addTopic(topic): Observable<any> {
    return this.http.post('/api/topics', JSON.stringify(topic), this.getOptions());
  }

  editTopic(topic): Observable<any> {
    return this.http.put(`/api/topics/${topic._id}`, JSON.stringify(topic), this.getOptions());
  }

  deleteTopic(topic): Observable<any> {
    return this.http.delete(`/api/topics/${topic._id}`, this.getOptions());
  }


}
