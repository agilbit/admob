import {Component, OnInit} from '@angular/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize
} from '@capacitor-community/admob';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  ionViewWillEnter() {
    this.showBanner();
  }

  async hideBanner() {
    const result = await AdMob.hideBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }
  }

  showBanner(): Promise<void> {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      // Subscribe Banner Event Listener
    });

    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
      // Subscribe Change Banner Size
      console.log('Tamanio del anuuncio : ', size);
    });

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-7613634241359519/8119130088',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 0,
      isTesting: true
    };
    return AdMob.showBanner(options);
  }

}
