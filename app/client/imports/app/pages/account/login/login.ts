import {Component, OnInit, NgZone} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {App, NavController} from "ionic-angular/es2015";
import {Constants} from "../../../../../../both/Constants";
import {TranslateService} from "@ngx-translate/core";
@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage extends MeteorComponent implements OnInit {
    public oauthProviders:Array<{name: string, class: string, icon: string, color: string}>;
    public pageTitle:string;
    public forgotPassword:boolean = false;
    public createAccount:boolean = false;
    public resetPassword:boolean = false;

    constructor(public app:App,
                public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        this.oauthProviders = [
            {name: 'Google', class:'google', icon:'googleplus', color: "google"},
            {name: 'Facebook', class: 'facebook', icon:'facebook', color: "facebook"}
        ];

        Meteor.defer(() => {
            this.autorun(() => this.zone.run(() => {
                this.forgotPassword = Session.get(Constants.SESSION.FORGOT_PASSWORD);
                this.createAccount = Session.get(Constants.SESSION.CREATE_ACCOUNT);
                this.resetPassword = Session.get(Constants.SESSION.RESET_PASSWORD);

                if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
                    this.translate.get('page-login').subscribe((translation:any) => {
                        // Set title of web page in browser
                        this.app.setTitle(translation.signIn);
                        if (this.createAccount) {
                            this.pageTitle = translation.createAccount;
                        } else if (this.forgotPassword) {
                            this.pageTitle = translation.forgotPassword;
                        } else if (this.resetPassword) {
                            this.pageTitle = translation.resetPassword;
                        } else {
                            this.pageTitle = translation.signIn;
                        }
                    });
                }
            }));
        });
    }

    /*Life Cycle*/
    ionViewWillEnter() {
        Session.set(Constants.SESSION.INCORRECT_PASSWORD, false);
        Session.set(Constants.SESSION.FORGOT_PASSWORD, false);
        Session.set(Constants.SESSION.CREATE_ACCOUNT, false);
        Session.set(Constants.SESSION.RESET_PASSWORD, false);
    }
}
