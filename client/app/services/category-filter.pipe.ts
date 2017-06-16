import { Pipe, PipeTransform } from '@angular/core';
import { ITopics } from '../../../server/interfaces/ITopics';

@Pipe({
    name: 'filterCategories',
    pure: false
})
export class CategoryFilterPipe implements PipeTransform {
	filter_topics = [];
	filter_topic: ITopics;

    transform(items: ITopics[], filter: Array<String>): any {
        
	  	for (var i = 0; i < items.length; i++) {
	  		this.filter_topic = items[i];
		      if (this.filter_topic.categories.find(category => filter.some(f => f == category))) {
		        this.filter_topics.push(this.filter_topic);
		      }
	    }
    return this.filter_topics;

    }
}

