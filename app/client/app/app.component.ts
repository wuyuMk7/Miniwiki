import { Component } from 'angular2/core'
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router'

import { IndexComponent } from './components/site/index.component'
import { PostsComponent } from './components/posts/app.component'

@Component({
  selector: 'my-app',
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS
  ]
})

@RouteConfig([
  {
    path: '/',
    name: 'Index',
    component: IndexComponent,
    useAsDefault: true,
  },
  {
    path: '/p',
    name: 'Posts',
    component: PostsComponent,
  },
  {
    path: '/p/:name',
    name: 'Posts',
    component: PostsComponent,
  }
])

export class AppComponent {}
