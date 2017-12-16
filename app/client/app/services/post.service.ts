import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/post.model';

@Injectable()

export class PostService {
  private _postsUrl = '/api/posts';
  private _postUrl = '/api/post';

  private posts: Post[];

  constructor(private _http: HttpClient) {}

  getPosts() {
    this._http.get(this._postsUrl).subscribe(data => {
      this.posts = data['res'];
    })
  }

  getPost(name: string) {
    let postUrl = this._postUrl + name;

    this._http.get(this._postUrl).subscribe(data => {
      this.posts = data['res'];
    })

  }
}
