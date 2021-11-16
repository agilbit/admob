import {Component, NgZone} from '@angular/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
  InterstitialAdPluginEvents, AdOptions
} from '@capacitor-community/admob';
import {PluginListenerHandle} from '@capacitor/core';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public readonly lastBannerEvent$$ = new ReplaySubject<{name: string; value: any}>(1);
  public readonly lastBannerEvent$ = this.lastBannerEvent$$.asObservable();

  public readonly lastInterstitialEvent$$ = new ReplaySubject<{name: string; value: any}>(1);
  public readonly lastInterstitialEvent$ = this.lastInterstitialEvent$$.asObservable();

  public readonly bannerSizes: BannerAdSize[] = Object.keys(BannerAdSize) as BannerAdSize[];
  public currentBannerSize?: BannerAdSize;

  public isPrepareBanner = false;
  public isPrepareInterstitial = false;

  public isLoading = false;

  /**
   * Height of AdSize
   */
  private appMargin = 0;
  private bannerPosition: 'top' | 'bottom';

  private readonly listenerHandlers: PluginListenerHandle[] = [];

  private bannerTopOptions: BannerAdOptions = {
    adId: 'ca-app-pub-7613634241359519/8119130088',
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    isTesting: true
    // npa: false,
  };

  private bannerBottomOptions: BannerAdOptions = {
    adId: 'ca-app-pub-7613634241359519/8119130088',
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: true
    // npa: false,
  };

  private interstitialOptions: AdOptions = {
    adId: 'ca-app-pub-3940256099942544/1033173712',
  };

  constructor(private readonly ngZone: NgZone) {}

  ionViewWillEnter() {
    /**
     * Run every time the Ad height changes.
     * AdMob cannot be displayed above the content, so create margin for AdMob.
     */
    const resizeHandler = AdMob.addListener(BannerAdPluginEvents.SizeChanged, (info: AdMobBannerSize) => {
      this.appMargin = info.height;
      const app: HTMLElement = document.querySelector('ion-router-outlet');

      if (this.appMargin === 0) {
        app.style.marginTop = '';
        return;
      }

      if (this.appMargin > 0) {
        const body = document.querySelector('body');
        const bodyStyles = window.getComputedStyle(body);
        const safeAreaBottom = bodyStyles.getPropertyValue('--ion-safe-area-bottom');


        if (this.bannerPosition === 'top') {
          app.style.marginTop = this.appMargin + 'px';
        } else {
          app.style.marginBottom = `calc(${safeAreaBottom} + ${this.appMargin}px)`;
        }
      }
    });

    this.listenerHandlers.push(resizeHandler);

    this.registerBannerListeners();
    this.registerInterstitialListeners();
  }

  ionViewWillLeave() {
    this.listenerHandlers.forEach(handler => handler.remove());
  }

  /**
   * ==================== BANNER ====================
   */
  async showTopBanner() {
    this.bannerPosition = 'top';
    await this.showBanner(this.bannerTopOptions);
  }

  async showBottomBanner() {
    this.bannerPosition = 'bottom';
    await this.showBanner(this.bannerBottomOptions);
  }

  async hideBanner() {
    const result = await AdMob.hideBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    const app: HTMLElement = document.querySelector('ion-router-outlet');
    app.style.marginTop = '0px';
    app.style.marginBottom = '0px';
  }

  async resumeBanner() {
    const result = await AdMob.resumeBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    const app: HTMLElement = document.querySelector('ion-router-outlet');
    app.style.marginBottom = this.appMargin + 'px';
  }

  async removeBanner() {
    const result = await AdMob.removeBanner()
      .catch(e => console.log(e));
    if (result === undefined) {
      return;
    }

    const app: HTMLElement = document.querySelector('ion-router-outlet');
    app.style.marginBottom = '0px';
    this.appMargin = 0;
    this.isPrepareBanner = false;
  }

  /**
   * ==================== /BANNER ====================
   */


  /**
   * ==================== Interstitial ====================
   */
  async prepareInterstitial() {
    this.isLoading = true;

    try {
      const result = await AdMob.prepareInterstitial(this.interstitialOptions);
      console.log('Interstitial Prepared', result);
      this.isPrepareInterstitial = true;

    } catch (e) {
      console.error('There was a problem preparing the Interstitial', e);
    } finally {
      this.isLoading = false;
    }
  }


  async showInterstitial() {
    await AdMob.showInterstitial()
      .catch(e => console.log(e));

    this.isPrepareInterstitial = false;
  }

  /**
   * ==================== /Interstitial ====================
   */


  private registerBannerListeners(): void {
    const eventKeys = Object.keys(BannerAdPluginEvents);

    eventKeys.forEach(key => {
      console.log(`registering ${BannerAdPluginEvents[key]}`);
      const handler = AdMob.addListener(BannerAdPluginEvents[key], (value) => {
        console.log(`Banner Event "${key}"`, value);

        this.ngZone.run(() => {
          this.lastBannerEvent$$.next({name: key, value});
        });

      });
      this.listenerHandlers.push(handler);

    });
  }

  private async showBanner(options: BannerAdOptions): Promise<void> {
    const bannerOptions: BannerAdOptions = { ...options, adSize: this.currentBannerSize };
    console.log('Requesting banner with this options', bannerOptions);

    const result = await AdMob.showBanner(bannerOptions)
      .catch(e => console.error(e));

    if (result === undefined) {
      return;
    }

    this.isPrepareBanner = true;
  }

  private registerInterstitialListeners(): void {
    const eventKeys = Object.keys(InterstitialAdPluginEvents);

    eventKeys.forEach(key => {
      console.log(`registering ${InterstitialAdPluginEvents[key]}`);
      const handler = AdMob.addListener(InterstitialAdPluginEvents[key], (value) => {
        console.log(`Interstitial Event "${key}"`, value);

        this.ngZone.run(() => {
          this.lastInterstitialEvent$$.next({name: key, value});
        });

      });
      this.listenerHandlers.push(handler);
    });
  }

}
