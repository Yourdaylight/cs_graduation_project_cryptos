import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  constructor(private router: Router) { }

  navigateToCardDetails(cardId: number) {
    this.router.navigate(['/card-details', cardId]);
  }
  newsList = [
    {
      title: 'Users Relieved as Binance-Voyager Deal Approved',
      description: 'The US government finally approved the Binance-Voyager deal.Voyager users express relief on social media after a long period of uncertainty.Earlier, multiple agencies tried to...',
      date: '2023-04-01',
      id: 1
    },
    {
      title: "What's next for EU's crypto industry as European Parliament passes MiCA?",
      description: 'On April 20, the European Parliament voted to pass the Markets in Crypto-Assets (MiCA) regulation, the European Union’s main legislative proposal to oversee the crypto...',
      date: '2023-04-10',
      id: 2
    },
    {
      title: 'DeFi driving zkSync growth as 1inch deploys on Ethereum layer-2 scaling platform',
      description: 'Decentralized finance protocol 1inch has deployed its aggregation and limit order protocols on Ethereum layer-2 scaling solution zkSync Era to tap into faster and cheaper...',
      date: '2023-04-15',
      id: 3
    }
  ];



  ngOnInit(): void {
  }
}
