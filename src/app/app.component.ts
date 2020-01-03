import { Component, OnInit } from '@angular/core';
import { DownstreamService } from './downstream.service';
import { TotalByLocation } from './total-by-location';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  totalByLocation: TotalByLocation[];
  totalAmount: number;


  constructor(private app: DownstreamService) { }

  ngOnInit() {


    this.app.getCreditMap().subscribe(
      resp => {
        this.totalByLocation = resp.body;
        this.totalAmount = this.totalByLocation.map(row => row.creditTotal).reduce((a, b) => a + b, 0);
      }
    );


  }



}
