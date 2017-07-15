import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';


export class SnackBarService {

  constructor(public snackBar: MdSnackBar) { }

  // SnackBar config
  errorText = "";
  label: boolean;
  labelText = "";
  addExtraClass = true;

  createSnackBar(errorText, label, labelText, addExtraClass, time){
    console.log("creating snackbar");
    let config = new MdSnackBarConfig();
    config.extraClasses = this.addExtraClass ? ['addExtraClass'] : null;
    config.duration = time;
    this.errorText = errorText;
    this.label = label;
    this.labelText = labelText;
    this.snackBar.open(this.errorText, this.label && this.labelText, config);
  }

}
