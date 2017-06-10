/**
2 * A basic hello-world Angular 2 app
3 */
import {
Component, NgModule,TemplateRef, ViewChild
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl }   from '@angular/forms';
import { Response, Http, HttpModule} from '@angular/http';
import 'rxjs/add/operator/map';


function nameValidator(control: FormControl): { [s: string]: boolean}{
  if (!control.value.match(/.?/)) { //fill in regex if want conditions on name. presently means no or some characters.
    return {invalidname:true};
  }
}
function pwValidator(control: FormControl): { [s: string]: boolean}{
  if (!control.value.match(/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\#$%&/=?_.,:;\\-])).{8,}/)) { //lower case upper case digit and special character, min 8 length.
    return {invalidpw:true};
  }
}
export class loginInfo {
  pw: String;
  name: String;
  constructor(name: String, pw:String){
    this.pw = pw;
    this.name = name;
  }
}
@Component({
 selector: 'view',
 template: `

<!-- Switch Template -->
 <template [ngTemplateOutlet] = "display()"> </template>
 <!-- Change Password Template -->
 <template #reset>
 <form class="ui large form segment" [formGroup]="resetForm" (ngSubmit) ="resetpage()" >
 <h3 class="ui header">Change Password</h3>
  <!-- name -->
 <div class="field"
 [class.error]="!userforchange.valid && userforchange.touched">
 <label for="name">Name:</label>
 <input name="name" placeholder = "foo" #rname [formControl]="resetForm.controls['userforchange']">
  <!-- pw -->
 </div>
 <div class="field" [class.error]="!pwchange.valid && pwchange.touched">
 <label for="pw">Password:</label>
 <input name="pw" placeholder = "Foobartimes8!" #rpw [formControl]="resetForm.controls['pwchange']">
 </div>
  <!-- pwconfirmation -->
 <div class="field" [class.error]="!pwchangeconf.valid && pwchangeconf.touched">
 <label for="pwconf">Password:</label>
 <input name="pwconf" placeholder = "Foobartimes8!" #rrpw [formControl]="resetForm.controls['pwchangeconf']">
 </div>
 <button type="submit"
 class="ui positive center floated button" >
 Send
 </button>
 </form>
 </template>

 <!-- Request Password Template -->
 <template #request>
 <form class="ui large form segment" [formGroup]="requestForm" (ngSubmit) ="resetpage()" >
 <h3 class="ui header">Request Password</h3>
 <!-- email -->
 <div class="field"
 [class.error]="!email.valid && email.touched">
 <label for="email">Email:</label>
 <input name="email" placeholder = "foo" #uemail [formControl]="requestForm.controls['email']">
 </div>
 <button type="submit"
 class="ui positive center floated button" >
 Send
 </button>
 </form>
 </template>


<!-- Home Screen Record Browse Admin -->
<template #home>
<button id = "Record">Record</button>
<button id = "Browse">Browse</button>
<button id = "Admin">Admin</button>
<button id = "Reset" (click)="resetpage()">Reset</button>
</template>


<!-- login Screen -->
 <template #login>
 <div *ngIf="errorlogin"
 class="ui error message">Username and Password combination was incorrect.

 <!--Testing functionality of locked Account.
 Designed to include a custom validation that builds a list of names that are locked for the user  -->
 <div *ngIf="!locked && !name.hasError('required')">This is attempt {{ count + 1 }} of 3</div>
 <div *ngIf="locked && !name.hasError('required')">Account has been locked.</div></div>
 <div *ngIf="name.hasError('invalidname')"
 class="ui error message">name is invalid</div>
 <div *ngIf="name.hasError('required')"
 class="ui error message">name is required</div>
 <div *ngIf="pw.hasError('invalidpw')"
class="ui error message">password is invalid.</div>
<div *ngIf="pw.hasError('required')"
class="ui error message">password is required</div>

  <form class="ui large form segment" [formGroup]="mainForm" (ngSubmit) ="onSubmit(mainForm.value)" >
  <h3 class="ui header">Login</h3>
  <div class="field"
  [class.error]="!name.valid && name.touched">
  <label for="name">Name:</label>
  <input name="name" placeholder = "foo" #uname [formControl]="mainForm.controls['name']">
   <!-- changed -->
  </div>
  <div class="field" [class.error]="!pw.valid && pw.touched">
  <label for="pw">Password:</label>
  <input name="pw" placeholder = "Foobartimes8!" #upw [formControl]="mainForm.controls['pw']"> <!-- changed -->
  </div>
  <button  type="submit"
 class="ui positive center floated button" >
  Send
  </button>
  </form>


 <button (click) = "requestpw()"> Request Password </button>
 <button (click) = "resetpw()"> Reset Password </button>
 </template>
 `
 })
 export class view {
   @ViewChild('login') displayLogin: TemplateRef<any>;
   @ViewChild('home') displayHome: TemplateRef<any>;
   @ViewChild('reset') displayReset: TemplateRef<any>;
   @ViewChild('request') displayRequest: TemplateRef<any>;
   mainForm: FormGroup;
   requestForm: FormGroup;
   resetForm: FormGroup;
   pw: AbstractControl;
   name: AbstractControl;
   email: AbstractControl;
   userforchange: AbstractControl;
   pwchange: AbstractControl;
   pwchangeconf: AbstractControl;
   loading: boolean;
   logjson: Object;
   status: String;
   errorlogin: boolean;
   count: number;
   locked: boolean;
   constructor(fb: FormBuilder, public http: Http) {
     this.count = 0;
     this.loading = true;
     this.errorlogin = false;
     /**/
      this.status = "login";
      this.mainForm = fb.group({
        'pw': ['', Validators.compose([Validators.required, pwValidator])],
        'name': ['', Validators.compose([Validators.required, nameValidator])],
          'email': ['', Validators.compose([Validators.required, nameValidator])],
          'pwchange': ['', Validators.compose([Validators.required, pwValidator])],
          'pwchangeconf': ['', Validators.compose([Validators.required, pwValidator])],
          'userforchange': ['', Validators.compose([Validators.required, nameValidator])]
        });
      this.pw = this.mainForm.controls['pw'];
      this.name = this.mainForm.controls['name'];
      this.email = this.mainForm.controls['email'];
      this.userforchange = this.mainForm.controls['userforchange'];
      this.pwchange = this.mainForm.controls['pwchange'];
      this.pwchangeconf = this.mainForm.controls['pwchangeconf'];
      this.http.get('register_session_permissions.php')
     .map((res:Response) => res.json())
       .subscribe(data => {this.status = data.islog});

   }
   onSubmit(form: any): void {
         if( !this.pw.valid || !this.name.valid) {
           this.errorlogin = true;

           //this is here for testing. delete if not testing.
           this.count += 1; if(this.count > 2){this.locked = true; console.log("account" + this.locked);}
         }
         else { console.log('you submitted value:', form);  console.log("attempting to log in");

         this.http.post('confirmlogin_infoand_changesessioninfo.php', new loginInfo(this.name.value,this.pw.value))
        .map((res:Response) => res.json())
          .subscribe(data => {this.status = data.islog, this.locked = data.locked, this.count = data.count}, err => {console.log(err);});
           this.status = "home";
         if(this.status && !this.locked) {console.log("successful login")} else {
           this.errorlogin = true;
           //testing:
           this.count += 1;
         }

       }

   }
   display() {
     if(this.status === "login"){console.log(this.status);
     return this.displayLogin;
   }
     else if (this.status === "home"){console.log(this.status);
       return this.displayHome;
     }
     else if (this.status === "reset"){console.log(this.status);
       return this.displayReset;
     }
     else if (this.status === "request"){console.log(this.status);
       return this.displayRequest;
     }
   }
   resetpage() {
     this.http.get('reset.php');
     this.status = "login";
console.log(this.status);
   }
   requestpw(){
     this.status = "request";

console.log(this.status);
   }
   resetpw(){
     this.status = "reset";
   }
 }


  @NgModule({
  declarations: [ view,
   // add this
  ],
  imports: [ BrowserModule, ReactiveFormsModule, HttpModule ],
  bootstrap: [ view,   ],
  })
  class ViewAppModule {}

  platformBrowserDynamic().bootstrapModule(ViewAppModule);