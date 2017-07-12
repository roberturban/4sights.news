import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, Optional, Input} from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'dialogSelectSources',
  templateUrl: './select-sources.component.html',
  styleUrls: ['./select-sources.component.scss']
})
export class SelectSourcesDialog implements OnInit {

  constructor(private http: Http,
              private route: ActivatedRoute,
              public dialogSelectSource: MdDialog) { }

  allArticles = [];
  currentArticles = [];

  ngOnInit(){}

  checkIfCurrent(current){
    if(!this.currentArticles.includes(current)) return "0.2";
    else return "1.0";
  }

  onClick(current){
    if (this.checkIfCurrent(current) === "0.2")
      this.addToCurrent(current);
    else (this.removeCurrent(current));
  }

  addToCurrent(current){
    if(this.currentArticles.length<4){
      this.currentArticles.push(current);
    }
  }

  removeCurrent(current){
    if(this.currentArticles.length>0){
      this.currentArticles.splice(this.currentArticles.indexOf(current), 1);
    }
  }

}
