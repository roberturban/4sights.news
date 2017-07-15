import {Component, OnInit} from '@angular/core';
import {MdSnackBar} from '@angular/material';

import {SnackBarService} from '../services/snackbar.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-logout',
  template: '',
  styles: ['']
})
export class LogoutComponent implements OnInit {

  // SnackBar config
  snackBarService = new SnackBarService(this.snackBar);

  constructor(private auth: AuthService,
              public snackBar: MdSnackBar) {
  }


  ngOnInit() {
    this.auth.logout();
    this.snackBarService.createSnackBar('Logged out', true, 'OK', '', 3000)
  }

}
