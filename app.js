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
    function emailValidator(control) {
        if (!control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return { invalidemail: true };
        }
    }
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
            ScriptStore = [
                { name: 'webrtcadapter', src: 'https://webrtc.github.io/adapter/adapter-latest.js' },
                { name: 'mediarecorder', src: 'js/main.js' }
            ];
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
                function view(fb, http, script, vcRef) {
                    this.http = http;
                    this.script = script;
                    this.vcRef = vcRef;
                    this.count = 0;
                    this.hassubmitted = false;
                    this.islog = false;
                    this.videos = [];
                    this.videostoSend = [];
                    this.loading = true;
                    this.errorlogin = false;
                    this.locked = false;
                    this.mainForm = fb.group({
                        'pw': ['', forms_1.Validators.compose([forms_1.Validators.required, pwValidator])],
                        'name': ['', forms_1.Validators.compose([forms_1.Validators.required, nameValidator])],
                        'email': ['', forms_1.Validators.compose([forms_1.Validators.required, emailValidator])],
                        'newemail': ['', forms_1.Validators.compose([forms_1.Validators.required, emailValidator])],
                        'newpw': ['', forms_1.Validators.compose([forms_1.Validators.required, pwValidator])],
                        'newpwconf': ['', forms_1.Validators.compose([forms_1.Validators.required, pwValidator])],
                        'newuser': ['', forms_1.Validators.compose([forms_1.Validators.required, nameValidator])]
                    });
                    this.pw = this.mainForm.controls['pw'];
                    this.name = this.mainForm.controls['name'];
                    this.email = this.mainForm.controls['email'];
                    this.newemail = this.mainForm.controls['newemail'];
                    this.newuser = this.mainForm.controls['newuser'];
                    this.newpw = this.mainForm.controls['newpw'];
                    this.newpwconf = this.mainForm.controls['newpwconf'];
                }
                view.prototype.ngOnInit = function () {
                    console.log("ngoninit is called.");
                    this.checkLogin();
                };
                view.prototype.sendVideos = function () {
                    var _this = this;
                    this.videos.forEach(function (video) {
                        if (video.isSelect) {
                            console.log(video);
                            _this.videostoSend.push(video);
                        }
                    });
                    //httprequest with json, that sends the video_toSend array of videos to a dynamic page that can handle the information and
                    alert(this.videostoSend[0].path);
                };
                view.prototype.addordelete = function (video) {
                    //console.log(video);
                    video.isSelect = !video.isSelect;
                    //   console.log(video);
                    video.isSelect ? video.color = "yellow" : video.color = "";
                    //   console.log(video);
                };
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
                        this.connection = this.http.post('server/confirmlogin_infoand_changesessioninfo.php', JSON.stringify({
                            user: this.name.value,
                            pw: this.pw.value
                        }), options).map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            _this.islog = data.islog,
                                _this.locked = data.locked,
                                //this.count = data.count,
                                _this.returnLogin(_this.islog),
                                _this.display(),
                                console.log("user password that were submitted: " + data.user + ", " + data.pw + ", and returns islog: " + data.islog);
                        }, function (err) { console.log(err); });
                    }
                };
                view.prototype.browseLibrary = function () {
                    var _this = this;
                    this.vcRef.clear();
                    this.vcRef.createEmbeddedView(this.displayLibrary);
                    this.http.request('server/videolibrary.json').subscribe(function (res) { _this.videos = res.json().videos; });
                };
                view.prototype.checkLogin = function () {
                    var _this = this;
                    this.vcRef.clear();
                    this.http.get('server/register_session_permissions.php').map(function (res) { return res.json(); }).subscribe(function (data) {
                        _this.islog = data.islog, console.log(_this.islog),
                            _this.islog ? _this.vcRef.createEmbeddedView(_this.displayHome) : _this.vcRef.createEmbeddedView(_this.displayLogin);
                    }, function (err) { console.log(err); });
                };
                view.prototype.returnLogin = function (data_islog) {
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
                    if (this.status === "login" && !this.islog) {
                        console.log(this.status);
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayLogin);
                    }
                    else if (this.status === "home" && this.islog) {
                        console.log(this.status);
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayHome);
                        this.hassubmitted = false;
                    }
                    else if (this.status === "newaccount" && !this.islog) {
                        console.log(this.status);
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayReset);
                    }
                    else if (this.status === "request" && !this.islog) {
                        console.log(this.status);
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayRequest);
                    }
                    else if (this.status === "record" && this.islog) {
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayRecord);
                    }
                    else if (this.status === "library" && this.islog) {
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayLibrary);
                    }
                };
                view.prototype.resetpage = function (form) {
                    var _this = this;
                    console.log('logging out');
                    this.http.get('server/reset.php').map(function (res) { return res.text(); }).subscribe(function (data) {
                        console.log(data),
                            _this.checkLogin(),
                            _this.islog ? _this.status = "home" : _this.status = "login",
                            _this.errorlogin = false,
                            _this.islog = false,
                            _this.count = 0,
                            _this.hassubmitted = false;
                        console.log(_this.status),
                            console.log(_this.displayLogin);
                    });
                };
                view.prototype.requestpw = function () {
                    this.status = "request";
                    this.display();
                };
                view.prototype.resetpw = function () {
                    this.status = "newaccount";
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
                    core_1.ViewChild('newaccount'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayReset", void 0);
                __decorate([
                    core_1.ViewChild('request'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayRequest", void 0);
                __decorate([
                    core_1.ViewChild('record'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayRecord", void 0);
                __decorate([
                    core_1.ViewChild('library'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], view.prototype, "displayLibrary", void 0);
                view = __decorate([
                    core_1.Component({
                        providers: [ScriptService],
                        selector: 'view',
                        template: "\n <!-- Switch Template -->\n\n <!-- Change Password Template -->\n <template #newaccount>\n <div *ngIf=\"newemail.hasError('invalidemail')\">requested email is invalid</div>\n <div *ngIf=\"newuser.hasError('required')\"\n >name is required</div>\n <div *ngIf=\"newpw.hasError('invalidpw') && !newpw.hasError('required')\" >password is invalid.</div>\n <div *ngIf=\"newpw.hasError('required')\">password is required</div>\n<div *ngIf=\"(newpw.value !== newpwconf.value)\" >passwords do not match</div>\n\n\n <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"resetpage()\" >\n <h3 >Request Account</h3>\n  <!-- name -->\n\n <div class=\"field\">\n <label for=\"name\">Name:</label>\n <input name=\"name\" placeholder = \"foo\" #rname [formControl]=\"mainForm.controls['newuser']\">\n </div>\n\n  <!-- email -->\n  <div class=\"field\">\n  <label for=\"email\">Email:</label>\n  <input name=\"email\" placeholder = \"foo@foo.com\" #nemail [formControl]=\"mainForm.controls['newemail']\">\n  </div>\n\n   <!-- pw -->\n <div class=\"field\" >\n <label for=\"pw\">Password:</label>\n <input type=\"password\" name=\"pw\" #rpw [formControl]=\"mainForm.controls['newpw']\">\n </div>\n  <!-- pwconfirmation -->\n <div class=\"field\">\n <label for=\"pwconf\">Confirm Password:</label>\n <input type=\"password\" name=\"pwconf\" #rrpw [formControl]=\"mainForm.controls['newpwconf']\">\n </div>\n <button type=\"submit\" >\n Send\n </button>\n </form>\n <button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n </template>\n\n <!-- Request Password Template -->\n <template #request>\n <div *ngIf=\"email.hasError('invalidemail')\">name is invalid</div>\n<!-- request pw form -->\n <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"resetpage()\" >\n <h3 class=\"ui header\">Request Password</h3>\n <!-- email -->\n <div class=\"field\">\n <label for=\"email\">Email:</label>\n <input name=\"email\" placeholder = \"foo\" #uemail [formControl]=\"mainForm.controls['email']\">\n </div>\n <button type=\"submit\">\n Send\n </button>\n </form>\n <button id = \"Reset\" (click)=\"resetpage()\">Reset</button>\n </template>\n\n<template #library>\n<button (click)=\"toHome()\"> back </button>\n<table>\n  <tr *ngFor=\"let video of videos\"  >\n    <button (click)=\"addordelete(video)\" [style.background-color] = \"video.color\" ><td >Video: {{ video.url }}</td> <td> {{ video.path }} </td> <td> {{video.time}}</td></button>\n  </tr>\n</table>\n<button (click)=\"sendVideos()\">send</button>\n</template>\n<!-- Home Screen Record Browse Admin -->\n<template #home>\n<button id = \"Browse\" (click) = \"browseLibrary()\">Browse Video Library</button>\n<button id = \"Record\" (click) = \"startRecording()\">Record</button>\n<button id = \"Reset\" (click)=\"resetpage(mainForm.value)\">Logout</button>\n</template>\n\n\n<!-- login Screen -->\n <template #login>\n <div *ngIf=\"errorlogin\" class=\"ui error message\">Username and Password combination was incorrect.</div>\n <!--Testing functionality of locked Account.\n Designed to include a custom validation that builds a list of names that are locked for the user  -->\n <div *ngIf=\"!locked && hassubmitted\" class=\"ui error message\">This is attempt {{ count }} of 3 for {{ uname.value }}</div>\n <div *ngIf=\"locked  && hassubmitted\" class=\"ui error message\">Account has been locked.</div>\n <div *ngIf=\"name.hasError('invalidname') && hassubmitted\"class=\"ui error message\">name is invalid</div>\n <div *ngIf=\"name.hasError('required') && hassubmitted\"\n class=\"ui error message\">name is required</div>\n <div *ngIf=\"pw.hasError('invalidpw') && hassubmitted && !pw.hasError('required')\"\nclass=\"ui error message\">password is invalid.</div>\n<div *ngIf=\"pw.hasError('required') && hassubmitted \"\nclass=\"ui error message\">password is required</div>\n\n  <form class=\"ui large form segment\" [formGroup]=\"mainForm\" (ngSubmit) =\"onSubmit(mainForm.value)\" >\n  <h3 class=\"ui header\">Login</h3>\n  <div class=\"field\"\n  [class.error]=\"!name.valid && name.touched && hassubmitted\">\n  <label for=\"name\">Name:</label>\n  <input name=\"name\" placeholder = \"foo\" #uname [formControl]=\"mainForm.controls['name']\">\n   <!-- changed -->\n  </div>\n  <div class=\"field\" [class.error]=\"!pw.valid && pw.touched && hassubmitted\">\n  <label for=\"pw\">Password:</label>\n  <input name=\"pw\" placeholder = \"Foobartimes8!\" #upw [formControl]=\"mainForm.controls['pw']\"> <!-- changed -->\n  </div>\n  <button  type=\"submit\" >\n  Send\n  </button>\n  </form>\n <button id = \"requestpw\"(click) = \"requestpw()\"> Reset Password </button>\n <button id = \"resetpw\"(click) = \"resetpw()\"> Request an Account </button>\n </template>\n\n <template #record>\n <button (click) = \"toHome()\">Exit</button>\n  <div id=\"main\" align=\"center\" >\n  <div id=\"container\">\n    <h1>powered by fidiyo</h1>\n    <video id=\"gum\" autoplay muted hidden></video>\n    <video id=\"recorded\" autoplay loop hidden></video>\n    <div>\n      <button id=\"record\" disabled>Start Recording</button>\n      <button id=\"play\" disabled>Review</button>\n      <button id=\"download\" disabled>Save file</button>\n      <button id=\"send\" disabled>Send file</button>\n    </div>\n  </div>\n  </div>\n<script src=\"js/main.js\"></script>\n </template>\n "
                    }), 
                    __metadata('design:paramtypes', [forms_1.FormBuilder, http_1.Http, ScriptService, core_1.ViewContainerRef])
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