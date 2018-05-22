import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {App, NavController, Platform, LoadingController, Loading, AlertController, Alert} from "ionic-angular/es2015";
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Constants} from "../../../both/Constants";
import {TranslateService} from "@ngx-translate/core";
import {LandingPage} from "./pages/landing/landing";
import {LoginPage} from "./pages/account/login/login";
import {HomePage} from "./pages/home/home";
import {AboutPage} from "./pages/about/about";
import {AccountMenuPage} from "./pages/account/account-menu/account-menu";
import {Device} from "@ionic-native/device";
import {RequestHelper} from "./utils/RequestHelper";
import {DeviceReady} from "./utils/DeviceReady";

declare var navigator;
declare var window;

@Component({
    selector: "ion-app",
    templateUrl: "app.component.html"
})
export class AppComponent extends MeteorComponent implements OnInit {
    @ViewChild('leftMenu') leftMenu:any;
    @ViewChild('content') nav:any;

    // Set the root (or first) page
    public rootPage:any = LandingPage;
    public appName:string;
    public user:Meteor.User;
    public pages:Array<INavigationMenuPage>;
    public userPages:Array<INavigationMenuPage>;
    public noUserPages:Array<INavigationMenuPage>;
    private isLoading:boolean = false;
    private loading:Loading;
    private exitAlert:Alert;
    public isIPhoneX:boolean = false;

    constructor(public app:App,
                public platform:Platform,
                public loadingCtrl:LoadingController,
                public alertCtrl:AlertController,
                public zone:NgZone,
                public translate:TranslateService,
                private splashscreen:SplashScreen, 
                private statusbar:StatusBar,
                private device:Device) {
        super();
    }

    ngOnInit() {
        this.parseUrl();
        this.initializeApp();
        // set the nav menu title to the application name from settings.json
        this.appName = Meteor.settings.public["appName"];

        // set our app's pages
        // title references a key in the language JSON to be translated by the translate pipe in the HTML
        this.noUserPages = [{
            icon: "log-in",
            title: 'page-login.signIn',
            component: LoginPage,
            rootPage: true
        }];
        this.pages = [{
            icon: "information-circle",
            title: "page-about.title",
            component: AboutPage,
            rootPage: false
        }];

        this.autorun(() => this.zone.run(() => {
            // Use this to update component variables based on reactive sources.
            // (i.e. Monogo collections or Session variables)

            // User will be null upon initialization
            this.user = Meteor.user();
            console.log("user: ", this.user);

            // Meteor.user() is a reactive variable.
            if (Meteor.user()) {
                // Do something when user is present after initialization or after log in.
                if (this.nav && this.nav.getActive()) {
                    let viewCtrl = this.nav.getActive();
                    if (viewCtrl.component === LoginPage) {
                        this.nav.setRoot(LandingPage);
                    }
                }
            }
            this.setUserPages();
        }));

        this.autorun(() => this.zone.run(() => {
            if (Session.get(Constants.SESSION.PLATFORM_READY)) {
                this.platformReady();
                
                // Reset PLATFORM_READY flag so styles will be applied correctly with hotcode push
                Session.set(Constants.SESSION.PLATFORM_READY, false);
            }
        }));

        this.translate.onLangChange.subscribe(() => {
            Session.set(Constants.SESSION.TRANSLATIONS_READY, true);
        });

        // Global loading dialog
        // Use Session.set(Constants.SESSION.LOADING, true) to trigger loading dialog
        this.autorun(() => {
            if (Session.get(Constants.SESSION.LOADING)) {
                if (this.nav) {
                    // Delay to prevent showing if loaded quickly
                    Meteor.setTimeout(() => {
                        if (!this.loading && Session.get(Constants.SESSION.LOADING)) {
                            this.loading = this.loadingCtrl.create({
                                spinner: 'crescent'
                                //content: 'Loading...'
                            });
                            this.loading.present();
                            this.isLoading = true;
                        }
                    }, 500);
                }
            } else {
                if (this.isLoading && this.loading) {
                    this.loading.dismiss();
                    this.loading = null;
                    this.isLoading = false;
                }
            }
        });
    }

    private setUserPages():void {
        var hideHomePage:boolean = true;

        this.userPages = [{
            icon: "home",
            title: 'page-home.title',
            component: HomePage,
            rootPage: true,
            hide: hideHomePage
        }];
    }

