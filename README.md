# Agilbit/AdMob
## _Example simple capacitor-community/admob_

This project is a Ionic/Angular mobile-ready implementation of capacitor-community/admooob, powered by Ionic/Angular

## Features

- Banner Ads at Top or Bottom
- Interstitial Ads
- All code in one simple file

I hope this sample can help some developers that had problem to learn to implement AdMob.

> Lincence MIT

## Tech

This project uses a number of open source projects to work properly:

- [Angular] - The modern web  developer's platform!
- [Ionic] - An open source mobile toolkit for building high quality, cross-platform native and web app experiences.
- [Capacitor Community/AdMob] - Markdown parser done right. Fast and easy to extend.
- [node.js] - evented I/O for the backend

## Installation

AdMob requires [Node.js](https://nodejs.org/), [Angular](https://angular.io) and [Ionic](https://ionicframework.com/).

Install the dependencies and devDependencies then compile to android or ios project and start the server (You need to connect your phone before run android project).

```sh
cd admob
npm install
ionic build
ionic capacitor add android
ionic capacitor run android -l --external
```
For ios you can run :
```
ionic capacitor add ios
ionnic capacitor run ios -l --external
```

## License

MIT

**Free Software, Hell Yeah!**

###### Contribution by Kenneth Burgos from Agilbit

[node.js]: <http://nodejs.org>
[Capacitor Community/AdMob]: <https://github.com/capacitor-community/admob>
[Angular]: <https://angular.io>
[Ionic]: <https://ionicframework.com/>
