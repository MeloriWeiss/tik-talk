import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CommentCreateDto,
  Post, PostComment,
  PostCreateDto
} from '../interfaces/post.interface';
import { map } from 'rxjs';
import { httpConfig } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);

  baseApiUrl = httpConfig.baseApiUrl;

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload);
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`);
  }

  fetchPost(postId: number) {
    return this.#http.get<Post>(`${this.baseApiUrl}post/${postId}`);
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http
      .get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }
}
