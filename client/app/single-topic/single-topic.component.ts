import { Component, OnInit, OnDestroy, Inject, Optional, Input} from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';

import { ToastComponent } from '../shared/toast/toast.component';
import { SingleTopicService } from '../services/single-topic.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from "../services/category.service";

import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/switchMap';


@Component({
  selector: 'app-single-topic',
  templateUrl: './single-topic.component.html',
  styleUrls: ['./single-topic.component.scss']
})
export class SingleTopicComponent implements OnInit, OnDestroy {

  constructor(private http: Http,
              public toast: ToastComponent,
              private singleTopicService: SingleTopicService,
              public auth: AuthService,
              private route: ActivatedRoute,
              private sub: Subscription,
              private categoryService: CategoryService) { }

  topic = {};
  topicID = "";
  isLoading_singleTopic = false;

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => console.log(params));

    this.topicID = this.sub.toString();
    // this.getSingleTopic('123123');
  }

  ngOnDestroy() {

  }

  getSingleTopic(id) {
    this.isLoading_singleTopic = true;
    this.singleTopicService.getSingleTopic(id).subscribe(
      data => this.topic = data,
      error => console.log(error),
      () => this.isLoading_singleTopic = false
    );
  }

}
