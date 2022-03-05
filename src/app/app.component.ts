import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
  selector: 'conversion-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'conversion-calculator';
  loading$;
  
  constructor(public spinner: SpinnerService) {
    this.loading$ = this.spinner.loading$;

  }
  
  ngOnInit() {

  }  
}
