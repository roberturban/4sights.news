import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SingleTopicService {

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

  getSingleTopic(topicID): Observable<any> {
    console.log(this.http.get(`/api/topics/${topicID}`, this.getOptions()).map(res => res.json()));
    return this.http.get(`/api/topics/${topicID}`, this.getOptions()).map(res => res.json());
  }

}
