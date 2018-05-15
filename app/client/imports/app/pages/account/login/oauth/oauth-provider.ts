import {Component, Input} from '@angular/core';
import {Meteor} from "meteor/meteor";
import {NavController} from "ionic-angular/es2015";
import {TranslateService} from "@ngx-translate/core";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {Constants} from "../../../../../../../both/Constants";

@Component({
    selector: "oauth-provider",
    templateUrl: "oauth-provider.html"
})
export class OauthProviderComponent {
    @Input() oauthProvider;

    constructor(public nav:NavController,
                public translate:TranslateService) {
    }

    loginWithProvider(provider) {
        console.log("loginWith" + provider);
        var component = this;
        switch (provider) {
            case "Google":
                Meteor.loginWithGoogle({
                    requestPermissions: [
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/userinfo.email'
                    ],
                    //redirectUrl:  Meteor.absoluteUrl() + "auth/oauth/callback"
                }, function (error) {
                    if (error) {
                        console.log("Error: " + JSON.stringify(error));
                        var errorMessage = error.message;
                        if (error.error === "email-registered") {
                            errorMessage = error.reason;
                        } else if (error.reason === Constants.METEOR_ERRORS.EMAIL_EXISTS) {
                            errorMessage = component.translate.instant(
                                "create-account-card.errors.alreadyRegistered");
                        } else if (error.errorType === "Accounts.LoginCancelledError") {
                            errorMessage = null;
                        }
                        if (errorMessage) {
                            console.log("Error signing in with Google: " + errorMessage);
                            new ToastMessenger().toast({
                                type: "error",
                                message: errorMessage,
                                title: component.translate.instant("login-card.errors.signIn")
                            });
                        }
                    } else {
                        console.log("Successfully signed in with Google");
                    }
                });
                break;
            case "Facebook":
                Meteor.loginWithFacebook({
                    requestPermissions: ['email', 'user_birthday', 'user_location'],
                    //redirectUrl: Meteor.absoluteUrl() + "auth/oauth/callback"
                }, function (error) {
                    if (error) {
                        console.log("Error: " + JSON.stringify(error));
                        var errorMessage = error.message;
                        if (error.error === "email-registered") {
                            errorMessage = error.reason;
                        } else if (error.reason === Constants.METEOR_ERRORS.EMAIL_EXISTS) {
                            errorMessage = component.translate.instant(
                                "create-account-card.errors.alreadyRegistered");
                        } else if (error.errorType === "Accounts.LoginCancelledError") {
                            errorMessage = null;
                        }
                        if (errorMessage) {
                            console.log("Error signing in with Facebook: " + errorMessage);
                            new ToastMessenger().toast({
                                type: "error",
                                message: errorMessage,
                                title: component.translate.instant("login-card.errors.signIn")
                            });
                        }
                    } else {
                        console.log("Successfully signed in with Facebook");
                    }
                });
                break;
            default:
                console.log("Provider not listed");
        }
    }
}