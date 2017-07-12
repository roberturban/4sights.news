import { Pipe, PipeTransform } from '@angular/core';

interface IArticle {
  title: String,
  published: Date
}


@Pipe({
    name: 'filterArticles',
    pure: false
})
export class ArticleFilterPipe implements PipeTransform {
    transform(items: IArticle[], filter: String): any {
        if(filter.trim() == "") {
            return items;
        }

        const split = filter.toLowerCase().split(' ');
        var result = [];

	  	for (let i = 0; i < items.length; i++) {
            var add = true;
            for (let j = 0; j < split.length; j++) {
                if(!items[i].title.toLowerCase().includes(split[j])) {
                    add = false;
                    break;
                }
            }
            if(add) {
                result.push(items[i]);
            }
	    }
        return result;
    }
}