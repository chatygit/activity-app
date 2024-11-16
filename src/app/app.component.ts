import { Component, OnInit } from '@angular/core';
import { DownstreamService } from './downstream.service';
import { TotalByLocation } from './total-by-location';
import { MatListOption } from '@angular/material/list';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  totalByLocation: TotalByLocation[];
  totalByYear: TotalByLocation[];

  totalCreditAmount: number;
  totalDebitAmount: number;

  selectedCreditAmount: number;
  selectedDebitAmount: number;

  yearDebitTotal: number;
  yearCreditTotal: number;

  selectedYear: string;

  totalIncome: number = 132120 + 108300 + 71745 + 71900 + 72332;


  /**
   * 
   * CHART DATA VARIABLES
   */

  // BAR CHART
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 50
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 20,
            family: 'vazir'
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 40,
            family: 'vazir'
          }
        }
      }
    }
  };
  barChartLabels: String[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataset[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];


  // LINE CHART

  lineChartData: ChartDataset[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
  ];

  lineChartLabels: String[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 50
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 40,
            family: 'vazir'
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 40,
            family: 'vazir'
          }
        }
      }
    }
  };

  lineChartColors: object[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';



  /**
 * 
 * CHART DATA END
 * 
 * 
 */

  constructor(private app: DownstreamService) { }

  ngOnInit() {
    this.app.getCreditMapYear().subscribe(
      resp => {
        this.totalByYear = resp.body;
        this.totalByYear.sort((a, b) => a.location.localeCompare(b.location));
        this.selectedYear = this.totalByYear[0].location;

        this.totalDebitAmount = this.totalByYear.map(row => row.debitTotal).reduce((a, b) => a + b, 0);
        this.totalCreditAmount = this.totalByYear.map(row => row.creditTotal).reduce((a, b) => a + b, 0);

        this.lineChartData = [
          { data: this.totalByYear.map(val => val.debitTotal), label: 'Purchases by year' },
        ];
        this.lineChartLabels = this.totalByYear.map(val => val.location);
        this.changeList(this.totalByYear[0].location);
      }
    );

  }


  loadYearTotals(yearval) {
    this.yearDebitTotal = this.totalByYear.find(year => year.location == yearval).debitTotal;
    this.yearCreditTotal = this.totalByYear.find(year => year.location == yearval).creditTotal;
  }

  onLocationSelect(options: MatListOption[]) {
    this.selectedDebitAmount = options.map(optn => optn.value.debitTotal).reduce((a, b) => a + b, 0);
    this.selectedCreditAmount = options.map(optn => optn.value.creditTotal).reduce((a, b) => a + b, 0);
  }

  resetColors() {

    this.totalByYear.map(val => val.location).forEach(element => {
      document.getElementById("button" + element).style.backgroundColor = "blueviolet";
    });


  }

  changeList(year) {
    this.app.getCreditCategory(year).subscribe(
      resp => {
        this.resetColors();
        document.getElementById("button" + year).style.backgroundColor = "red";
        this.loadYearTotals(year);
        this.selectedDebitAmount = 0;
        this.selectedDebitAmount = 0;
        this.selectedYear = year;
        this.totalByLocation = resp.body;
        this.loadChartData();

      }
    );
  }

  loadChartData() {
    this.barChartLabels = this.totalByLocation.map(val => val.location);

    this.barChartData = [
      { data: this.totalByLocation.sort((a, b) => a.debitTotal - b.debitTotal).map(val => val.debitTotal), label: 'Purchases by Category' },
    ];

    this.app.getCreditDataMonthly(this.selectedYear).subscribe(
      resp => {
        var monthlyData = resp.body;
        this.lineChartData = [
          { data: monthlyData.map(val => val.debitTotal), label: 'Purchases by Month' },
        ];
        this.lineChartLabels = monthlyData.sort((a, b) => a.location.localeCompare(b.location)).map(val => val.location);
      }
    );

  }


  sortList(list: TotalByLocation[], key: string) {
    if (key == 'location') {
      this.totalByLocation.sort(this.compareLocation).reverse();
    } else if (key == 'debit') {
      this.totalByLocation.sort(this.compareDebit).reverse();
    } else if (key == 'visits') {
      this.totalByLocation.sort(this.compareVisits).reverse();
    } else {
      this.totalByLocation.sort(this.compareCredit).reverse();
    }
  }

  compareCredit(a: TotalByLocation, b: TotalByLocation) {
    if (a.creditTotal < b.creditTotal) {
      return -1;
    }
    if (a.creditTotal > b.creditTotal) {
      return 1;
    }
    return 0;
  }

  compareDebit(a: TotalByLocation, b: TotalByLocation) {
    if (a.debitTotal < b.debitTotal) {
      return -1;
    }
    if (a.debitTotal > b.debitTotal) {
      return 1;
    }
    return 0;
  }

  compareLocation(a: TotalByLocation, b: TotalByLocation) {
    if (a.location < b.location) {
      return -1;
    }
    if (a.location > b.location) {
      return 1;
    }
    return 0;
  }

  compareVisits(a: TotalByLocation, b: TotalByLocation) {
    if (a.purchaseList.length < b.purchaseList.length) {
      return -1;
    }
    if (a.purchaseList.length > b.purchaseList.length) {
      return 1;
    }
    return 0;
  }




}