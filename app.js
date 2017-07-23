System.register(['@angular/core', '@angular/platform-browser', "@angular/platform-browser-dynamic", '@angular/forms', '@angular/http', 'rxjs/add/operator/map'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, platform_browser_1, platform_browser_dynamic_1, forms_1, http_1, core_2;
    var ScriptStore, ScriptService, loginInfo, userInfo, view, ViewAppModule;
    function nameValidator(control) {
        if (!control.value.match(/.?/)) {
            return { invalidname: true };
        }
    }
    function pwValidator(control) {
        if (!control.value.match(/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\#$%&/=?_.,:;\\-])).{8,}/)) {
            return { invalidpw: true };
        }
    }
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            exports_1("ScriptStore", ScriptStore = [
                { name: 'webrtcadapter', src: 'https://webrtc.github.io/adapter/adapter-latest.js' },
                { name: 'mediarecorder', src: 'js/main.js' }
            ]);
            ScriptService = (function () {
                function ScriptService() {
                    var _this = this;
                    this.scripts = {};
                    ScriptStore.forEach(function (script) {
                        _this.scripts[script.name] = {
                            loaded: false,
                            src: script.src
                        };
                    });
                }
                ScriptService.prototype.load = function () {
                    var _this = this;
                    var scripts = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        scripts[_i - 0] = arguments[_i];
                    }
                    var promises = [];
                    scripts.forEach(function (script) { return promises.push(_this.loadScript(script)); });
                    return Promise.all(promises);
                };
                ScriptService.prototype.loadScript = function (name) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        //resolve if already loaded
                        if (_this.scripts[name].loaded) {
                            resolve({ script: name, loaded: true, status: 'Already Loaded' });
                        }
                        else {
                            //load script
                            var script_1 = document.createElement('script');
                            script_1.type = 'text/javascript';
                            script_1.src = _this.scripts[name].src;
                            if (script_1.readyState) {
                                script_1.onreadystatechange = function () {
                                    if (script_1.readyState === "loaded" || script_1.readyState === "complete") {
                                        script_1.onreadystatechange = null;
                                        _this.scripts[name].loaded = true;
                                        resolve({ script: name, loaded: true, status: 'Loaded' });
                                    }
                                };
                            }
                            else {
                                script_1.onload = function () {
                                    _this.scripts[name].loaded = true;
                                    resolve({ script: name, loaded: true, status: 'Loaded' });
                                };
                            }
                            script_1.onerror = function (error) { return resolve({ script: name, loaded: false, status: 'Loaded' }); };
                            document.getElementsByTagName('head')[0].appendChild(script_1);
                        }
                    });
                };
                ScriptService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ScriptService);
                return ScriptService;
            }());
            exports_1("ScriptService", ScriptService);
            loginInfo = (function () {
                function loginInfo(name, pw) {
                    this.pw = pw;
                    this.name = name;
                }
                return loginInfo;
            }());
            exports_1("loginInfo", loginInfo);
            userInfo = (function () {
                function userInfo(name, pw) {
                    this.pw = pw;
                    this.name = name;
                }
                return userInfo;
            }());
            exports_1("userInfo", userInfo);
            view = (function () {
                function view(fb, http, script) {
                    this.http = http;
                    this.script = script;
                    this.count = 0;
                    this.hassubmitted = false;
                    this.islog = false;
                    this.loading = true;
                    this.errorlogin = false;
                    /**/
                    this.locked = false;
                    this.status = "login";
                    this.mainForm = fb.group({
                        'pw': ['', forms_1.Validators.compose([forms_1.Validators.required, pwValidator])],
                        'name': ['', forms_1.Validators.compose([forms_1.Validators.required, nameValidator])],
                        'email': ['', forms_1.Validators.compose([forms_1.Validators.required, nameValidator])],
                        'pwchange': ['', forms_1.Validators.compose([forms_1.Validators.required, pwValidator])],
                        'pwchangeconf': ['', forms_1.Validators.compose([forms_1.Validators.required, pwValidator])],
                        'userforchange': ['', forms_1.Validators.compose([forms_1.Validators.required, nameValidator])]
                    });
                    this.pw = this.mainForm.controls['pw'];
                    this.name = this.mainForm.controls['name'];
                    this.email = this.mainForm.controls['email'];
                    this.userforchange = this.mainForm.controls['userforchange'];
                    this.pwchange = this.mainForm.controls['pwchange'];
                    this.pwchangeconf = this.mainForm.controls['pwchangeconf'];
                    //PLUG:: says if user is logged in then (from islog) then redirect to home.
                }
                view.prototype.onSubmit = function (form) {
                    var _this = this;
                    if (!this.pw.valid || !this.name.valid) {
                        this.errorlogin = true;
                        console.log(this.pw.valid + ", " + this.name.valid);
                        //this is here for testing. delete if not testing. or have alternative
                        this.count += 1;
                        console.log("account" + this.locked + ", attempt: " + this.count);
                        if (this.count > 2) {
                            this.locked = true;
                            console.log("account" + this.locked + ", attempt: " + this.count);
                        }
                        this.hassubmitted = true;
                    }
                    else {
                        console.log('you submitted value:', form);
                        console.log("attempting to log in");
                        console.log("Name, value pair: " + this.name.value + ", " + this.pw.value);
                        //PLUG:: islog: boolean, if true user is logged in. count is a count of failed user attempts for same username. locked is if account username is locked.
                        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                        var options = new http_1.RequestOptions({ headers: headers });
                        this.http.post('server/confirmlogin_infoand_changesessioninfo.php', JSON.stringify({
                            user: this.name.value,
                            pw: this.pw.value
                        }), options).map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            _this.islog = data.islog,
                                _this.locked = data.locked,
                                //this.count = data.count,
                                _this.checkLogin(_this.islog),
                                _this.display(),
                                _this.hassubmitted = true,
                                console.log("user password that were submitted: " + data.user + ", " + data.pw + ", and returns islog: " + data.islog);
                        }, function (err) { console.log(err); });
                    }
                };
                view.prototype.checkLogin = function (data_islog) {
                    if (data_islog) {
                        this.status = "home";
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
                        if (this.count > 2) {
                            this.locked = true;
                            console.log("account: " + this.locked + ", attempt: " + this.count);
                        }
                        return false;
                    }
                };
                view.prototype.display = function () {
                    if (this.status === "login") {
                        console.log(this.status);
                        this.displayPage = this.displayLogin;
                    }
                    else if (this.status === "home") {
                        console.log(this.status);
                        this.displayPage = this.displayHome;
                        this.hassubmitted = false;
                    }
                    else if (this.status === "reset") {
                        console.log(this.status);
                        this.displayPage = this.displayReset;
                    }
                    else if (this.status === "request") {
                        console.log(this.status);
                        this.displayPage = this.displayRequest;
                    }
                    else if (this.status === "record") {
                        this.displayPage = this.displayRecord;
                    }
                };
                view.prototype.resetpage = function () {
                    this.http.get('server/reset.php');
                    this.status = "login";
                    this.errorlogin = false;
                    this.islog = false;
                    this.display();
                    console.log(this.status);
                    console.log(this.displayPage);
                };
                view.prototype.requestpw = function () {
                    this.status = "request";
                    this.display();
                    console.log(this.displayPage);
                    console.log(this.status);
                };
                view.prototype.resetpw = function () {
                    this.status = "reset";
                    this.display();
                };
                view.prototype.startRecording = function () {
                    this.status = "record";
                    this.display();
                    this.script.load('mediarecorder', 'webrtcadapter').then(function (data) {
                        console.log('script loaded ', data);
                    }).catch(function (error) { return console.log(error); });
                };
                view.prototype.toHome = function () {
                    this.status = "home";
                    this.display();
                };
                __decorate([
                    core_1.ViewChild('login'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayLogin", void 0);
                __decorate([
                    core_1.ViewChild('home'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayHome", void 0);
                __decorate([
                    core_1.ViewChild('reset'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayReset", void 0);
                __decorate([
                    core_1.ViewChild('request'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayRequest", void 0);
                __decorate([
                    core_1.ViewChild('login'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayPage", void 0);
                __decorate([
                    core_1.ViewChild('record'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayRecord", void 0);
                view = __decorate([
                    core_1.Component({
                        providers: [ScriptService],
                        selector: 'view',
                        template: "\n <!-- Switch Template -->\n <template [ngTemplateOutlet] = \"displayPage\"> </template>\n <!-- Change Password Template -->\n <template #reset>\n <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"resetpage()\" >\n <h3 class=\"ui header\">Change Password</h3>\n  <!-- name -->\n <div class=\"field\"\n [class.error]=\"!userforchange.valid && userforchange.touched\">\n <label for=\"name\">Name:</label>\n <input name=\"name\" placeholder = \"foo\" #rname [formControl]=\"mainForm.controls['userforchange']\">\n  <!-- pw -->\n </div>\n <div class=\"field\" [class.error]=\"!pwchange.valid && pwchange.touched\">\n <label for=\"pw\">Password:</label>\n <input name=\"pw\" placeholder = \"Foobartimes8!\" #rpw [formControl]=\"mainForm.controls['pwchange']\">\n </div>\n  <!-- pwconfirmation -->\n <div class=\"field\" [class.error]=\"!pwchangeconf.valid && pwchangeconf.touched\">\n <label for=\"pwconf\">Password:</label>\n <input name=\"pwconf\" placeholder = \"Foobartimes8!\" #rrpw [formControl]=\"mainForm.controls['pwchangeconf']\">\n </div>\n <button type=\"submit\"\n class=\"ui positive center floated button\" >\n Send\n </button>\n </form>\n <button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n </template>\n\n <!-- Request Password Template -->\n <template #request>\n <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"resetpage()\"  accept-charset=\"ISO-8859-1\">\n <h3 class=\"ui header\">Request Password</h3>\n <!-- email -->\n <div class=\"field\"\n [class.error]=\"!email.valid && email.touched\">\n <label for=\"email\">Email:</label>\n <input name=\"email\" placeholder = \"foo\" #uemail [formControl]=\"mainForm.controls['email']\">\n </div>\n <button type=\"submit\"\n class=\"ui positive center floated button\" >\n Send\n </button>\n </form>\n <button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n </template>\n\n\n<!-- Home Screen Record Browse Admin -->\n<template #home>\n<button id = \"Browse\">Browse Video Library</button>\n<button id = \"Record\" (click) = \"startRecording()\">Record</button>\n<button id = \"Reset\" (click)=\"resetpage()\">Logout</button>\n</template>\n\n\n<!-- login Screen -->\n <template #login>\n <div *ngIf=\"errorlogin\" class=\"ui error message\">Username and Password combination was incorrect.</div>\n <!--Testing functionality of locked Account.\n Designed to include a custom validation that builds a list of names that are locked for the user  -->\n <div *ngIf=\"!locked && hassubmitted\" class=\"ui error message\">This is attempt {{ count }} of 3 for {{ uname.value }}</div>\n <div *ngIf=\"locked  && hassubmitted\" class=\"ui error message\">Account has been locked.</div>\n <div *ngIf=\"name.hasError('invalidname') && hassubmitted\"class=\"ui error message\">name is invalid</div>\n <div *ngIf=\"name.hasError('required') && hassubmitted\"\n class=\"ui error message\">name is required</div>\n <div *ngIf=\"pw.hasError('invalidpw') && hassubmitted && !pw.hasError('required')\"\nclass=\"ui error message\">password is invalid.</div>\n<div *ngIf=\"pw.hasError('required') && hassubmitted \"\nclass=\"ui error message\">password is required</div>\n\n  <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"onSubmit(mainForm.value)\" >\n  <h3 class=\"ui header\">Login</h3>\n  <div class=\"field\"\n  [class.error]=\"!name.valid && name.touched && hassubmitted\">\n  <label for=\"name\">Name:</label>\n  <input name=\"name\" placeholder = \"foo\" #uname [formControl]=\"mainForm.controls['name']\">\n   <!-- changed -->\n  </div>\n  <div class=\"field\" [class.error]=\"!pw.valid && pw.touched && hassubmitted\">\n  <label for=\"pw\">Password:</label>\n  <input name=\"pw\" placeholder = \"Foobartimes8!\" #upw [formControl]=\"mainForm.controls['pw']\"> <!-- changed -->\n  </div>\n  <button  type=\"submit\"\n class=\"ui positive center floated button\" >\n  Send\n  </button>\n  </form>\n <button id = \"requestpw\"(click) = \"requestpw()\"> Reset Password </button>\n <button id = \"resetpw\"(click) = \"resetpw()\"> Request an Account </button>\n </template>\n\n <template #record>\n <button (click) = \"toHome()\">Exit</button>\n  <div id=\"main\" align=\"center\" >\n  <div id=\"container\">\n    <h1>powered by fidiyo</h1>\n    <video id=\"gum\" autoplay muted hidden></video>\n    <video id=\"recorded\" autoplay loop hidden></video>\n    <div>\n      <button id=\"record\" disabled>Start Recording</button>\n      <button id=\"play\" disabled>Review</button>\n      <button id=\"download\" disabled>Save file</button>\n      <button id=\"send\" disabled>Send file</button>\n    </div>\n  </div>\n  </div>\n<script src=\"js/main.js\"></script>\n </template>\n "
                    }), 
                    __metadata('design:paramtypes', [forms_1.FormBuilder, http_1.Http, ScriptService])
                ], view);
                return view;
            }());
            exports_1("view", view);
            ViewAppModule = (function () {
                function ViewAppModule() {
                }
                ViewAppModule = __decorate([
                    core_1.NgModule({
                        declarations: [view,
                        ],
                        imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, http_1.HttpModule],
                        bootstrap: [view,],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ViewAppModule);
                return ViewAppModule;
            }());
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ViewAppModule);
        }
    }
});
//# sourceMappingURL=app.js.map