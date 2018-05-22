import {Component, OnInit, NgZone} from "@angular/core";
import {NavController, MenuController, App} from "ionic-angular/es2015";
import {MeteorComponent} from "angular2-meteor";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {TranslateService} from "@ngx-translate/core";
import {Constants} from "../../../../../both/Constants";
import {LoginPage} from "../account/login/login";
import {HomePage} from "../home/home";


@Component({
    selector: "page-landing",
    templateUrl: "landing.html"
})
export class LandingPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public isCordova:boolean = false;
    public customUrl:string;

    constructor(public nav:NavController,
                public menu:MenuController,
                public app:App,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.isCordova = Meteor.isCordova;

        this.app.setTitle(Meteor.settings.public["appName"]);

        var path:string = Session.get(Constants.SESSION.PATH);
        var urlParams:any = Session.get(Constants.SESSION.URL_PARAMS);

        // if (this.isCordova) {
            Meteor.defer(() => {
                this.autorun(() => {
                    this.user = Meteor.user();
                    let passwordResetTokenExists:boolean = Session.get(Constants.SESSION.RESET_PASSWORD_TOKEN);
                    let viewCtrl = this.nav.getActive();
                    let activeComponent = viewCtrl.component;
                    if (!passwordResetTokenExists || (passwordResetTokenExists && activeComponent !== LoginPage)) {
                        this.delayForUser();
                    }
                });
            });
        // }
    }

    private delayForUser():void {
        Session.set(Constants.SESSION.LOADING, true);
        setTimeout(() => {
            Session.set(Constants.SESSION.LOADING, false);
            this.setRootPage();
        }, 2500);
    }

    private setRootPage():void {
        var page:any =  HomePage;
        if (Session.get(Constants.SESSION.RESET_PASSWORD_TOKEN) || !this.user) {
            page = LoginPage;
        }
        this.zone.run(() => {
            this.nav.setRoot(page);
        });
    }
}