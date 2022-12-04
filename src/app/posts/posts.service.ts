import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../Post.interface';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      // to align id in postSchema to _id in mongoose:
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // FYI register the updated posts array as observable to make it an event we van listen to from within other components. It is needed because postsUpdated is private, so it cannot be mutated from other sources, but we do want to listen to added/edited posts so we cab render the new updated list.
  // this function returns an object we can listen to, but cannot emit.
  // on "the other side" - where we want to listen to this event, we would have to subscribe to it.
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    // id: null || "" >> that's because in ts strict mode it will require id inside onAddPost() in post-create component. causing a compilation failure.
    const post: Post = { id: null || '', title: title, content: content };

    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        console.log(responseData);
        // fetch the updated post id that was assigned by mongoose from the db and update it in the post object in the array:
        const id = responseData.postId;
        // then, assign the mongoose id value to the id property that we defined for this newly created object:
        post.id = id;
        this.posts.push(post);

        // this is an Observable:
        this.postsUpdated.next([...this.posts]);
        // the next() method is called on the Subject (postsUpdated) inside post-list component onInit.
      });
  }

  deletePost(postId: string) {
    // remove post from posts array on the frontend
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        console.log('deleted!');
        // render updated post list
        // this.getPosts();
        // this.getPosts()>>>> not a good solution because it makes another API call, when I don't need to fetch new data!
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
