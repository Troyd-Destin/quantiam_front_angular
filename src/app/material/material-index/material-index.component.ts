import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig,MatDialogRef} from "@angular/material";
import { MaterialCreationDialogComponent } from '../material-creation-dialog/material-creation-dialog.component';
import { MaterialService } from '../../services/material/material.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-material-index',
  templateUrl: './material-index.component.html',
  styleUrls: ['./material-index.component.css']
})
export class MaterialIndexComponent implements OnInit {
  
  selectedMaterialId = null;
  _material = null
  
  constructor(private dialog: MatDialog, private materialService: MaterialService) { }

  ngOnInit() {

  
    this._material = this.materialService.material$.subscribe(res=> { 
      
       if(typeof res !== 'undefined')  this.selectedMaterialId = res.id;
      
      });
  }
  
  ngOnDestroy()
  {
    this._material.unsubscribe();
    
  }

  openDialog() {

          const dialogConfig = new MatDialogConfig();

          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = '500px';
          this.dialog.open(MaterialCreationDialogComponent, dialogConfig);
      }
}
