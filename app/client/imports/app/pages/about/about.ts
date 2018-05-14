import {Component, OnInit} from '@angular/core';
import {NavController} from "ionic-angular/es2015";
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "page-about",
    templateUrl: "about.html"
})
export class AboutPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;

    constructor(public nav:NavController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.autorun(() => {
            this.user = Meteor.user();
        });
    }
}