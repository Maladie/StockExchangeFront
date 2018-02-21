import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RegisterData} from './register-data';
import {WebApiObservableService} from '../shared/web-api-obserable.service';
import {ResponseInfo} from '../shared/response-info';
import {MatDialogRef} from '@angular/material';
import {AuthService} from '../shared/auth.service';
import {LoginData} from '../login/login-data';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  result: ResponseInfo = new ResponseInfo();
  myform: FormGroup;
  username: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  name: FormControl;
  surname: FormControl;
  money: FormControl;
  autologin: FormControl;
  processingAnim = false;
  processingAnimLogin = false;

  constructor(private _webApiObservable: WebApiObservableService, public dialogRef: MatDialogRef<RegisterComponent>, private auth: AuthService) {
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.surname = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.money = new FormControl('', [Validators.required, Validators.minLength(1)]);
    this.username = new FormControl('', [Validators.required, Validators.minLength(4)]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
    this.confirmPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
    this.autologin = new FormControl(false);
  }

  createForm() {
    this.myform = new FormGroup({
      username: this.username,
      password: this.password,
      name: this.name,
      surname: this.surname,
      money: this.money,
      confirmPassword: this.confirmPassword,
      autologin: this.autologin
    });
  }

  onSubmit() {
    if (this.myform.valid) {
      this.result.code = -1; // reset response code
      // const h = new HttpHeaders().append('Authorization', 'Basic ' + btoa(this.username.value + ':' + this.password.value));
      const registerData = new RegisterData(this.username.value, this.password.value, this.name.value, this.surname.value, this.money.value);

      this.processingAnim = true; // register anim.
      this._webApiObservable.addNewUserJSON(registerData).subscribe(data => {
        this.result = data as ResponseInfo;
        console.log(data);
        if (this.autologin) {
          this.autologinProcessing();
        }
        this.processingAnim = false;
      }, err => {
        this.processingAnim = false;
        console.log('Registration error!');
        console.log(err.error);
        this.result = err.error as ResponseInfo;
      });
    } else {
      console.log('Not submitted, invalid data');
    }
  }

  private autologinProcessing() {
    if (this.username.valid && this.password.valid) {
      this.processingAnim = false;
      this.processingAnimLogin = true; // login anim.
      this.auth.loginUser(new LoginData(this.username.value, this.password.value)).subscribe(resp => {
        this.processingAnimLogin = false;
        this.dialogRef.close();
      }, err => {
        this.processingAnimLogin = false;
        this.dialogRef.close();
      });
    }
  }
}
