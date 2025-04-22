import { Component, OnInit } from '@angular/core';
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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  templateUrl: './client-details-form.component.html',
  styleUrl: './client-details-form.component.scss',
})
export class AddClientFormComponent implements OnInit{
  clientForm!: FormGroup;
  carForm!: FormGroup;
  phoneNumberControl!: FormControl;
  phoneNumbersArray!: FormArray;
  showClientForm: boolean = true;

  engineTypes: { name: string }[] = [];
  totalCars: ICar[] = [];

  formMode: 'clientAdd' | 'clientEdit' | 'carAdd' | 'carEdit' | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setEngines();

    this.setFormMode();

    if (this.formMode === 'carEdit') {
      this.fillCarDetails();
    } else if (this.formMode === 'clientEdit') {
      this.fillClientDetails();
    }
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

  submit(): void {
    if (this.formMode === 'clientAdd' && this.clientForm.valid) {
      this.formMode = 'carAdd';
    } else if (this.formMode === 'clientEdit' && this.clientForm.valid) {
      this.dialogRef.close({
        ...this.clientForm.value,
        id: this.dialogConfig.data.clientData.id,
        cars: this.dialogConfig.data.clientData.cars.map((car: ICar) => ({
          ...car,
          isCarActive: car.isCarActive,
        })),
        isClientActive: this.dialogConfig.data.clientData.isClientActive,
      });
    } else if (this.formMode === 'carEdit' && this.carForm.valid) {
      this.dialogRef.close({
        ...this.carForm.value,
        id: this.dialogConfig.data.carData.id,
        engineType: this.carForm.get('engineType')?.value.name,
        isCarActive: this.dialogConfig.data.carData.isCarActive,
      });
    }
  }

  /**
   * Adds a car to the total cars added through the form and then resets the form
   */
  addCar(): void {
    this.totalCars.push({
      ...this.carForm.value,
      id: uuidv4(), // create an uuid for each new car pushed
      isCarActive: true, // make true as default
      engineType: this.carForm.get('engineType')?.value.name,
    });
    this.carForm.reset();
  }

  /**
   * Creates a constant to save the final data for the client and emits it to the calling parent
   */
  saveData(): void {
    if (this.formMode === 'carEdit') {
      this.dialogRef.close({
        ...this.carForm.value,
        id: this.dialogConfig.data.carData.id,
        engineType: this.carForm.get('engineType')?.value.name,
        isCarActive: this.dialogConfig.data.carData.isCarActive,
      });
      return;
    }

    const finalClientData = {
      id: uuidv4(),
      firstName: this.clientForm.get('firstName')?.value,
      lastName: this.clientForm.get('lastName')?.value,
      email: this.clientForm.get('email')?.value,
      phoneNumbers: this.clientForm.get('phoneNumbers')?.value,
      cars: structuredClone(this.totalCars), // deep copy array
      isClientActive: true, // make true as default
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

  /**
   * Fill the form with data if the user wants to edit an existing client
   */
  private fillClientDetails(): void {
    if (this.dialogConfig.data.clientData) {
      this.clientForm.patchValue({
        firstName: this.dialogConfig.data.clientData.firstName,
        lastName: this.dialogConfig.data.clientData.lastName,
        email: this.dialogConfig.data.clientData.email,
      });

      this.phoneNumbersArray.clear();
      this.dialogConfig.data.clientData.phoneNumbers.forEach(
        (phoneNumber: string) => {
          this.phoneNumbersArray.push(new FormControl(phoneNumber));
        }
      );
    }
  }

  private fillCarDetails(): void {
    if (this.dialogConfig.data.carData) {
      this.carForm.patchValue({
        licensePlate: this.dialogConfig.data.carData.licensePlate,
        chassis: this.dialogConfig.data.carData.chassis,
        brand: this.dialogConfig.data.carData.brand,
        model: this.dialogConfig.data.carData.model,
        year: this.dialogConfig.data.carData.year,
        engineType: { name: this.dialogConfig.data.carData.engineType },
      });
    }
  }

  private setFormMode(): void {
    if (this.dialogConfig.data?.isClientEdited) {
      this.formMode = 'clientEdit';
      this.fillClientDetails();
    } else if (this.dialogConfig.data?.isCarEdited) {
      this.formMode = 'carEdit';
      this.fillCarDetails();
    } else {
      this.formMode = 'clientAdd';
    }
  }
}
