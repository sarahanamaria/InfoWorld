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
import { v4 as uuidv4 } from 'uuid';

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

  showCarForm(): void {
    if (this.clientForm.valid) {
      this.showClientForm = false;
    }
  }

  /**
   * Adds a car to the total cars added through the form and then resets the form
   */
  addCar(): void {
    this.totalCars.push({
      ...this.carForm.value,
      id: uuidv4(), // create an uuid for each new car pushed
      engineType: this.carForm.get('engineType')?.value.name,
    });
    this.carForm.reset();
  }

  /**
   * Creates a constant to save the final data for the client and emits it to the calling parent
   */
  saveClientData(): void {
    const finalClientData = {
      id: uuidv4(),
      firstName: this.clientForm.get('firstName')?.value,
      lastName: this.clientForm.get('lastName')?.value,
      email: this.clientForm.get('email')?.value,
      phoneNumbers: this.clientForm.get('phoneNumbers')?.value,
      cars: structuredClone(this.totalCars), // deep copy array
      isUserActive: true, // make true as default
    };

    this.dialogRef.close(finalClientData);
  }

  /**
   * Init both the client and the car form with empty values
   */
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

  /**
   * Define engine types for dropdown
   */
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
