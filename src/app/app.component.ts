import { Component, OnInit } from '@angular/core';
import { DownstreamService } from './downstream.service';
import { TotalByLocation } from './total-by-location';
import { MatListOption } from '@angular/material/list';


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

  constructor(private app: DownstreamService) { }

  ngOnInit() {
    this.app.getCreditMapYearLocal().subscribe(
      resp => {
        this.totalByYear = resp.body;
        this.totalByYear.sort((a,b)=> a.location.localeCompare(b.location));
        this.selectedYear = this.totalByYear[0].location;
        this.totalDebitAmount = this.totalByYear.map(row => row.debitTotal).reduce((a, b) => a + b, 0);
        this.totalCreditAmount = this.totalByYear.map(row => row.creditTotal).reduce((a, b) => a + b, 0);
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

  changeList(year) {
    this.app.getCreditCategory(year).subscribe(
      resp => {
        this.loadYearTotals(year);
        this.selectedDebitAmount = 0;
        this.selectedDebitAmount = 0;
        this.selectedYear = year;
        this.totalByLocation = resp.body;
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