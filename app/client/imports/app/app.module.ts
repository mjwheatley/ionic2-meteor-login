import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular/es2015";
import {Storage} from '@ionic/storage';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {Constants} from "../../../both/Constants";
import {AppComponent} from "./app.component";
import {LandingPage} from "./pages/landing/landing";
import {HomePage} from "./pages/home/home";
import {NewPagePage} from "./pages/newpage/newpage";
import {DemoComponent} from "./components/demo/demo.component";
import {DemoDataService} from "./components/demo/demo-data.service";
import {WelcomeHeaderComponent} from "./components/welcome-header/welcome-header";
import {LanguageSelectComponent} from "./components/language-select/language-select";
import {AboutPage} from "./pages/about/about";

// Login components
import {LoginPage} from "./pages/account/login/login";
import {LoginCardComponent} from "./pages/account/login/login-card/login-card";
import {CreateAccountCardComponent} from "./pages/account/login/create-account-card/create-account-card";
import {ForgotPasswordCardComponent} from "./pages/account/login/forgot-password-card/forgot-password-card";
import {PasswordResetCardComponent} from "./pages/account/login/password-reset-card/password-reset-card";
import {OauthProviderComponent} from "./pages/account/login/oauth/oauth-provider";

// Account management components
import {AccountMenuPage} from "./pages/account/account-menu/account-menu";
import {ChangePasswordPage} from "./pages/account/account-menu/change-password/change-password";
import {EditProfilePage} from "./pages/account/account-menu/edit-profile/edit-profile";
import {AddImageComponent} from "./components/add-image/add-image";

// Ionic native plugins
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Device} from "@ionic-native/device";
import {Camera} from "@ionic-native/camera";
import {AndroidPermissions} from "@ionic-native/android-permissions";

@NgModule({
    // Components/Pages, Pipes, Directive
    declarations: [
        AppComponent,
        LandingPage,
        HomePage,
        NewPagePage,
        DemoComponent,
        WelcomeHeaderComponent,
        LanguageSelectComponent,
        AboutPage,
        LoginPage,
        LoginCardComponent,
        CreateAccountCardComponent,
        ForgotPasswordCardComponent,
        PasswordResetCardComponent,
        OauthProviderComponent,
        AccountMenuPage,
        ChangePasswordPage,
        EditProfilePage,
        AddImageComponent
    ],
    // Pages
    entryComponents: [
        AppComponent,
        LandingPage,
        HomePage,
        LoginPage,
        AboutPage,
        AccountMenuPage,
        ChangePasswordPage,
        EditProfilePage
    ],
    // Providers
    providers: [
        DemoDataService,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        SplashScreen,
        StatusBar,
        Device,
        Camera,
        AndroidPermissions
    ],
    // Modules
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(AppComponent, {
            //// http://ionicframework.com/docs/v2/api/config/Config/
            //mode: Constants.STYLE.MD,
            //pageTransition: Constants.STYLE.IOS,
            //tabbarPlacement: 'top',
            swipeBackEnabled: false
        })
    ],
    // Main Component
    bootstrap: [IonicApp]
})
export class AppModule {
    constructor() {

    }
}

export function createTranslateLoader(http:HttpClient) {
    return new TranslateHttpLoader(http, '/i18n/', '.json');
}
