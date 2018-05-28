import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormBuilder, FormGroup }   from '@angular/forms';

@Component({
  selector: 'app-material-creation-dialog',
  templateUrl: './material-creation-dialog.component.html',
  styleUrls: ['./material-creation-dialog.component.css']
})
export class MaterialCreationDialogComponent implements OnInit {

      form: FormGroup;
    description:string;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MaterialCreationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

      //  this.description = data.description;
    }

    ngOnInit() {
        this.form = this.fb.group({
            description: [this.description, []],
           
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

}
