import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
export class Post {
  constructor(
    public title: string,
    public content: string,
    public date: Date,
    public summary: string,
    public likes: number,
    public comments: Array<{ username: string; comment: string }>
  ) {}
}

@Component({
  selector: 'app-tieba',
  templateUrl: './tieba.component.html',
  styleUrls: ['./tieba.component.css'],
})
export class TiebaComponent implements OnInit {
  posts: Post[] = [];

  showNewPostModal = false;
  filteredPosts: Post[] = [];
  searchText = '';
  // 定义浅色背景颜色数组
  lightColors: string[] = [
    'hsl(210, 60%, 95%)',
    'hsl(45, 60%, 90%)',
    'hsl(120, 30%, 85%)',
    'hsl(270, 40%, 90%)',
    'hsl(330, 50%, 95%)',
    'hsl(190, 20%, 85%)',
    'hsl(60, 40%, 92%)',
    'hsl(160, 30%, 95%)',
    'hsl(300, 50%, 90%)',
    'hsl(15, 20%, 93%)',
    'hsl(220, 60%, 88%)',
    'hsl(75, 40%, 89%)',
    'hsl(135, 30%, 87%)',
    'hsl(255, 50%, 92%)',
    'hsl(315, 20%, 95%)',
    'hsl(0, 0%, 95%)',
    'hsl(0, 0%, 88%)',
    'hsl(0, 0%, 90%)',
    'hsl(0, 0%, 93%)',
    'hsl(0, 0%, 97%)',
  ];

// 定义深色文字颜色数组
  darkColors: string[] = [
    'hsl(210, 60%, 20%)',
    'hsl(45, 60%, 30%)',
    'hsl(120, 30%, 40%)',
    'hsl(270, 40%, 30%)',
    'hsl(330, 50%, 20%)',
    'hsl(190, 20%, 40%)',
    'hsl(60, 40%, 32%)',
    'hsl(160, 30%, 20%)',
    'hsl(300, 50%, 30%)',
    'hsl(15, 20%, 33%)',
    'hsl(220, 60%, 28%)',
    'hsl(75, 40%, 29%)',
    'hsl(135, 30%, 27%)',
    'hsl(255, 50%, 32%)',
    'hsl(315, 20%, 20%)',
    'hsl(0, 0%, 20%)',
    'hsl(0, 0%, 28%)',
    'hsl(0, 0%, 30%)',
    'hsl(0, 0%, 33%)',
    'hsl(0, 0%, 17%)',
  ];

  newPost: Post = new Post('', '', new Date(), '', 0, []);

  constructor(private authService: AuthService, private router: Router) {}

  getRandomLightColor(): string {
    // 从 lightColors 数组中随机选择一个颜色
    const index = Math.floor(Math.random() * this.lightColors.length);
    return this.lightColors[index];
  }

  getRandomDarkColor(): string {
    // 从 darkColors 数组中随机选择一个颜色
    const index = Math.floor(Math.random() * this.darkColors.length);
    return this.darkColors[index];
  }
  ngOnInit(): void {
    this.getPosts();

  }
  goToPostDetails(post: Post): void {
    this.router.navigate(['/post', post.title]);
  }
  getPosts(): void {
    this.authService.getposts().subscribe((data: any) => {
      console.log(data)
      this.filteredPosts = data.data
      this.posts = data.data
      this.authService.posts = data.data;
    });
  }

  openNewPostModal(): void {
    this.showNewPostModal = true;
  }

  closeNewPostModal(): void {
    this.showNewPostModal = false;
  }


  isFormInvalid(): boolean {
    return !this.newPost.title || !this.newPost.content || !this.newPost.summary;
  }
  addPost() {
    const currentDate = new Date();
    const post = new Post(
      this.newPost.title as string,
      this.newPost.content as string,
      currentDate,
      this.newPost.summary as string,
      0, // Initial likes value
      [] // Initial comments value
    );
    this.filteredPosts.push(post);
    this.posts=this.filteredPosts;
    this.authService.posts = this.posts;
    this.showNewPostModal = false; // 关闭模态框
    // Clear the form
    this.newPost.title = '';
    this.newPost.summary = '';
    this.newPost.content = '';
    console.log(post)
    this.authService.uploadpost(post).subscribe((data: any) => {
      console.log(data)
    });
  }
  searchPost(): void {
    if (this.searchText.trim() === '') {
      // 如果输入框为空，显示所有帖子
      this.filteredPosts = this.posts;
    } else {
      // 根据输入框的值过滤帖子
      this.filteredPosts = this.posts;
      this.filteredPosts = this.filteredPosts.filter(
        post => post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          post.summary.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
}
