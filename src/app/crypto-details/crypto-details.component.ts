import {Component, OnInit} from '@angular/core';
import {EChartsOption} from 'echarts';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../auth.service";
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.css']
})
export class CryptoDetailsComponent implements OnInit {
  chartOption: EChartsOption = {};
  apiUrl: any;
  apiUrl2: any;
  data: any;
  cryptoDescription = '';
  chartInstance: any;
  ccy: any;
  isLoadingData = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }

  // https://www.okx.com/v2/support/info/announce/detail?t=1682741107778&projectName=btc&locale=zh_CN
  // 通过这个网址请求btc knowledge


  ngOnInit() {
    this.isLoadingData = true;
    this.ccy = this.route.snapshot.paramMap.get('ccy');
    console.log(this.ccy)
    this.apiUrl = `https://www.okx.com/v2/support/info/announce/coinDataInfo?projectName=${this.ccy}`;
    this.apiUrl2 = `https://www.okx.com/v2/support/info/announce/detail?t=1682741107778&projectName=${this.ccy}&locale=en`;
    console.log(this.apiUrl)
    this.getData();
    this.getData2();
    const coinname = {
      coin: this.ccy
    };
    this.authService.getprice(coinname).subscribe((data: any) => {
      // console.log('Received data:', data);
      const extractedData = data.map((item: string[]) => {
        return {
          timestamp: parseInt(item[0]),
          price: parseFloat(item[5]),
        };
      });
      const formattedData = extractedData.map((item: { timestamp: number; price: number }) => {
        return {
          date: new Date(item.timestamp).toLocaleDateString(),
          price: item.price,
        };
      });
      const dates = formattedData.map((item: { date: any; }) => item.date);
      const prices = formattedData.map((item: { price: any; }) => item.price);
      this.chartOption = {
        title: {
          text: `Price of ${this.ccy}`,
          left: 'center', // 让标题居中显示
          textStyle: {
            fontSize: 24, // 设置字体大小
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const date = params[0].axisValue;
            const price = parseFloat(params[0].data).toFixed(2);
            return `Date: ${date}<br/>USD: ${price}`;
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          data: dates,
        },
        yAxis: {
          type: 'value',
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            data: prices,
            type: 'line',
            smooth: true,
            name: 'Price',
          },
        ],
      };
    });
    this.isLoadingData = false;
  }

  onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
    this.chartInstance.setOption({
      title: {
        text: 'ECharts example'
      },
      tooltip: {},
      xAxis: {
        data: ["null", "null", "null", "null", "null", "null"]
      },
      yAxis: {},
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [2, 2, 2, 2, 2, 2]
      }]
    })
  }

  getData(): void {
    this.authService.fetchData(this.apiUrl).subscribe((data: any) => {
      console.log(data)
      this.data = data
    });
  }

  getData2(): void {
    this.authService.fetchData2(this.apiUrl2).subscribe((data: any) => {
      console.log(data)
      this.cryptoDescription = data.data
    });
  }

  predict(): void {
    this.isLoadingData = true;
    this.authService.predict(this.ccy).subscribe((data: any) => {
      const originalData = data.data.original_data.map((item: [number, number]) => {
        return {
          timestamp: item[0],
          price: item[1],
        };
      });

      const predictData = data.data.predict_data.map((item: [number, number]) => {
        return {
          timestamp: item[0],
          price: item[1],
        };
      });

      const formattedOriginalData = originalData.map((item: { timestamp: number; price: number }) => {
        return {
          date: new Date(item.timestamp).toLocaleDateString(),
          price: item.price,
        };
      });

      const formattedPredictData = predictData.map((item: { timestamp: number; price: number }) => {
        return {
          date: new Date(item.timestamp).toLocaleDateString(),
          price: item.price,
        };
      });

      const originalDates = formattedOriginalData.map((item: { date: any; }) => item.date);
      const originalPrices = formattedOriginalData.map((item: { price: any; }) => item.price);

      const predictDates = formattedPredictData.map((item: { date: any; }) => item.date);
      // predictPrices将与originalPrices同样长度的地方用-表示，因为预测的数据是没有的
      const predictPrices = originalPrices.map((item: { price: any; }) => '-');
      // 将最后一个predictPrices的-替换为原始数据的最后一个价格
      predictPrices[predictPrices.length - 1] = originalPrices[originalPrices.length - 1];
      // 再将预测的数据加到predictPrices后面
      predictPrices.push(...formattedPredictData.map((item: { price: any; }) => item.price));

      (this.chartOption.xAxis as any).data = originalDates.concat(predictDates);
      this.isLoadingData = false;
      this.chartOption.series = [
        {
          data: originalPrices,
          type: 'line',
          smooth: true,
          name: 'Original Price',
          itemStyle: {
            color: '#1f77b4' // original data color
          }
        },
        {
          data: predictPrices,
          type: 'line',
          smooth: true,
          name: 'Predicted Price',
          itemStyle: {
            color: '#ff7f0e' // predicted data color
          }
        }
      ];
      this.chartInstance.setOption(this.chartOption);
    });
  }

}
