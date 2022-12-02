import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../Post.interface';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }

  // FYI register the updated posts array as observable to make it an event we van listen to from within other components. It is needed because postsUpdated is private, so it cannot be mutated from other sources, but we do want to listen to added/edited posts so we cab render the new updated list.
  // this function returns an object we can listen to, but cannot emit.
  // on "the other side" - where we want to listen to this event, we would have to subscribe to it.
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);

    // this is an Observable:
    this.postsUpdated.next([...this.posts]);
    // the next() method is called on the Subject (postsUpdated) inside post-list component onInit.
  }
}