
import {
Component, NgModule,TemplateRef, ViewChild
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl }   from '@angular/forms';
import { Response, Http, HttpModule, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";
interface Scripts {
   name: string;
   src: string;
}
export const ScriptStore: Scripts[] = [
   {name: 'webrtcadapter', src: 'https://webrtc.github.io/adapter/adapter-latest.js'},
   {name: 'mediarecorder', src: 'js/main.js'}
];
//<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
//<script src="js/main.js"></script>
declare var document: any;

@Injectable()
export class ScriptService {

public scripts: any = {};

constructor() {
    ScriptStore.forEach((script: any) => {
        this.scripts[script.name] = {
            loaded: false,
            src: script.src
        };
    });
}

load(...scripts: string[]) {
    var promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
}

loadScript(name: string) {
    return new Promise((resolve, reject) => {
        //resolve if already loaded
        if (this.scripts[name].loaded) {
            resolve({script: name, loaded: true, status: 'Already Loaded'});
        }
        else {
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].src;
            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true, status: 'Loaded'});
                    }
                };
            } else {  //Others
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                };
            }
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    });
}

}



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
export class userInfo {
  pw: String;
  name: String;
  constructor(name: String, pw:String){
    this.pw = pw;
    this.name = name;
  }
}
@Component({
  providers: [ScriptService],
 selector: 'view',
 template: `
 <!-- Switch Template -->
 <template [ngTemplateOutlet] = "displayPage"> </template>
 <!-- Change Password Template -->
 <template #reset>
 <form class="ui large form segment" [formGroup]="mainForm" (ngSubmit) ="resetpage()" >
 <h3 class="ui header">Change Password</h3>
  <!-- name -->
 <div class="field"
 [class.error]="!userforchange.valid && userforchange.touched">
 <label for="name">Name:</label>
 <input name="name" placeholder = "foo" #rname [formControl]="mainForm.controls['userforchange']">
  <!-- pw -->
 </div>
 <div class="field" [class.error]="!pwchange.valid && pwchange.touched">
 <label for="pw">Password:</label>
 <input name="pw" placeholder = "Foobartimes8!" #rpw [formControl]="mainForm.controls['pwchange']">
 </div>
  <!-- pwconfirmation -->
 <div class="field" [class.error]="!pwchangeconf.valid && pwchangeconf.touched">
 <label for="pwconf">Password:</label>
 <input name="pwconf" placeholder = "Foobartimes8!" #rrpw [formControl]="mainForm.controls['pwchangeconf']">
 </div>
 <button type="submit"
 class="ui positive center floated button" >
 Send
 </button>
 </form>
 <button id = "Reset" (click)="resetpage()">Reset</button>
 </template>

 <!-- Request Password Template -->
 <template #request>
 <form class="ui large form segment" [formGroup]="mainForm" (ngSubmit) ="resetpage()"  accept-charset="ISO-8859-1">
 <h3 class="ui header">Request Password</h3>
 <!-- email -->
 <div class="field"
 [class.error]="!email.valid && email.touched">
 <label for="email">Email:</label>
 <input name="email" placeholder = "foo" #uemail [formControl]="mainForm.controls['email']">
 </div>
 <button type="submit"
 class="ui positive center floated button" >
 Send
 </button>
 </form>
 <button id = "Reset" (click)="resetpage()">Reset</button>
 </template>


<!-- Home Screen Record Browse Admin -->
<template #home>
<button id = "Browse">Browse Video Library</button>
<button id = "Record" (click) = "startRecording()">Record</button>
<button id = "Reset" (click)="resetpage()">Logout</button>
</template>


<!-- login Screen -->
 <template #login>
 <div *ngIf="errorlogin" class="ui error message">Username and Password combination was incorrect.</div>
 <!--Testing functionality of locked Account.
 Designed to include a custom validation that builds a list of names that are locked for the user  -->
 <div *ngIf="!locked && hassubmitted" class="ui error message">This is attempt {{ count }} of 3 for {{ uname.value }}</div>
 <div *ngIf="locked  && hassubmitted" class="ui error message">Account has been locked.</div>
 <div *ngIf="name.hasError('invalidname') && hassubmitted"class="ui error message">name is invalid</div>
 <div *ngIf="name.hasError('required') && hassubmitted"
 class="ui error message">name is required</div>
 <div *ngIf="pw.hasError('invalidpw') && hassubmitted && !pw.hasError('required')"
class="ui error message">password is invalid.</div>
<div *ngIf="pw.hasError('required') && hassubmitted "
class="ui error message">password is required</div>

  <form class="ui large form segment" [formGroup]="mainForm" (ngSubmit) ="onSubmit(mainForm.value)" >
  <h3 class="ui header">Login</h3>
  <div class="field"
  [class.error]="!name.valid && name.touched && hassubmitted">
  <label for="name">Name:</label>
  <input name="name" placeholder = "foo" #uname [formControl]="mainForm.controls['name']">
   <!-- changed -->
  </div>
  <div class="field" [class.error]="!pw.valid && pw.touched && hassubmitted">
  <label for="pw">Password:</label>
  <input name="pw" placeholder = "Foobartimes8!" #upw [formControl]="mainForm.controls['pw']"> <!-- changed -->
  </div>
  <button  type="submit"
 class="ui positive center floated button" >
  Send
  </button>
  </form>
 <button id = "requestpw"(click) = "requestpw()"> Reset Password </button>
 <button id = "resetpw"(click) = "resetpw()"> Request an Account </button>
 </template>

 <template #record>
 <button (click) = "toHome()">Exit</button>
  <div id="main" align="center" >
  <div id="container">
    <h1>powered by fidiyo</h1>
    <video id="gum" autoplay muted hidden></video>
    <video id="recorded" autoplay loop hidden></video>
    <div>
      <button id="record" disabled>Start Recording</button>
      <button id="play" disabled>Review</button>
      <button id="download" disabled>Save file</button>
      <button id="send" disabled>Send file</button>
    </div>
  </div>
  </div>
<script src="js/main.js"></script>
 </template>
 `
 })
 export class view {
   @ViewChild('login') displayLogin: TemplateRef<any>;
   @ViewChild('home') displayHome: TemplateRef<any>;
   @ViewChild('reset') displayReset: TemplateRef<any>;
   @ViewChild('request') displayRequest: TemplateRef<any>;
   @ViewChild('login') displayPage: TemplateRef<any>;
   @ViewChild('record') displayRecord: TemplateRef<any>;
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
   count: number = 0;
   locked: boolean;
   hassubmitted: boolean = false;
   islog: boolean = false;
   response: any;

   constructor(fb: FormBuilder, public http: Http, public script: ScriptService) {
     this.loading = true;
     this.errorlogin = false;
     /**/
     this.locked = false;
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
      //PLUG:: says if user is logged in then (from islog) then redirect to home.


   }
   onSubmit(form: any): void {

         if( !this.pw.valid || !this.name.valid) {
           this.errorlogin = true;
           console.log(this.pw.valid + ", " + this.name.valid)
           //this is here for testing. delete if not testing. or have alternative
           this.count += 1;
           console.log("account" + this.locked  + ", attempt: " + this.count);
           if(this.count > 2){this.locked = true; console.log("account" + this.locked + ", attempt: " + this.count);}
           this.hassubmitted = true;
         }
         else { console.log('you submitted value:', form);  console.log("attempting to log in"); console.log("Name, value pair: " + this.name.value + ", " + this.pw.value);
         //PLUG:: islog: boolean, if true user is logged in. count is a count of failed user attempts for same username. locked is if account username is locked.
         let headers = new Headers({ 'Content-Type': 'application/json'});
         let options = new RequestOptions({ headers: headers});
         this.http.post('server/confirmlogin_infoand_changesessioninfo.php',JSON.stringify({
           user: this.name.value,
           pw: this.pw.value
         }), options).map((res:Response) => res.json())
          .subscribe(data => {
            this.islog = data.islog,
            this.locked = data.locked,
            //this.count = data.count,
            this.checkLogin(this.islog),
            this.display(),
            this.hassubmitted = true,
            console.log("user password that were submitted: " + data.user + ", " + data.pw + ", and returns islog: " + data.islog)
          }, err => {console.log(err);});
       }


}

checkLogin(data_islog: boolean): boolean {
  if(data_islog){
    this.status= "home";
    console.log("successful login");
    return true;
  }
  else {
      this.errorlogin = true;
      this.hassubmitted = true;
      //this is here for testing. delete if not testing. or have alternative
      this.count += 1;
      console.log("attempt: " + this.count);
        console.log("Username Password were not accepted.");
      if(this.count > 2){this.locked = true; console.log("account: " + this.locked  + ", attempt: " + this.count);}
      return false;
    }

}
   display() {
     if(this.status === "login"){console.log(this.status);
     this.displayPage = this.displayLogin;
   }
     else if (this.status === "home"){console.log(this.status);
       this.displayPage =  this.displayHome;
       this.hassubmitted = false;
     }
     else if (this.status === "reset"){console.log(this.status);
       this.displayPage =  this.displayReset;
     }
     else if (this.status === "request"){console.log(this.status);
       this.displayPage =  this.displayRequest;
     }
     else if (this.status === "record"){
       this.displayPage = this.displayRecord;
     }
   }
   resetpage() { //PLUG:: resets session information
     this.http.get('server/reset.php');
     this.status = "login";
     this.errorlogin = false;
     this.islog = false;
     this.display();
console.log(this.status);
console.log(this.displayPage);
   }
   requestpw(){
     this.status = "request";
     this.display();
     console.log(this.displayPage);

console.log(this.status);
   }
   resetpw(){
     this.status = "reset";
     this.display();
   }
   startRecording(){
     this.status = "record";
     this.display();
     this.script.load('mediarecorder', 'webrtcadapter').then(data => {
      console.log('script loaded ', data);
      }).catch(error => console.log(error));

    }
    toHome(){
      this.status = "home";
      this.display();
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
