import { Injectable } from '@angular/core';
import {CategoryService} from "./category.service";

@Injectable()
export class ManipulationService {

  categoryArray = [];
  categoriesMap = [];
  //categoriesAvailable = [];

	 constructor(private categoryService: CategoryService) {

  }

  //take mapping back and exclude boolean values
  mapCheckedOptions(categoriesMapped) {

    this.categoryArray = [];

    for (var x = 0; x < categoriesMapped.length; x++) {
      if (categoriesMapped[x].value) {
        this.categoryArray.push(categoriesMapped[x].category);
      }
    }
    return this.categoryArray;
  }

  //set all categories with boolean values
  initCategoriesMap(toMapCategories, categoriesAvailable) {
  		this.categoriesMap = [];

	    for (var x = 0; x<categoriesAvailable.length; x++) {
	        if(toMapCategories.some(f => f._id == categoriesAvailable[x]._id)){
	          this.categoriesMap.push({"category": categoriesAvailable[x], "value": true});
	        } else {
	          this.categoriesMap.push({"category": categoriesAvailable[x], "value": false});
	        }
	        //this.pushObject = {"category": this.categoriesAvailable[x], "value": false};
	    }
	    return this.categoriesMap;
  	}

	  /*loadAvailableCategories() {
	    this.categoryService.getCategories().subscribe(
	      data => {
	      	this.categoriesAvailable = data,
	      	console.log(data,"here man")
	      },
	      error => console.log(error),
	      () => console.log('categories loaded')
	    );
	    console.log(this.categoriesAvailable);
	  }*/

}
