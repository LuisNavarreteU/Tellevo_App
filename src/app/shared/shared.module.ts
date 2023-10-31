import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateSalidaComponent } from './components/add-update-salida/add-update-salida.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    AddUpdateSalidaComponent  
    ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    AddUpdateSalidaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
