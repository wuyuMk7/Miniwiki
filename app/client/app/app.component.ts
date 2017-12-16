import { Component } from '@angular/core';

import { IndexComponent } from './components/site/index.component';
import { PostsComponent } from './components/posts/app.component';

@Component({
  selector: 'my-app',
  template: '<router-outlet></router-outlet>',
  providers: []
})

export class AppComponent {}
