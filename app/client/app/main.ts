import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';

//if (environment.production) {
//  enableProdMode();
//}

platformBrowserDynamic().bootstrapModule(AppModule);
