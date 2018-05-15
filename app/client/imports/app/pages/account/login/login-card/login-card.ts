import {Component, OnInit, NgZone} from '@angular/core';
import {NavController} from "ionic-angular/es2015";
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Constants} from "../../../../../../../both/Constants";
import {FormValidator} from "../../../../utils/FormValidator";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "login-card",
    templateUrl: "login-card.html"
})
export class LoginCardComponent extends MeteorComponent implements OnInit {
    public loginForm:FormGroup;
    public formControl:{
        email:AbstractControl,
        password:AbstractControl
    };
    public loginInputs:{
        email:string,
        password:string
    };

    constructor(public nav:NavController,
                public fb:FormBuilder,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        this.loginInputs = {
            email: Constants.EMPTY_STRING,
            password: Constants.EMPTY_STRING
        };
        this.loginForm = this.fb.group({
            'email': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validEmail,
                FormValidator.registered
            ])],
            "password": [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validPassword
            ])]
        });

        this.formControl = {
            email: this.loginForm.controls['email'],
            password: this.loginForm.controls['password']
        };

        Meteor.defer(() => {
            this.autorun(() => this.zone.run(() => {
                Session.get(Constants.SESSION.REGISTERED_ERROR);
                Session.get(Constants.SESSION.INCORRECT_PASSWORD);
                this.loginInputs.email = Session.get(Constants.SESSION.EMAIL) || null;
            }));
        });
    }

    public onSubmit():void {
        var self = this;
        if (!Meteor.status().connected) {
            new ToastMessenger().toast({
                type: "error",
                message: self.translate.instant("general.noServerConnection"),
                title: self.translate.instant("login-card.errors.signIn")
            });
            return;
        }
        if (self.loginForm.valid) {
            Session.set(Constants.SESSION.EMAIL, self.loginInputs.email);
            Session.set(Constants.SESSION.LOADING, true);
            Meteor.loginWithPassword({
                    email: self.loginInputs.email.toLowerCase()
                },
                self.loginInputs.password,
                (error) => {
                    Session.set(Constants.SESSION.LOADING, false);
                    if (error) {
                        console.log("loginWithPassword Error: " + JSON.stringify(error));
                        var toastMessage = null;
                        if (error.reason) {
                            if (error.reason === Constants.METEOR_ERRORS.INCORRECT_PASSWORD) {
                                console.log("Incorrect password");
                                Session.set(Constants.SESSION.INCORRECT_PASSWORD, true);
                                self.formControl.password.updateValueAndValidity({onlySelf:true});
                            } else if (error.reason === Constants.METEOR_ERRORS.USER_NOT_FOUND) {
                                console.log("User not found");
                                Session.set(Constants.SESSION.REGISTERED_ERROR, true);
                                self.formControl.email.updateValueAndValidity({onlySelf:true});
                            } else if (error.reason === Constants.METEOR_ERRORS.NO_PASSWORD) {
                                toastMessage = self.translate.instant("login-card.errors.socialSignIn");
                            } else {
                                toastMessage = error.reason;
                            }
                        } else {
                            toastMessage = error.message;
                        }
                        if (toastMessage) {
                            new ToastMessenger().toast({
                                type: "error",
                                message: toastMessage,
                                title: self.translate.instant("login-card.errors.signIn")
                            });
                        }
                    } else {
                        console.log("Successfully logged in with password.");
                    }
                }
            );
        }
    }

    public showForgotPasswordCard():void {
        Session.set(Constants.SESSION.FORGOT_PASSWORD, true);
        Session.set(Constants.SESSION.EMAIL, this.loginInputs.email);
    }

    public showCreateAccountCard():void {
        Session.set(Constants.SESSION.CREATE_ACCOUNT, true);
        Session.set(Constants.SESSION.EMAIL, this.loginInputs.email);
    }
}