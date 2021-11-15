import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      /**
       * initialize() require after platform.ready();d
       */
      AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: false
      });
    });
  }
}
