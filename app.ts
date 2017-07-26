
import {
Component, NgModule,TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl }   from '@angular/forms';
import { Response, Http, HttpModule, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";

declare var document: any;


 interface Scripts {
   name: string;
   src: string;
}
 const ScriptStore: Scripts[] = [
   {name: 'webrtcadapter', src: 'https://webrtc.github.io/adapter/adapter-latest.js'},
   {name: 'mediarecorder', src: 'js/main.js'}
];

@Injectable()
 class ScriptService {

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
    var index = 0;
    var promises: any[] = [];
    scripts.forEach((script) => {index++,promises.push(this.loadScript(script,true,index))});
    return Promise.all(promises);
}

loadScript(name: string, attempt: boolean, index: number) {

    return new Promise((resolve, reject) => {
        //resolve if already loaded
        if (this.scripts[name].loaded) {
            resolve({script: name, loaded: true, status: 'Already Loaded'});
            var scriptelement = document.getElementById('mainjs'+index);
            scriptelement.parentNode.removeChild(scriptelement);
            console.log('script removed for ' + index);
            var attempt = false;
        }
            //load script
            console.log('adding script for ' + index);
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].src;
            script.id = "mainjs"+index;
            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true, status: 'Loaded'});
                        attempt = false;
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

    });
}

}

