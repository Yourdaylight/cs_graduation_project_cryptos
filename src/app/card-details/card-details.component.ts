import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css'],
})
export class CardDetailsComponent implements OnInit {

  cardDetails: any;
  contentArray: any;
  imagePath: string | undefined;

  constructor(private route: ActivatedRoute,private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.imagePath = `assets/${id}.jpg`;
      this.authService.getCardDetails(id).subscribe(data => {
        this.cardDetails = data;
        // this.contentArray = data.content.split('.').filter((sentence: { trim: () => { (): any; new(): any; length: number; }; }) => sentence.trim().length > 0);
      });
    });
  }
}
