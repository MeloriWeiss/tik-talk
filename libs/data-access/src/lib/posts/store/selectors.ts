import { createSelector } from '@ngrx/store';
import { postsFeature } from './reducer';

export const selectPosts = createSelector(
  postsFeature.selectPosts,
  (posts) => posts
)

export const selectCommentsByPostId = (postId: number) => {
  return createSelector(
    postsFeature.selectComments,
    (comments) => comments[postId]
  )
}
