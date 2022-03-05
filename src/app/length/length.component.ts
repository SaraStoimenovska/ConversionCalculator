import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lengthList } from './length-contants';

export interface Length {
  name: string;
  shortName: string;
  value: number;
}

@Component({
  selector: 'conversion-currency',
  templateUrl: './length.component.html',
  styleUrls: ['./length.component.scss'],
})
export class LengthComponent {
  public lengthList: Length[] = lengthList;
  public form: FormGroup;
  private readonly METER: string = 'm';

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fromValue: [1, [Validators.required, Validators.min(0)]],
      fromUnit: [null, [Validators.required]],
      toValue: [1, [Validators.required, Validators.min(0)]],
      toUnit: [null, [Validators.required]],
    });
  }

  lengthConverter(
    fromValue: number,
    toValue: string,
    fromUnit: Length,
    toUnit: Length
  ) {
    const from = this.lengthList.find((e) => e.name === fromUnit?.name);
    const to = this.lengthList.find((e) => e.name === toUnit?.name);
    if (!from || !to) {
      return;
    }
    if (fromUnit.shortName === this.METER) {
      this.form
        .get(toValue)
        ?.setValue(fromValue * fromUnit.value * toUnit.value, {
          emitEvent: false,
        });
    } else {
      const meter = this.lengthList.find((e) => e.shortName === this.METER);
      if (!meter) {
        return this.form.get(toValue)?.setValue(0, { emitEvent: false });
      }
      return this.form
        .get(toValue)
        ?.setValue(
          (fromValue * (meter?.value / fromUnit.value) * toUnit.value).toFixed(
            2
          ),
          { emitEvent: false }
        );
    }
  }
}
