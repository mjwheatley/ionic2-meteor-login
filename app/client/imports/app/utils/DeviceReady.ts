import {Constants} from "../../../../both/Constants";

declare var device;
declare var navigator;
declare var window;

export class DeviceReady {
    public static onDeviceReady():void {
        Session.set(Constants.SESSION.DEVICE_READY, true);
        // Listen for application resumed event
        document.addEventListener('resume', this.onResume, false);

        Session.set(Constants.SESSION.DEVICE_READY, true);
        navigator.globalization.getPreferredLanguage((language) => {
            console.log('navigator.globalization.getPreferredLanguage(): ' + language.value);
            // if (language.value === 'es-ES' || language.value === 'es-US') {
            //     console.log("Set default language to spanish");
            // }
        }, () => {
            console.log('Error getting language');
        });

        // Change color of recent apps title bar color (Android)
        if (device.platform === Constants.DEVICE.ANDROID) {
            window.plugins.headerColor.tint("#672B8A");
        }
    }

    private static onResume() {
        //console.log("Application resumed");
    }
}