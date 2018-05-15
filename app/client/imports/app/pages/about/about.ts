import {Component, OnInit, NgZone} from '@angular/core';
import {NavController} from "ionic-angular/es2015";
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "page-about",
    templateUrl: "about.html"
})
export class AboutPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public isConnected:boolean = false;
    public version:string;

    constructor(public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.autorun(() => {
            this.user = Meteor.user();
        });
        this.version = Meteor.settings.public["version"];
        this.autorun(() => this.zone.run(() => {
            console.log("Meteor server connected: " + Meteor.status().connected);
            this.isConnected = Meteor.status().connected;
        }));
    }
}