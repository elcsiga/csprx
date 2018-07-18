import {Component, ElementRef, Input} from '@angular/core';

@Component({
  selector: 'flexible-list',
  template: `
    <ul>
      <li *ngFor="let item of items; let i = index">
        <ng-container *ngTemplateOutlet="listItemTemplate;context:item">
        </ng-container>

        <ng-container *ngIf="!listItemTemplate">
          {{item}}
        </ng-container>
      </li>
    </ul>
`})
export class ListComponent {
  @Input() items: any[];
  @Input() listItemTemplate: ElementRef;
}
