/**
 * Created by Christopher on 17.06.2017.
 */

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CategoryService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getCategories(): Observable<any> {
    return this.http.get('/api/categories').map(res => res.json());
  }

  countCategories(): Observable<any> {
    return this.http.get('/api/categories/count').map(res => res.json());
  }

  addCategory(category): Observable<any> {
    return this.http.post('/api/categories', JSON.stringify(category), this.options);
  }

  getCategory(category): Observable<any> {
    return this.http.get(`/api/categories/${category._id}`).map(res => res.json());
  }

  editCategory(category): Observable<any> {
    return this.http.put(`/api/categories/${category._id}`, JSON.stringify(category), this.options);
  }

  deleteCategory(category): Observable<any> {
    return this.http.delete(`/api/categories/${category._id}`, this.options);
  }


}

