import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post, PostComment } from '../index';
import { CommentCreateDto, PostCreateDto } from '../interfaces/post.interface';

export const postsActions = createActionGroup({
  source: 'posts',
  events: {
    'fetch posts': emptyProps(),
    'posts loaded': props<{ posts: Post[] }>(),
    'fetch post': props<{ postId: number }>(),
    'post loaded': props<{post: Post}>(),
    'create post': props<{ payload: PostCreateDto }>(),

    'create comment': props<{ payload: CommentCreateDto }>(),
    'comment created': props<{ comment: PostComment }>(),
    'comments loaded': props<{ comments: PostComment[] }>(),
  },
});
