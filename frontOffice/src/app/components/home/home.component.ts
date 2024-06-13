import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../services/http/statistics/statistics.service';

interface CounterAreaNumbers {
  numDonors: Number,
  numEntities: Number,
  numDonations: Number,
  numItems: Number
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: [
    'home.component.css',
    './styles/magnific-popup.css'
    // './styles/slicknav.css'
  ]
})
export class HomeComponent implements OnInit {

  counterAreaNumbers = {} as CounterAreaNumbers;

  constructor(
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
    this.statisticsService.getNumbers().subscribe({
      next: (data) => {
        this.counterAreaNumbers = data;
      },
      error: (err) => {
        console.log("Erro ao ler estatísticas");
      },
      complete: () => {
          console.log(this.counterAreaNumbers)
      },
    });
  } 

}
