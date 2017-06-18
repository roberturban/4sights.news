import { Pipe, PipeTransform } from '@angular/core';

interface ITopics {
  title: String,
  timestamp: Date,
  image: String,
  news_article_count: Number,
  location: String,
  categories: [String]
};


@Pipe({
    name: 'filterCategories',
    pure: false
})
export class CategoryFilterPipe implements PipeTransform {
	filter_topics = [];
	return_topics = [];
	filter_topic: ITopics;

    transform(items: ITopics[], filter: Array<String>): any {

	  	for (let i = 0; i < items.length; i++) {
	  		this.filter_topic = items[i];
		      if (this.filter_topic.categories.find(category => filter.some(f => f == category))) {
		        this.filter_topics.push(this.filter_topic);
		      }
	    }
	    this.return_topics = this.filter_topics;
	    this.filter_topics = [];
    return this.return_topics;

    }
}

