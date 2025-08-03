import { createFeature, createReducer, on } from '@ngrx/store';
import { Post, PostComment } from '../index';
import { postsActions } from './actions';

export interface PostsState {
  posts: Post[];
  comments: Record<string, PostComment[]>;
}

export const initialState: PostsState = {
  posts: [],
  comments: {}
};

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState,
    on(postsActions.postsLoaded, (state, { posts }) => {
      return {
        ...state,
        posts,
      };
    }),
    on(postsActions.postLoaded, (state, { post }) => {
      return {
        ...state,
        posts: [post, ...state.posts]
      };
    }),
    on(postsActions.commentsLoaded, (state, { comments }) => {
      if (!comments.length) {
        return state;
      }

      const stateComments = {...state.comments};
      stateComments[comments[0].postId] = comments;

      return {
        ...state,
        comments: stateComments
      };
    })
  ),
});
