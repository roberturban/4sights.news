import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TopicService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getTopics(): Observable<any> {
    return this.http.get('/api/topics').map(res => res.json());
  }

  countTopics(): Observable<any> {
    return this.http.get('/api/topics/count').map(res => res.json());
  }

  addTopic(topic): Observable<any> {
    return this.http.post('/api/topic', JSON.stringify(topic), this.options);
  }

  getTopic(topic): Observable<any> {
    return this.http.get(`/api/topic/${topic._id}`).map(res => res.json());
  }

  editTopic(topic): Observable<any> {
    return this.http.put(`/api/topic/${topic._id}`, JSON.stringify(topic), this.options);
  }

  deleteTopic(topic): Observable<any> {
    return this.http.delete(`/api/topic/${topic._id}`, this.options);
  }

}

