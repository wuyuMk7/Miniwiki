import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { IndexComponent } from './components/site/index.component';
import { PostsComponent } from './components/posts/app.component';

const appRoutes: Routes = [
  {
    path: '/',
    component: IndexComponent
  },
  {
    path: '/p',
    component: PostsComponent
  },
  {
    path: '/p/:name',
    component: PostsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})

export class AppModule{  }
