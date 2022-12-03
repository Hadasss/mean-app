import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/Post.interface';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  // to remove subscriptions and prevent memory leaks - OnDestroy() is called when the component is about to be removed from the DOM.
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
