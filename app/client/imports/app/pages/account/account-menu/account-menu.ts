import {Component, OnInit} from '@angular/core';
import {NavController} from "ionic-angular/es2015";
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {TranslateService} from "@ngx-translate/core";
import {INavigationMenuPage} from "../../../app.component";

//Pages
import {EditProfilePage} from './edit-profile/edit-profile';
import {ChangePasswordPage} from './change-password/change-password';

@Component({
    selector: "page-account-menu",
    templateUrl: "account-menu.html"
})
export class AccountMenuPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public pages:Array<INavigationMenuPage>;

    constructor(public nav:NavController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.pages = [{
            icon: "create",
            title: "page-edit-profile.title",
            component: EditProfilePage
        }, {
            icon: "swap",
            title: "page-change-password.title",
            component: ChangePasswordPage
        }];

        this.autorun(() => {
            this.user = Meteor.user();
        });
    }

    public openPage(page):void {
        this.nav.push(page.component);
    }
}