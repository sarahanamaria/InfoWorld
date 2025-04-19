import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICar } from '@models/car.model';
import { EngineTypeEnum } from 'enums/engine-type.enum';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-add-client-form',
  imports: [
    FloatLabel,
    ReactiveFormsModule,
    InputText,
    TagModule,
    Button,
    Tooltip,
    SelectModule,
  ],
  templateUrl: './add-client-form.component.html',
  styleUrl: './add-client-form.component.scss',
})
export class AddClientFormComponent {
  clientForm!: FormGroup;
  carForm!: FormGroup;
  phoneNumberControl!: FormControl;
  phoneNumbersArray!: FormArray;
  showClientForm: boolean = true;

  engineTypes: { name: string }[] = [];
  totalCars: ICar[] = [];

  constructor(private fb: FormBuilder, private dialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.initForm();
    this.setEngines();
  }

  addPhoneNumber(): void {
    const number = this.phoneNumberControl?.value.trim();
    if (number) {
      this.phoneNumbersArray.push(new FormControl(number));
      this.phoneNumberControl.setValue('');
    }
  }

  removePhoneNumber(index: number): void {
    this.phoneNumbersArray.removeAt(index);
  }

  submitClient(): void {
    if (this.clientForm.valid) {
      this.showClientForm = false;
    }
  }

  addCar(): void {
    this.totalCars.push({...this.carForm.value, engineType: this.carForm.get('engineType')?.value.name});
    this.carForm.reset();
  }

  saveClientData(): void {

    console.log(this.totalCars)
  }

  private initForm(): void {
    this.phoneNumbersArray = this.fb.array([]);
    this.phoneNumberControl = this.fb.control('', Validators.minLength(10));

    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: this.phoneNumberControl,
      phoneNumbers: this.phoneNumbersArray,
    });

    this.carForm = this.fb.group({
      licensePlate: ['', Validators.required],
      chassis: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      engineType: ['', Validators.required],
    });
  }

  private setEngines(): void {
    this.engineTypes = [
      {
        name: EngineTypeEnum.Gasoline,
      },
      {
        name: EngineTypeEnum.Diesel,
      },
      {
        name: EngineTypeEnum.Hybrid,
      },
      {
        name: EngineTypeEnum.Electric,
      },
    ];
  }
}
