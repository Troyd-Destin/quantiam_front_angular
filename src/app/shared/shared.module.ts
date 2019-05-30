import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';


import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { FileDropModule } from 'ngx-file-drop';
import { AgGridModule } from 'ag-grid-angular';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';

import { Select2Module } from 'ng2-select2';
import { Select2MaterialComponent } from './select2-material/select2-material.component';
import { Select2MaterialLotComponent } from './select2-material-lot/select2-material-lot.component';
import { Select2LocationComponent } from './select2-location/select2-location.component';
import { Select2MaterialSupplierComponent } from './select2-material-supplier/select2-material-supplier.component';
import { Select2UserComponent } from './select2-user/select2-user.component';
import { Select2MaterialLotContainerComponent } from './select2-material-lot-container/select2-material-lot-container.component';

import { SelectProjectComponent } from './select-project/select-project.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { SelectExperimentComponent } from './select-experiment/select-experiment.component';
import { SelectMaterialContainerComponent } from './select-material-container/select-material-container.component';
import { SelectSampleComponent } from './select-sample/select-sample.component';
import { SelectExperimentTypeComponent } from './select-experiment-type/select-experiment-type.component';
import { SelectTgarunComponent } from './select-tgarun/select-tgarun.component';
import { SelectPermissionComponent } from './select-permission/select-permission.component';
import { SelectGroupComponent } from './select-group/select-group.component';
import { AgGridSelectProjectEditorComponent } from './ag-grid-select-project/ag-grid-select-project.component';
import { AgGridSelectUserComponent } from './ag-grid-select-user/ag-grid-select-user.component';
import { SelectSemrunTypeComponent } from './select-semrun-type/select-semrun-type.component';

import { AgGridSemTypeComponent } from '../sem/sem-database/ag-grid-sem-type/ag-grid-sem-type.component';
import { SelectMaterialComponent } from './select-material/select-material.component';
import { SelectMaterialSupplierComponent } from './select-material-supplier/select-material-supplier.component';
import { AgGridDurationComponent } from './ag-grid-duration/ag-grid-duration.component';
import { AgGridSelectSteelOrContainerComponent } from './ag-grid-select-steel-or-container/ag-grid-select-steel-or-container.component';

@NgModule({
    imports: [
        AgGridModule.withComponents([AgGridSelectProjectEditorComponent, AgGridSelectUserComponent, AgGridSemTypeComponent, AgGridDurationComponent]),
        CommonModule,
        Select2Module,
        NgSelectModule,
        FormsModule,
        FlexLayoutModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        FileDropModule,
    ],
    declarations: [
        SelectProjectComponent,
        Select2MaterialComponent,
        Select2MaterialLotComponent,
        Select2LocationComponent,
        Select2MaterialSupplierComponent,
        Select2UserComponent,
        Select2MaterialLotContainerComponent,
        SelectUserComponent,
        SelectExperimentComponent,
        SelectMaterialContainerComponent,
        SelectSampleComponent,
        SelectExperimentTypeComponent,
        SelectTgarunComponent,
        SelectPermissionComponent,
        SelectGroupComponent,
        AgGridSelectProjectEditorComponent,
        AgGridSelectUserComponent,
        AgGridSemTypeComponent,
        SelectSemrunTypeComponent,
        SelectMaterialComponent,
        SelectMaterialSupplierComponent,
        AgGridDurationComponent,
        AgGridSelectSteelOrContainerComponent,
        
    ],
    exports: [
        SelectMaterialSupplierComponent,
        SelectMaterialComponent,
        SelectSemrunTypeComponent,
        Select2MaterialComponent,
        Select2MaterialLotComponent,
        Select2MaterialSupplierComponent,
        Select2LocationComponent,
        Select2UserComponent,
        SelectProjectComponent,
        SelectUserComponent,
        SelectExperimentComponent,
        SelectMaterialContainerComponent,
        SelectSampleComponent,
        SelectTgarunComponent,
        SelectPermissionComponent,
        FileDropModule,
        AgGridModule

    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}