import {Component, OnInit, NgZone} from '@angular/core';
import {App, NavController} from "ionic-angular/es2015";
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {TranslateService} from "@ngx-translate/core";
import {Constants} from "../../../../../both/Constants";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class HomePage extends MeteorComponent implements OnInit {
    public user:Meteor.User;

    constructor(public app:App,
                public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        // Use MeteorComponent autorun to respond to reactive session variables.
        this.autorun(() => this.zone.run(() => {
            this.user = Meteor.user();

            // Wait for translations to be ready
            // in case component loads before the language is set
            // or the language is changed after the component has been rendered.
            // Since this is the home page, this component and any child components
            // will need to wait for translations to be ready.
            if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
                this.translate.get('page-home.title').subscribe((translation:string) => {

                    // Set title of web page in browser
                    this.app.setTitle(translation);
                });
            }
        }));
    }
}
