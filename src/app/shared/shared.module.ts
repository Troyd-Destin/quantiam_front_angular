import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng2-select2';
import { Select2MaterialComponent } from './select2-material/select2-material.component';

@NgModule({
  imports: [
    CommonModule,
    Select2Module,
  ],
  declarations: [Select2MaterialComponent],
  exports:[
    Select2MaterialComponent,
    
  ],
})
export class SharedModule { }
