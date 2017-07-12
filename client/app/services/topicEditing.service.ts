import { Injectable } from '@angular/core';
import { TopicService } from "./topic.service";
import { ToastComponent } from '../shared/toast/toast.component';

@Injectable()
export class TopicEditingService {

	constructor(
		public topicService : TopicService,
		public toast: ToastComponent){}

	deleteTopic(topic, topics) {
	    if (window.confirm('Are you sure you want to permanently delete this item?')) {
	      this.topicService.deleteTopic(topic).subscribe(
	        res => {
	          const pos = topics.map(elem => elem._id).indexOf(topic._id);
	          topics.splice(pos, 1);
	          this.toast.setMessage('item deleted successfully.', 'success');
	        },
	        error => console.log(error)
	      );
	    }
	    return topics;
  	}
}