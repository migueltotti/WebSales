import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgFor } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { LoginModel } from '../../models/loginModel';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { error } from 'console';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  email: string = '';
  password: string = '';
  dataSource: LoginModel | undefined;
  isLoadingResults = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private userServ: UserService,
    private snackBar: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  addLogin(form: NgForm) {
    this.isLoadingResults = true;
    this.api.Login(form)
    .pipe(
      switchMap(login => {
        this.dataSource = login;
        sessionStorage.setItem("jwt", this.dataSource!.token);
        this.auth.setUserEmailToStorage();
        this.isLoadingResults = false;
        this.router.navigate(['/home']);
        this.snackBar.openSuccessSnackBar('Welcome! Success Login');
        return this.userServ.getUserByEmail(sessionStorage.getItem('email')!)
      })
    ).subscribe({ 
      next: (user) => {
        console.log(user.userId);
        this.auth.setUserIdToStorage(user.userId);
      }, error: (err) => {
        console.log(err);
        this.isLoadingResults = false;
        this.snackBar.openSuccessSnackBar('Unable to Login! Try again later');
      }, complete: () => {
        console.log('request completed')
      }
    });
  }

  clickEvent() {
    if(this.hide){
      this.hide = false;
    }
    else{
      this.hide = true;
    }
  }
}

/*
<button
          mat-icon-button
          matSuffix
          (click)="clickEvent($event)"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="hide()">
          <mat-icon>{{hide() ? 'visibility_off' : 'visibility'}}</mat-icon>
        </button>

        clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
*/
