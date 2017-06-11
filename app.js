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
    var core_1, platform_browser_1, platform_browser_dynamic_1, forms_1, http_1;
    var loginInfo, userInfo, view, ViewAppModule;
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
                function view(fb, http) {
                    var _this = this;
                    this.http = http;
                    this.hassubmitted = false;
                    this.count = 0;
                    this.loading = true;
                    this.errorlogin = false;
                    /**/
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
                    this.http.get('register_session_permissions.php')
                        .map(function (res) { return res.json(); })
                        .subscribe(function (data) { if (data.islog) {
                        _this.status = "home";
                    } });
                }
                view.prototype.onSubmit = function (form) {
                    var _this = this;
                    this.hassubmitted = true;
                    if (!this.pw.valid || !this.name.valid) {
                        this.errorlogin = true;
                        //this is here for testing. delete if not testing.
                        this.count += 1;
                        if (this.count > 2) {
                            this.locked = true;
                            console.log("account" + this.locked);
                        }
                    }
                    else {
                        console.log('you submitted value:', form);
                        console.log("attempting to log in");
                        //PLUG:: islog: boolean, if true user is logged in. count is a count of failed user attempts for same username. locked is if account username is locked.
                        this.http.post('server/confirmlogin_infoand_changesessioninfo.php', new loginInfo(this.name.value, this.pw.value))
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) { _this.status = data.islog, _this.locked = data.locked, _this.count = data.count; }, function (err) { console.log(err); });
                        this.hassubmitted = false;
                        this.status = "home";
                        this.display();
                        if (this.status && !this.locked) {
                            console.log("successful login");
                        }
                        else {
                            this.errorlogin = true;
                            //testing:
                            this.count += 1;
                        }
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
                    }
                    else if (this.status === "reset") {
                        console.log(this.status);
                        this.displayPage = this.displayReset;
                    }
                    else if (this.status === "request") {
                        console.log(this.status);
                        this.displayPage = this.displayRequest;
                    }
                };
                view.prototype.resetpage = function () {
                    this.http.get('reset.php');
                    this.status = "login";
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
                view = __decorate([
                    core_1.Component({
                        selector: 'view',
                        template: "\n\n<!-- Switch Template -->\n <template [ngTemplateOutlet] = \"displayPage\"> </template>\n <!-- Change Password Template -->\n <template #reset>\n <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"resetpage()\" >\n <h3 class=\"ui header\">Change Password</h3>\n  <!-- name -->\n <div class=\"field\"\n [class.error]=\"!userforchange.valid && userforchange.touched\">\n <label for=\"name\">Name:</label>\n <input name=\"name\" placeholder = \"foo\" #rname [formControl]=\"mainForm.controls['userforchange']\">\n  <!-- pw -->\n </div>\n <div class=\"field\" [class.error]=\"!pwchange.valid && pwchange.touched\">\n <label for=\"pw\">Password:</label>\n <input name=\"pw\" placeholder = \"Foobartimes8!\" #rpw [formControl]=\"mainForm.controls['pwchange']\">\n </div>\n  <!-- pwconfirmation -->\n <div class=\"field\" [class.error]=\"!pwchangeconf.valid && pwchangeconf.touched\">\n <label for=\"pwconf\">Password:</label>\n <input name=\"pwconf\" placeholder = \"Foobartimes8!\" #rrpw [formControl]=\"mainForm.controls['pwchangeconf']\">\n </div>\n <button type=\"submit\"\n class=\"ui positive center floated button\" >\n Send\n </button>\n </form>\n <button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n </template>\n\n <!-- Request Password Template -->\n <template #request>\n <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"resetpage()\" >\n <h3 class=\"ui header\">Request Password</h3>\n <!-- email -->\n <div class=\"field\"\n [class.error]=\"!email.valid && email.touched\">\n <label for=\"email\">Email:</label>\n <input name=\"email\" placeholder = \"foo\" #uemail [formControl]=\"mainForm.controls['email']\">\n </div>\n <button type=\"submit\"\n class=\"ui positive center floated button\" >\n Send\n </button>\n </form>\n <button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n </template>\n\n\n<!-- Home Screen Record Browse Admin -->\n<template #home>\n<button id = \"Record\">Record</button>\n<button id = \"Browse\">Browse</button>\n<button id = \"Admin\">Admin</button>\n<button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n</template>\n\n\n<!-- login Screen -->\n <template #login>\n <div *ngIf=\"errorlogin\"\n class=\"ui error message\">Username and Password combination was incorrect.\n\n <!--Testing functionality of locked Account.\n Designed to include a custom validation that builds a list of names that are locked for the user  -->\n <div *ngIf=\"!locked && !name.hasError('required') && hassubmitted\">This is attempt {{ count + 1 }} of 3 for {{uname.value}}</div>\n <div *ngIf=\"locked && !name.hasError('required') && hassubmitted\">Account has been locked.</div></div>\n <div *ngIf=\"name.hasError('invalidname') && hassubmitted\"\n class=\"ui error message\">name is invalid</div>\n <div *ngIf=\"name.hasError('required') && hassubmitted\"\n class=\"ui error message\">name is required</div>\n <div *ngIf=\"pw.hasError('invalidpw') && hassubmitted && !pw.hasError('required')\"\nclass=\"ui error message\">password is invalid.</div>\n<div *ngIf=\"pw.hasError('required') && hassubmitted \"\nclass=\"ui error message\">password is required</div>\n\n  <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"onSubmit(mainForm.value)\" >\n  <h3 class=\"ui header\">Login</h3>\n  <div class=\"field\"\n  [class.error]=\"!name.valid && name.touched && hassubmitted\">\n  <label for=\"name\">Name:</label>\n  <input name=\"name\" placeholder = \"foo\" #uname [formControl]=\"mainForm.controls['name']\">\n   <!-- changed -->\n  </div>\n  <div class=\"field\" [class.error]=\"!pw.valid && pw.touched && hassubmitted\">\n  <label for=\"pw\">Password:</label>\n  <input name=\"pw\" placeholder = \"Foobartimes8!\" #upw [formControl]=\"mainForm.controls['pw']\"> <!-- changed -->\n  </div>\n  <button  type=\"submit\"\n class=\"ui positive center floated button\" >\n  Send\n  </button>\n  </form>\n\n<button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n <button id = \"requestpw\"(click) = \"requestpw()\"> Request Password </button>\n <button id = \"resetpw\"(click) = \"resetpw()\"> Reset Password </button>\n </template>\n "
                    }), 
                    __metadata('design:paramtypes', [forms_1.FormBuilder, http_1.Http])
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