import { Profile } from '@tt/data-access/profile';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number;
}

export interface Post {
  id: number;
  title: string;
  communityId: number;
  content: string;
  author: Profile;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: PostComment[];
}

export interface PostComment {
  id: number;
  text: string;
  author: Author;
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: number;
  username: string;
  avatarUrl: string;
  subscribersAmount: number;
}

export interface CommentCreateDto {
  text: string;
  authorId: number;
  postId: number;
  commentId?: number;
}
