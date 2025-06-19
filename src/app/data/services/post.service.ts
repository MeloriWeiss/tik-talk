import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommentCreateDto, Post, PostCreateDto} from "../interfaces/post.interface";
import {environment} from "../../../environments/environment";
import {switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  #http = inject(HttpClient);

  posts = signal<Post[]>([]);

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${environment.baseApiUrl}post/`, payload)
      .pipe(
        switchMap(() => {
          return this.fetchPosts();
        })
      );
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${environment.baseApiUrl}post/`)
      .pipe(
        tap(res => this.posts.set(res))
      );
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<Comment>(`${environment.baseApiUrl}comment/`, payload);
  }
}
