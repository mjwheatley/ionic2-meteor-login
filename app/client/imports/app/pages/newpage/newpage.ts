import {Component, OnInit, NgZone} from '@angular/core';
import {NavController} from "ionic-angular/es2015";
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {TranslateService} from "@ngx-translate/core";

// TODO change selector
// TODO change templateUrl
@Component({
    selector: "page-newpage",
    templateUrl: "newpage.html"
})
//TODO change class name
//TODO add component to declarations and entryComponents in app.module.ts
export class NewPagePage extends MeteorComponent implements OnInit {
    public user:Meteor.User;

    constructor(public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        this.autorun(() => {
            this.user = Meteor.user();
        });
    }
}