import {Component, OnInit} from '@angular/core';


interface PostCountEntry {
  userId: number;
  count: number;
  range: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.html',
  styleUrls: ['./report.scss']
})

export class ReportComponent implements OnInit {
  posts: any[] = [];
  rerumCount: number = 0;
  postCounts: PostCountEntry[] = [];

  ngOnInit() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        this.posts = data;

        // Count the total post, include lowercase/ upper case with 'rerum'
        this.rerumCount = this.posts.filter(post =>
          post.body.toLowerCase().includes('rerum')
        ).length;

        // Count the post of the user and the range ID
        const groupedByUser: { [key: number]: number[] } = {};

        for (const post of data) {
          if (!groupedByUser[post.userId]) {
            groupedByUser[post.userId] = [];
          }
          groupedByUser[post.userId].push(post.id);
        }

        this.postCounts = Object.keys(groupedByUser).map(userId => {
          const ids = groupedByUser[+userId];
          //the return must have 3 datas to fill the table (userId, count, range)
          return {
            userId: +userId,
            count: ids.length,
            range: `${Math.min(...ids)} - ${Math.max(...ids)}`
          };
        });
      });
  }
}
