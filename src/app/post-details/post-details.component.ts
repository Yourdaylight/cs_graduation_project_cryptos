import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { Post} from '../tieba/tieba.component'
import {AuthService} from "../auth.service";
import { ImageService } from '../image.service';
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit {
  post!: Post | undefined;
  newComment: string = '';

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
  imageUrl: (() => string) | undefined;
  constructor(private imageService: ImageService,private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postTitle = params.get('title');
      if (postTitle) {
        // 从 AuthService 中获取 post 对象
        this.post = this.authService.getPostByTitle(postTitle);
        // console.log(this.post)
        if (!this.post) {
          this.router.navigate(['/community']);
        }
      }
    });

    this.imageService.getRandomImage('crypto').subscribe(
      (response: any) => {
        this.imageUrl = response.urls.regular;
        console.log(response)
      },
      (error) => {
        console.error('Error fetching random image:', error);
      }
    );
  }
  increaseLikes() {
    // @ts-ignore
    this.post.likes += 1;
    // @ts-ignore
    this.authService.updatePostLikes(this.post.title, this.post.likes).subscribe((response) => {
      console.log('Likes updated:', response);
    });
  }
  addComment(): void {
    if (this.newComment.trim() !== '' && this.post) {
      this.post.comments.push({
        username: 'Anonymous',
        comment: this.newComment.trim()
      });
      this.newComment = '';
      this.authService.updatecomments(this.post.title, this.post.comments).subscribe((response) => {
        console.log('Likes updated:', response);
      });
      // 调用 updateComments() 方法将评论传递给后端
    }
  }
  getRandomLightColor(): string {
    // 从 lightColors 数组中随机选择一个颜色
    const index = Math.floor(Math.random() * this.darkColors.length);
    return this.darkColors[index];
  }
}

