import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { CurrencyService } from '../shared/services/currency.service';
import * as moment from 'moment';

Chart.register(...registerables);

interface Currency {
  id: string;
  currencyName: string;
  symbol?: string;
}

@Component({
  selector: 'conversion-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  public currencyList: Currency[] = [];
  public form: FormGroup;
  public showData = false;
  private currentExcange: any = {};

  constructor(
    private currencyService: CurrencyService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.form = this.formBuilder.group({
      fromAmount: 1,
      fromCurrency: null,
      toAmount: 1,
      toCurrency: null,
    });
  }
  canvas: any;
  ctx: any;
  @ViewChild('mychart1') mychart1!: ElementRef;
  @ViewChild('mychart2') mychart2!: ElementRef;

  ngOnInit(): void {
    this.getLisfOfCurrencies();

    this.form.get('fromAmount')?.valueChanges.subscribe((fromAmount) => {
      const fromCurrencyId = this.form.get('fromCurrency')?.value.id;
      const toCurrencyId = this.form.get('toCurrency')?.value.id;
      const query = `${fromCurrencyId}_${toCurrencyId}`;
      this.form
        .get('toAmount')
        ?.setValue((fromAmount * this.currentExcange[query]).toFixed(2), {
          emitEvent: false,
        });
    });

    this.form.get('toAmount')?.valueChanges.subscribe((toAmount) => {
      const fromCurrencyId = this.form.get('fromCurrency')?.value.id;
      const toCurrencyId = this.form.get('toCurrency')?.value.id;
      const query = `${toCurrencyId}_${fromCurrencyId}`;
      this.form
        .get('fromAmount')
        ?.setValue((toAmount * this.currentExcange[query]).toFixed(2), {
          emitEvent: false,
        });
    });

    this.form.get('fromCurrency')?.valueChanges.subscribe((fromCurrency) => {
      const fromCurrencyId = fromCurrency.id;
      const toCurrencyId = this.form.get('toCurrency')?.value.id;
      const toAmount = this.form.get('toAmount')?.value;
      this.convertCurrencies(
        fromCurrencyId,
        toCurrencyId,
        toAmount,
        'fromAmount'
      );
    });

    this.form.get('toCurrency')?.valueChanges.subscribe((toCurrency) => {
      const fromCurrencyId = this.form.get('fromCurrency')?.value.id;
      const toCurrencyId = toCurrency.id;
      const fromAmount = this.form.get('fromAmount')?.value;
      this.convertCurrencies(
        toCurrencyId,
        fromCurrencyId,
        fromAmount,
        'toAmount'
      );
    });
  }

  getLisfOfCurrencies() {
    this.currencyService.getCurrencyList().subscribe((res) => {
      this.currencyList = Object.values(res.results);
      this.currencyList.sort((a, b) => (a.id > b.id ? 1 : -1));
      this.form.get('fromCurrency')?.setValue(
        this.currencyList.find((e) => e.id === 'EUR'),
        { emitEvent: false }
      );
      this.form
        .get('toCurrency')
        ?.setValue(this.currencyList.find((e) => e.id === 'USD'));
      this.showData = true;
    });
  }

  convertCurrencies(
    from: string,
    to: string,
    amount: number,
    targetField: string
  ) {
    const query = `${from}_${to},${to}_${from}`;
    this.currencyService.convertCurrencies(query).subscribe((res) => {
      this.currentExcange = res;
      this.form
        .get(targetField)
        ?.setValue((amount * this.currentExcange[`${to}_${from}`]).toFixed(2), {
          emitEvent: false,
        });
      this.showData = false;
      this.clearCanvas();
    });
  }

  showHistoricalData(fromCurrency: Currency, toCurrency: Currency) {
    this.showData = true;
    const today: Date = new Date();
    // this api provides historical data for 8 days only (for free version)
    const offsetDays = 24 * 60 * 60 * 1000 * 8;
    let startDay: Date = new Date();
    startDay.setTime(startDay.getTime() - offsetDays);
    const startDateForHistoricalData = this.datePipe.transform(
      startDay,
      'yyyy-MM-dd'
    );
    const endDateForHistoricalData = this.datePipe.transform(
      today,
      'yyyy-MM-dd'
    );
    const fromQuery = `${fromCurrency.id}_${toCurrency.id}`;
    const toQuery = `${toCurrency.id}_${fromCurrency.id}`;
    const query = `${fromQuery},${toQuery}`;
    this.currencyService
      .showHistoricalData(
        query,
        startDateForHistoricalData!,
        endDateForHistoricalData!
      )
      .subscribe((res) => {
        this.createCharts(
          res,
          this.mychart1.nativeElement,
          fromQuery,
          fromCurrency,
          toCurrency
        );
        this.createCharts(
          res,
          this.mychart2.nativeElement,
          toQuery,
          toCurrency,
          fromCurrency
        );
      });
  }

  clearCanvas() {
    let myChart1 = Chart.getChart('myChart1');
    let myChart2 = Chart.getChart('myChart2');
    if (myChart1 != undefined) {
      myChart1.destroy();
    }
    if (myChart2 != undefined) {
      myChart2.destroy();
    }
  }

  private createCharts(
    response: any,
    ctx: any,
    query: string,
    fromCurrency: Currency,
    toCurrency: Currency
  ) {
    this.showData = true;
    // const ctx = this.mychart1.nativeElement;
    const labels = Object.keys(response[query]).map((e) =>
      moment(e).format('L')
    );
    const values = Object.values(response[query]);
    // console.log(labels1);
    // console.log(values1);
    return new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${fromCurrency.currencyName} to ${toCurrency.currencyName}`,
            data: values,
            fill: true,
            backgroundColor: 'rgba(63, 81, 181, 0.3)',
            borderColor: 'rgb(63, 81, 181)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            title: {
              text: `1 ${fromCurrency.id} to ${toCurrency.id}`,
              display: true,
            },
          },
        },
      },
    });
  }
}
