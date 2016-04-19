import { Component } from 'angular2/core'
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router'

import { IndexComponent } from './components/index.component'
import { ListComponent } from './components/list.component'
import { PostComponent } from './components/post.component'

@Component({
  selector: '',
  directive: [ROUTER_DIRECTIVES],
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
      path: '/l/:name',
    name: 'List',
    component: ListComponent,
  },
  {
    path: '/p/:name',
    name: 'Post',
    component: PostComponent,
  }
])
