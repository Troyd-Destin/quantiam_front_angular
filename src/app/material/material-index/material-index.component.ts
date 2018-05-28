import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig,MatDialogRef} from "@angular/material";
import { MaterialCreationDialogComponent } from '../material-creation-dialog/material-creation-dialog.component';
import { MaterialService } from '../../services/material/material.service';


@Component({
  selector: 'app-material-index',
  templateUrl: './material-index.component.html',
  styleUrls: ['./material-index.component.css']
})
export class MaterialIndexComponent implements OnInit {
  
  selectedMaterialId;
  subscription;

  constructor(private dialog: MatDialog, private material: MaterialService) { }

  ngOnInit() {
    
    
    this.subscription = this.material.get().subscribe(
    
      res =>{
          console.log(res);
        this.selectedMaterialId = res.id;
      }
     )
    
    
  }

openDialog() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '500px';
        this.dialog.open(MaterialCreationDialogComponent, dialogConfig);
    }
}