    private initializeApp():void {
        var self = this;
        this.platform.ready().then(() => {
            // The platform is now ready. Note: if this callback fails to fire, follow
            // the Troubleshooting guide for a number of possible solutions:
            //
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //
            // First, let's hide the keyboard accessory bar (only works natively) since
            // that's a better default:
            //
            // Keyboard.setAccessoryBarVisible(false);
            // For example, we might change the StatusBar color. This one below is
            // good for dark backgrounds and light text:
            if (Meteor.isCordova) {
                // Keyboard.setAccessoryBarVisible(false);

                // Style status bar
                // StatusBar.styleDefault();
                this.statusbar.styleLightContent();

                // Set color of Android status bar background
                // iOS note: you must call StatusBar.overlaysWebView(false) to enable color changing.
                // StatusBar.overlaysWebView(false);

                //* Complimentary hex value for primary color in theme/app.variables.scss *//
                this.statusbar.backgroundColorByHexString("#ad48e7");

                this.splashscreen.hide();

                DeviceReady.onDeviceReady();

                self.platform.registerBackButtonAction(self.onBackButtonPressed.bind(self));
                let deviceModel = this.device.model;
                console.log("deviceModel: ", deviceModel);
                let isIPhone:boolean = deviceModel.includes("iPhone");
                if (isIPhone) {
                    let modelInfo = this.device.model.replace("iPhone", Constants.EMPTY_STRING);
                    console.log("modelInfo: ", modelInfo);
                    let numbers = modelInfo.split(",");
                    console.log("numbers: ", numbers);
                    let modelNumber:number = parseInt(numbers[0]);
                    console.log("modelNumber: ", modelNumber);
                    if (modelNumber >= 10) {
                        console.log("Device is iPhone X or newer");
                        this.isIPhoneX = true;
                    }
                } else if (deviceModel === "x86_64") {
                    this.isIPhoneX = true;
                }
                Session.set(Constants.SESSION.IS_IPHONE_X_LAYOUT, this.isIPhoneX);
            }

            Session.set(Constants.SESSION.PLATFORM_READY, true);
        });
    }

    private platformReady():void {
        this.initializeTranslateServiceConfig();
        this.setStyle();
    }

    private initializeTranslateServiceConfig() {
        var prefix = '/i18n/';
        var suffix = '.json';

        var userLang = navigator.language.split('-')[0];
        userLang = /(en|es)/gi.test(userLang) ? userLang : 'en';

        this.translate.setDefaultLang('en');
        let langPref = Session.get(Constants.SESSION.LANGUAGE);
        if (langPref) {
            userLang = langPref;
        }
        Session.set(Constants.SESSION.LANGUAGE, userLang);
        this.translate.use(userLang);
    }

    private setStyle():void {
        // Change value of the meta tag
        var links:any = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.getAttribute("rel").indexOf("style") != -1 && link.getAttribute("title")) {
                link.disabled = true;
                if (link.getAttribute("title") === this.getBodyStyle())
                    link.disabled = false;
            }
        }
    }

    private getBodyStyle():string {
        var bodyTag:any = document.getElementsByTagName("ion-app")[0];
        var bodyClass = bodyTag.className;
        var classArray = bodyClass.split(" ");
        var bodyStyle = classArray[2];
        return bodyStyle;
    }

    private openPage(page:INavigationMenuPage) {
        this.navigate({page: page.component, setRoot: page.rootPage});
    }

    private showAccountMenu():void {
        this.navigate({page: AccountMenuPage, setRoot: false});
    }

    private logout():void {
        this.user = null;
        Meteor.logout();
        this.navigate({page: LandingPage, setRoot: true});
    }

    private navigate(location:{page:any, setRoot:boolean}):void {
        // close the menu when clicking a link from the menu
        // getComponent selector is the component id attribute
        this.leftMenu.close().then(() => {
            if (location.page) {
                // navigate to the new page if it is not the current page
                let viewCtrl = this.nav.getActive();
                if (viewCtrl.component !== location.page) {
                    if (location.setRoot) {
                        this.nav.setRoot(location.page);
                    } else {
                        this.nav.push(location.page);
                    }
                }
            } 
        });
    }

    private onBackButtonPressed(event:any):void {
        var self = this;
        //console.log("onBackButtonPressed()");
        var activeNav:NavController = self.app.getActiveNav();
        if (!activeNav.canGoBack()) {
            //console.log("On Root Page, can't go back, prompt exit app.");
            if (!self.exitAlert) {
                self.exitAlert = self.alertCtrl.create({
                    title: self.translate.instant("general.alerts.exit.title"),
                    message: self.translate.instant("general.alerts.exit.message"),
                    buttons: [{
                        text: self.translate.instant("general.no"),
                        role: 'cancel',
                        handler: () => {
                        }
                    }, {
                        text: self.translate.instant("general.yes"),
                        handler: () => {
                            navigator.app.exitApp();
                        }
                    }]
                });
                self.exitAlert.present();
            } else {
                this.exitAlert.dismiss();
                this.exitAlert = null;
            }
        } else {
            activeNav.pop();
        }
    }

    public parseUrl():void {
        if (!Meteor.isCordova) {
            var path = RequestHelper.getPath(this.platform.url());
            var urlParams:any = RequestHelper.getUrlParams(this.platform.url());
            if (urlParams) {
                var scope:any = urlParams.scope;
                if (scope) {
                    urlParams.scope = scope.split(',');
                }
                urlParams.string = RequestHelper.getUrlParamString(this.platform.url());
            }
            Session.set(Constants.SESSION.PATH, path);
            Session.set(Constants.SESSION.URL_PARAMS, urlParams);
            window.history.pushState('', document.title, Meteor.absoluteUrl());
        }
    }

    public getOrientation():string {
        return this.platform.isPortrait() ? "portrait" : "landscape";
    }
}

export interface INavigationMenuPage {
    icon?:string,
    title:string,
    component:any,
    rootPage?:boolean,
    hide?:boolean
}
