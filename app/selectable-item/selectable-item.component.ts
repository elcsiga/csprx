import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';


/**
 * Renders items in a justified grid
 * items must implement ArrangeableItem interface
 * item rendering is fully customizable by itemTemplate
 *
 * items = [
 *   {width: 100, height: 300, name: 'red'},
 *   {width: 200, height: 400, name: 'blue'}
 * ];
 *
 * <justified-grid [items]="items" [itemTemplate]="demoItem">
 *   <ng-template #demoItem let-item="item" let-index="index">
 *     <div>
 *       #{{index}} #{{item.name}}
 *     </div>
 *   </ng-template>
 * </justified-grid>
 */

export interface ArrangeableItem {
  width: number;
  height: number;
}

interface ArrangedItem {
  resizedWidth: number;
  resizedHeight: number;
  item: ArrangeableItem;
  index: number;
}

@Component({
  selector: 'selectable-item',
  templateUrl: './selectable-item.component.html',
  styleUrls: ['./selectable-item.component.scss']
})
export class SelectableItemComponent {

  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter();

  onChange( $event ) {
    this.selectedChange.emit($event.target.checked);
  };
}
