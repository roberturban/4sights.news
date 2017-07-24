import {Component} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {AuthService} from './services/auth.service';
import {SnackBarService} from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  snackBarService = new SnackBarService(this.snackBar);

  constructor(public auth: AuthService,
              private snackBar: MdSnackBar) {
  }

  logout() {
    this.auth.logout();
    this.snackBarService.createSnackBar('Logged out', true, 'OK', '', 3000)
  }
}
