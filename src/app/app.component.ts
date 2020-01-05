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
  totalAmount: number;
  selectedAmount: number;
  selectedYear: string;
  totalByYear: TotalByLocation[];
  checked: boolean = false;


  constructor(private app: DownstreamService) { }

  ngOnInit() {

    /**
     *   
     * 
     */

    this.app.getCreditMapYear().subscribe(
      resp => {
        this.totalByYear = resp.body;
        this.selectedYear = this.totalByYear[0].location;
        this.changeList(this.totalByYear[0].location);
      }
    );

  }



  onLocationSelect(options: MatListOption[]) {
    this.selectedAmount = options.map(optn => optn.value.creditTotal).reduce((a, b) => a + b, 0);
  }

  changeList(year) {
    this.app.getCreditMapLocation(year).subscribe(
      resp => {
        this.selectedYear = year;
        this.totalByLocation = resp.body;
        this.totalAmount = this.totalByLocation.map(row => row.creditTotal).reduce((a, b) => a + b, 0);
      }
    );
  }

  sortList(list: TotalByLocation[], key: string) {
    if (key == 'location') {
      this.totalByLocation.sort(this.compareLocation);
    } else {
      this.totalByLocation.sort(this.compareCredit);
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

  compareLocation(a: TotalByLocation, b: TotalByLocation) {
    if (a.location < b.location) {
      return -1;
    }
    if (a.location > b.location) {
      return 1;
    }
    return 0;
  }



}
