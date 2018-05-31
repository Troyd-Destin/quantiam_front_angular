import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig,MatDialogRef} from "@angular/material";
import { MaterialCreationDialogComponent } from '../material-creation-dialog/material-creation-dialog.component';
import { MaterialService } from '../../services/material/material.service';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';

import { Subject } from 'rxjs';


@Component({
  selector: 'app-material-index',
  templateUrl: './material-index.component.html',
  styleUrls: ['./material-index.component.css']
})
export class MaterialIndexComponent implements OnInit {
  
  selectedMaterialId = null;
  selectedContainerId = null;
  selectedLotId = null;
  _material = null;
  _container = null;
  _lot = null;
  
  
  
  
  constructor(private dialog: MatDialog, private materialService: MaterialService, private materialLotContainerService: MaterialLotContainerService) { }

  ngOnInit() {

    //What material have we been looking at?
    this._material = this.materialService.material$.subscribe(res=> { 
      
       if(typeof res !== 'undefined')  this.selectedMaterialId = res.id;
      
      });
      
      //// Container register thingy
     this._container = this.materialLotContainerService.materialLotContainer$.subscribe( res=>{
       
        if(typeof res !== 'undefined')  this.selectedContainerId = res.id;
       })
      
      //Lot Subscriber code hee
      
      
      
      //Scanner thingy here
       
       
  }
  
  ngOnDestroy()
  {
    this._material.unsubscribe();
    this._container.unsubscribe();
    
  }

  openDialog() {

          const dialogConfig = new MatDialogConfig();

          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = '500px';
          this.dialog.open(MaterialCreationDialogComponent, dialogConfig);
      }
}
