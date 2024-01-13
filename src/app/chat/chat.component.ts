import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {AuthService} from "../auth.service";
import {ActivatedRoute} from "@angular/router";


interface Message {
  user: string;
  content: string;
  isUser: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userMessage: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getdialog().subscribe(dialogueData => {
      if (dialogueData && dialogueData.dialogue) {
        this.showMessages(dialogueData.dialogue);
      } else {
        console.error('Error: Unable to fetch dialogue data');
        // 继续生成随机消息
        interval(5000)
          .pipe(
            take(20),
            map(() => {
              const randomUser = 'User ' + Math.floor(Math.random() * 10);
              const randomMessage = 'Random message ' + Math.floor(Math.random() * 1000);
              return { user: randomUser, content: randomMessage, isUser: false };
            })
          )
          .subscribe(message => {
            this.addMessage(message);
          });
      }
    });
  }

  private showMessages(messages: Message[]): void {
    const intervalTime = 5000; // 每个消息之间的时间间隔，单位为毫秒
    const maxInterval = messages.length - 1; // 需要展示的消息总数减一
    let currentIndex = 0;

    const messageInterval = setInterval(() => {
      this.addMessage(messages[currentIndex]);

      if (currentIndex >= maxInterval) {
        clearInterval(messageInterval);
      } else {
        currentIndex++;
      }
    }, intervalTime);
  }

  sendMessage(): void {
    if (this.userMessage) {
      console.log('???');
      this.addMessage({ user: 'You', content: this.userMessage, isUser: true });
      this.userMessage = '';
    }
  }

  private addMessage(message: Message): void {
    this.messages.push(message);
  }
}

