import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute} from "@angular/router";
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css']
})
export class CryptoComponent  {
  cryptoData: any[] = [];
  loading: any;
  defaultName = 'BTC';
  activeItem: any;
  coinname = {
    coin: 'BTC'
  };
  chartOption: EChartsOption = {
    title: {
      text: 'ECharts example'
    },
    tooltip: {},
    xAxis: {
      data: ["null","null","null","null","null","null"]
    },
    yAxis: {},
    series: [{
      name: 'Sales',
      type: 'bar',
      data: [2, 2, 2, 2, 2, 2]
    }]
  };
  chartInstance: any;

  onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
    this.chartInstance.setOption({
      title: {
        text: 'ECharts example'
      },
      tooltip: {},
      xAxis: {
        data: ["null","null","null","null","null","null"]
      },
      yAxis: {},
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [2, 2, 2, 2, 2, 2]
      }]
    })
  }

  isLoadingData=false;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateChartTitle(this.defaultName);
    this.authService.getcrypto().subscribe((data: any) => {
      this.cryptoData = data;
      this.activeItem = this.cryptoData[0];
      console.log(this.activeItem)
      setTimeout(() => {
        this.loading = true;
      }, 3000);
    });
    this.authService.getprice(this.coinname).subscribe((data: any) => {
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
          text: `Price of ${this.defaultName}`,
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
  }

  calculateChangeClass(item: any): { change: string, className: string } {
    const change = ((item.last - item.open24h) / item.open24h) * 100;
    const className = change >= 0 ? 'green' : 'red';
    const changeWithSymbol = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
    return {change: changeWithSymbol, className};
  }

  updateChartTitle(name: string): void {
    this.defaultName = name;
    this.chartOption = {
      ...this.chartOption,
      title: {
        text: `Price of ${name}`,
        left: 'center', // 让标题居中显示
        textStyle: {
          fontSize: 24, // 设置字体大小
        }
      }
    };
  };

    updateChartTitle2(item: any): void {
      this.isLoadingData = true;
      this.defaultName = item.ccy;
      this.activeItem = item;
      this.chartOption = {
        ...this.chartOption,
        title: {
          text: `Price of ${item.ccy}`,
          left: 'center', // 让标题居中显示
          textStyle: {
            fontSize: 24, // 设置字体大小
          }
        }
      };
      const coinname = {
        coin: item.ccy
      };
      this.authService.getprice(coinname).subscribe((data: any) => {
        // console.log('Received data:', data);
        console.log('111')
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
        const newChartOption: EChartsOption = {
          title: {
            text: `Price of ${this.defaultName}`,
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
        this.updateChart(newChartOption);
        this.isLoadingData = false;
      });

    }
  updateChart(newChartOption: EChartsOption): void {
    this.chartOption = newChartOption;
  }
  }
