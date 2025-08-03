import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postsActions } from './actions';
import { map, switchMap } from 'rxjs';
import { PostService } from '../index';

@Injectable({
  providedIn: 'root',
})
export class PostsEffects {
  actions$ = inject(Actions);
  postService = inject(PostService);

  fetchPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.fetchPosts),
      switchMap(() => {
        return this.postService.fetchPosts();
      }),
      map((res) => postsActions.postsLoaded({ posts: res }))
    );
  });

  fetchPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.fetchPost),
      switchMap(({ postId }) => {
        return this.postService.fetchPost(postId);
      }),
      map((res) => postsActions.postLoaded({ post: res }))
    );
  });

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(({ payload }) => {
        return this.postService.createPost(payload);
      }),
      map((res) => postsActions.fetchPost({ postId: res.id }))
    );
  });

  createComment = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createComment),
      switchMap(({ payload }) => {
        return this.postService.createComment(payload);
      }),
      map((res) => postsActions.commentCreated({ comment: res }))
    );
  });

  fetchCommentsByPostId = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.commentCreated),
      switchMap(({ comment: { postId } }) => {
        return this.postService.getCommentsByPostId(postId);
      }),
      map((res) => postsActions.commentsLoaded({ comments: res }))
    );
  });
}
