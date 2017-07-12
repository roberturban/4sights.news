import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

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

  register(user): Observable<any> {
    return this.http.post('/api/users', JSON.stringify(user), this.getOptions());
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/users/login', JSON.stringify(credentials), this.getOptions());
  }

  getUsers(): Observable<any> {
    return this.http.get('/api/users', this.getOptions()).map(res => res.json());
  }

  addUser(user): Observable<any> {
    return this.http.post('/api/users', JSON.stringify(user), this.getOptions());
  }

  getUser(user): Observable<any> {
    return this.http.get(`/api/users/${user._id}`, this.getOptions()).map(res => res.json());
  }

  editUser(user): Observable<any> {
    return this.http.put(`/api/users/${user._id}`, JSON.stringify(user), this.getOptions());
  }

  deleteUser(user): Observable<any> {
    return this.http.delete(`/api/users/${user._id}`, this.getOptions());
  }

}
