import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import {HttpClient} from "@angular/common/http";

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchForLocalQuery = '';

  constructor(private postService: PostService, private http: HttpClient) {}
  commentsByPost: { [postId: number]: Comment[] } = {};

  ngOnInit() {
    this.postService.getPosts().subscribe(data => {
      this.posts = data;
      this.filteredPosts = data;
    });
  }

  filterPosts() {
    const keyword = this.searchForLocalQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.body.toLowerCase().includes(keyword)
    );
  }

  // http://jsonplaceholder.typicode.com/posts/1/comments this is the url to show the comments inside the post id
  showComments(postId: number) {
    if (this.commentsByPost[postId]) return;

    this.http.get<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .subscribe((comments: Comment[]) => {
        this.commentsByPost[postId] = comments;
      });
  }

  hasRerum(text: string): boolean {
    return text.toLowerCase().includes('rerum');
  }

  boldtheWordOfRerum(text: string): string {
    const regex = /(rerum)/gi;
    return text.replace(regex, '<strong>$1</strong>');
  }
}
