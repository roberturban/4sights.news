import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

@Component({
  selector: 'dialogSelectSources',
  templateUrl: './select-sources.component.html',
  styleUrls: ['./select-sources.component.scss']
})
export class SelectSourcesDialog implements OnInit {

  constructor(private formBuilder_topic: FormBuilder,
              public dialofRef: MdDialogRef<any>) { }

  allSources = [];
  currentSources = [];

  ngOnInit(){
    console.log(this.allSources);
  }

}
