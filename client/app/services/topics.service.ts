import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TopicsService {
  constructor (
    private http: Http
  ) {}

  getTopics() {
    return this.http.get('assets/data/topics.json').map(res => res.json());
  }

}