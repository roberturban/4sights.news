import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TopicService } from './services/topic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService,
  	public topicService : TopicService) { }

  //needs to be modified to get initial view when clicked on logo
  initialView(){
  	
  }


}