function emailValidator(control: FormControl): { [s: string]: boolean}{
  if(!control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    return {invalidemail:true};
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

 <!-- Change Password Template -->
 <template #newaccount>
 <div *ngIf="newemail.hasError('invalidemail')">requested email is invalid</div>
 <div *ngIf="newuser.hasError('required')"
 >name is required</div>
 <div *ngIf="newpw.hasError('invalidpw') && !newpw.hasError('required')" >password is invalid.</div>
 <div *ngIf="newpw.hasError('required')">password is required</div>
<div *ngIf="(newpw.value !== newpwconf.value)" >passwords do not match</div>


 <form class="ui large form segment" [formGroup]="mainForm" (ngSubmit) ="resetpage()" >
 <h3 >Request Account</h3>
  <!-- name -->

 <div class="field">
 <label for="name">Name:</label>
 <input name="name" placeholder = "foo" #rname [formControl]="mainForm.controls['newuser']">
 </div>

  <!-- email -->
  <div class="field">
  <label for="email">Email:</label>
  <input name="email" placeholder = "foo@foo.com" #nemail [formControl]="mainForm.controls['newemail']">
  </div>

   <!-- pw -->
 <div class="field" >
 <label for="pw">Password:</label>
 <input type="password" name="pw" #rpw [formControl]="mainForm.controls['newpw']">
 </div>
  <!-- pwconfirmation -->
 <div class="field">
 <label for="pwconf">Confirm Password:</label>
 <input type="password" name="pwconf" #rrpw [formControl]="mainForm.controls['newpwconf']">
 </div>
 <button type="submit" >
 Send
 </button>
 </form>
 <button id = "Reset" (click)="resetpage()">Reset</button>
 </template>

 <!-- Request Password Template -->
 <template #request>
 <div *ngIf="email.hasError('invalidemail')">name is invalid</div>
<!-- request pw form -->
 <form class="ui large form segment" [formGroup]="mainForm" (ngSubmit) ="resetpage()" >
 <h3 class="ui header">Request Password</h3>
 <!-- email -->
 <div class="field">
 <label for="email">Email:</label>
 <input name="email" placeholder = "foo" #uemail [formControl]="mainForm.controls['email']">
 </div>
 <button type="submit">
 Send
 </button>
 </form>
 <button id = "Reset" (click)="resetpage()">Reset</button>
 </template>

<template #library>
<button (click)="toHome()"> back </button>
<table>
  <tr *ngFor="let video of videos"  >
    <button (click)="addordelete(video)" [style.background-color] = "video.color" ><td >Video: {{ video.url }}</td> <td> {{ video.path }} </td> <td> {{video.time}}</td></button>
  </tr>
</table>
<button (click)="sendVideos()">send</button>
</template>
<!-- Home Screen Record Browse Admin -->
<template #home>
<button id = "Browse" (click) = "browseLibrary()">Browse Video Library</button>
<button id = "Record" (click) = "startRecording()">Record</button>
<button id = "Reset" (click)="resetpage(mainForm.value)">Logout</button>
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
  <button  type="submit" >
  Send
  </button>
  </form>
 <button id = "requestpw"(click) = "requestpw()"> Reset Password </button>
 <button id = "resetpw"(click) = "resetpw()"> Request an Account </button>
 </template>

 <template #record>
 <div id = "dashboard" *ngIf = 'refresh_switch'>
 <button id='exit' (click)="toHome()" >Exit</button>
  <div id='main' align='center' >
  <div id='container'>
    <h1>powered by fidiyo</h1>
    <video muted id='gum' autoplay hidden></video>
    <video  id='recorded' autoplay loop hidden></video>
    <canvas id='canvas' style='display:none;'></canvas>
    <img id = 'captured' src =''>
    <div>
      <button id='record' disabled>Start Recording</button>
      <button id='capture' disabled>Take a Picture</button>
      <button id='play' disabled>Review</button>
      <button id='download' disabled>Save file</button>
      <button id='saveimg' disabled>Save Image</button>
      <button id='send' disabled>Send file</button>
    </div>
  </div>
  </div>
  </div>
 </template>
 `
 })
 export class view {
   @ViewChild('login') displayLogin: TemplateRef<any>;
   @ViewChild('home') displayHome: TemplateRef<any>;
   @ViewChild('newaccount') displayReset: TemplateRef<any>;
   @ViewChild('request') displayRequest: TemplateRef<any>;
   @ViewChild('record') displayRecord: TemplateRef<any>;
   @ViewChild('library') displayLibrary: TemplateRef<any>;
   mainForm: FormGroup;
   requestForm: FormGroup;
   resetForm: FormGroup;
   pw: AbstractControl;
   name: AbstractControl;
   email: AbstractControl;
   newemail: AbstractControl;
   newuser: AbstractControl;
   newpw: AbstractControl;
   newpwconf: AbstractControl;
   loading: boolean;
   logjson: Object;
   status: string;
   errorlogin: boolean;
   count: number = 0;
   locked: boolean;
   hassubmitted: boolean = false;
   islog: boolean = false;
   response: any;
   connection: any;
   stringResponse: string;
   videos: Array<any>;
   videostoSend: Array<any>;
   refresh_switch: boolean;
   constructor(fb: FormBuilder, public http: Http, public script: ScriptService, private vcRef: ViewContainerRef) {
     this.refresh_switch = true;
     this.videos = [];
     this.videostoSend = [];
     this.loading = true;
     this.errorlogin = false;
     this.locked = false;
      this.mainForm = fb.group({
        'pw': ['', Validators.compose([Validators.required, pwValidator])],
        'name': ['', Validators.compose([Validators.required, nameValidator])],
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'newemail': ['', Validators.compose([Validators.required, emailValidator])],
          'newpw': ['', Validators.compose([Validators.required, pwValidator])],
          'newpwconf': ['', Validators.compose([Validators.required, pwValidator])],
          'newuser': ['', Validators.compose([Validators.required, nameValidator])]
        });
      this.pw = this.mainForm.controls['pw'];
      this.name = this.mainForm.controls['name'];
      this.email = this.mainForm.controls['email'];
      this.newemail = this.mainForm.controls['newemail'];
      this.newuser = this.mainForm.controls['newuser'];
      this.newpw = this.mainForm.controls['newpw'];
      this.newpwconf = this.mainForm.controls['newpwconf'];
   }
   ngOnInit(){
     console.log("ngoninit is called.");
     this.checkLogin();
   }
   sendVideos(){
     this.videos.forEach(video => {
       if(video.isSelect){console.log(video);  this.videostoSend.push(video);}

     });
     //httprequest with json, that sends the video_toSend array of videos to a dynamic page that can handle the information and
     alert(this.videostoSend[0].path);
   }
   addordelete(video: any){

     //console.log(video);
     video.isSelect = !video.isSelect;
    //   console.log(video);
     video.isSelect? video.color = "yellow": video.color = ""
    //   console.log(video);
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
         this.connection = this.http.post('server/confirmlogin_infoand_changesessioninfo.php',JSON.stringify({
           user: this.name.value,
           pw: this.pw.value
         }), options).map((res:Response) => res.json())
          .subscribe(data => {
            this.islog = data.islog,
            this.locked = data.locked,
            //this.count = data.count,
            this.returnLogin(this.islog),
            this.display(),
            console.log("user password that were submitted: " + data.user + ", " + data.pw + ", and returns islog: " + data.islog)
          }, err => {console.log(err);});
       }
}
browseLibrary(){
  this.vcRef.clear();
  this.vcRef.createEmbeddedView(this.displayLibrary);
  this.http.request('server/videolibrary.json').subscribe((res: Response) => {this.videos = res.json().videos});
}
checkLogin() {
  this.vcRef.clear();
  this.http.get('server/register_session_permissions.php').map((res:Response) => res.json()).subscribe(data =>
  {this.islog = data.islog, console.log(this.islog),
  this.islog?     this.vcRef.createEmbeddedView(this.displayHome): this.vcRef.createEmbeddedView(this.displayLogin)}, err => {console.log(err);});
}
returnLogin(data_islog: boolean): boolean {
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
     if(this.status === "login" &&  !this.islog){console.log(this.status);
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.displayLogin);
   }
     else if (this.status === "home" && this.islog){console.log(this.status);
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayHome);
       this.hassubmitted = false;
     }
     else if (this.status === "newaccount" && !this.islog){console.log(this.status);
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayReset);
     }
     else if (this.status === "request" && !this.islog){console.log(this.status);
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayRequest);
     }
     else if (this.status === "record" && this.islog){
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayRecord);
       this.refresh_switch = false;
       console.log(this.refresh_switch);
       this.refresh_switch = true;
       console.log(this.refresh_switch);
     }
     else if (this.status === "library" && this.islog ){
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayLibrary);
     }
   }
   resetpage(form: any) { //PLUG:: resets session information
     console.log('logging out');
     this.http.get('server/reset.php').map((res: Response) => res.text()).subscribe(data => {
       console.log(data),
       this.checkLogin(),
       this.islog? this.status = "home": this.status = "login",
       this.errorlogin = false,
       this.islog = false,
       this.count = 0,
       this.hassubmitted = false
       console.log(this.status),
       console.log(this.displayLogin)
     });
   }
   requestpw(){
     this.status = "request";
     this.display();
   }
   resetpw(){
     this.status = "newaccount";
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
