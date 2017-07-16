import { Pipe, PipeTransform } from '@angular/core';

interface IArticle {
  title: String,
  published: Date,
  source: {
      name: String
  }
}


@Pipe({
    name: 'filterArticles',
    pure: false
})
export class ArticleFilterPipe implements PipeTransform {
    transform(items: IArticle[], filter: String, filterArticles: IArticle[]): any {
        var result = [];

	  	for (let i = 0; i < items.length; i++) {
            if (this.checkSearchTerm(filter, items[i]) && this.checkSources(filterArticles, items[i])) {
                result.push(items[i]);
            }
	    }
        return result;
    }

    checkSources(filterArticles: IArticle[], article: IArticle) {
        if(!filterArticles) {
            return true;
        }

        for (let i = 0; i < filterArticles.length; i++) {
            if(filterArticles[i].source.name == article.source.name) {
                return false;
            }
        }
        return true;
    }

    checkSearchTerm(searchTerm, item:IArticle) {
        if(searchTerm.trim() == "") {
            return true;
        }

        const split = searchTerm.toLowerCase().split(' ');
        for (let j = 0; j < split.length; j++) {
            if(!item.title.toLowerCase().includes(split[j])) {
                return false;
            }
        }
        return true;
    }
}