import {Component, NgZone} from '@angular/core';
import {NavController} from "ionic-angular/es2015";
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {MeteorComponent} from 'angular2-meteor';
import {Session} from "meteor/session";
import {Constants} from "../../../../../../../both/Constants";
import {FormValidator} from "../../../../utils/FormValidator";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {TranslateService} from "@ngx-translate/core";
declare var Accounts;
@Component({
    selector: "forgot-password-card",
    templateUrl: "forgot-password-card.html"
})
export class ForgotPasswordCardComponent extends MeteorComponent {
    public forgotPwForm:FormGroup;
    public formControl:{
        email:AbstractControl
    };
    public email:string;

    constructor(public nav:NavController,
                public zone:NgZone,
                public fb:FormBuilder,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        this.forgotPwForm = this.fb.group({
            'email': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validEmail,
                FormValidator.registered
            ])]
        });

        this.formControl = {
            email: this.forgotPwForm.controls['email']
        };

        this.autorun(() => {
            this.email = Session.get(Constants.SESSION.EMAIL) || null;
        });
    }

    public emailPasswordResetCode():void {
        var component = this;
        if (this.forgotPwForm.valid) {
            Accounts.forgotPassword({email: this.email.toLowerCase()}, function (error) {
                if (error) {
                    console.log("Error sending forgot password email: " + JSON.stringify(error));
                    if (error.reason && error.reason === Constants.METEOR_ERRORS.USER_NOT_FOUND) {
                        console.log("User not found");
                        Session.set(Constants.SESSION.REGISTERED_ERROR, true);
                        component.formControl.email.updateValueAndValidity({onlySelf:true});
                    } else {
                        var toastMessage = error.message;
                        if (error.reason) {
                            toastMessage = error.reason;
                        }
                        new ToastMessenger().toast({
                            type: "error",
                            message: toastMessage,
                            title: component.translate.instant("forgot-password-card.errors.passwordReset")
                        });
                    }
                } else {
                    console.log("Sending password reset email...");
                    Session.set(Constants.SESSION.FORGOT_PASSWORD, !Session.get(Constants.SESSION.FORGOT_PASSWORD));
                    Session.set(Constants.SESSION.RESET_PASSWORD, !Session.get(Constants.SESSION.RESET_PASSWORD));
                }
            });
        }
    }

    public showSignInCard() {
        Session.set(Constants.SESSION.FORGOT_PASSWORD, !Session.get(Constants.SESSION.FORGOT_PASSWORD));
        Session.set(Constants.SESSION.EMAIL, this.email);
    }
}