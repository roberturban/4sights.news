import {Component, Inject, ViewChild, TemplateRef} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'teststyle',
  template: '<h1> HI </h1>',
  styleUrls: ['teststyle.css'],
})
export class TestStyleComponent {}