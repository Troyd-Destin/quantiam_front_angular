import { Component, EventEmitter, Input, Output}  from '@angular/core';

@Component({
  selector: 'app-aggrid-active',
  templateUrl: './aggrid-active.component.html',
  styleUrls: ['./aggrid-active.component.css']
})
export class AggridActiveComponent {

  @Input() cell: any;
    @Output() onClicked = new EventEmitter<boolean>();

    click(): void {
        this.onClicked.emit(this.cell);
    }
}
