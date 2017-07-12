import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(items: ITopics[], filter: string): any {
        /*if (!items || !filter) {
            return items;
        }*/
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item) => item.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
}

interface ITopics {
  title: String,
  timestamp: Date,
  image: String,
  news_article_count: Number,
  location: String,
}

