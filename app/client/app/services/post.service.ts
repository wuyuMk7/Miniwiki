import { Injectable } from 'angular2/core'
import { Http, Response } from 'angular2/http'

@Injectable()

export class PostService {
  private _postsUrl = '/api/posts';
  private _postUrl = '/api/post';

  constructor(private _http: Http) {}

  getPosts() {
    return this._http.get(this._postsUrl)
      .map(res => res.json())
      .map()
  }

  getPost(name: string) {
    let postUrl = this._postUrl + name;

    return this._http.get(postUrl)
      .map(res => res.json())
      .map()
  }
}
