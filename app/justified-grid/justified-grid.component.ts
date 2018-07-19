import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';


/**
 * Renders items in a justified grid with a
 * "Google Photos"-style photo distribution algorithm
 *
 * items must implement ArrangeableItem interface
 * item rendering is fully customizable by itemTemplate
 *
 * items = [
 *   {width: 100, height: 300, name: 'red'},
 *   {width: 200, height: 400, name: 'blue'}
 * ];
 *
 * <justified-grid [items]="items" [itemTemplate]="demoItemTemplate">
 *   <ng-template #demoItemTemplate let-item="item" let-index="index">
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
  selector: 'justified-grid',
  templateUrl: './justified-grid.component.html',
  styleUrls: ['./justified-grid.component.scss']
})
export class JustifiedGridComponent implements AfterViewInit, OnDestroy {

  @Input() idealRowHeight = 150;
  @Input() minRowHeight = 130;
  @Input() maxRowHeight = 200;

  @Input() items: ArrangeableItem[];
  @Input() itemTemplate: ElementRef;

  rows: ArrangedItem[][] = [];

  private resizeSubscription: Subscription;

  @ViewChild('galleryContainer') container: ElementRef;

  constructor() {
  }

  ngAfterViewInit() {
    setTimeout(() => this.arrange(), 0);
    this.resizeSubscription = fromEvent(window, 'resize').subscribe( () => this.arrange());
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  arrange( previousRowWidth ?: number) {
    const totalRowWidth = this.container.nativeElement.clientWidth - 1;

    // do not rearrange if the row width has been stabilized
    if (previousRowWidth === totalRowWidth) {
      return;
    }

    const resizeItem = (it: ArrangeableItem, height: number, index: number): ArrangedItem => {
      const ratio = height / it.height;
      return {
        resizedWidth: it.width * ratio,
        resizedHeight: height,
        item: it,
        index: index
      };
    };

    const startNewRow = () => {
      const row: ArrangedItem[] = [];
      this.rows.push(row);
      currentRow = row;
      currentRowWidth = 0;
    };

    const addItemToCurrentRow = (it: ArrangedItem) => {
      currentRow.push(it);
      currentRowWidth += it.resizedWidth;
      currentItemIndex++;
    };

    const updateCurrentRow = ( row: ArrangedItem[] ) => {
      this.rows[this.rows.length - 1] = row;
    };

    this.rows = [];
    const arrangedItems = this.items.map((it, index) => resizeItem(it, this.idealRowHeight, index));

    let currentItemIndex = 0;
    let currentRow = [];
    let currentRowWidth = 0;

    startNewRow();

    while (currentItemIndex < arrangedItems.length) {

      const currentItem: ArrangedItem = arrangedItems[currentItemIndex];
      const newWidth = currentRowWidth + currentItem.resizedWidth;

      // Can we append it in the current row at ideal row height without changing aspect ratio?
      // If yes: append it
      if (newWidth <= totalRowWidth) {
        addItemToCurrentRow(currentItem);
        continue;
      }

      // If not: can we shrink the current row height to fit the photo?
      // (Or is it going to be lower than min row height?)
      // If yes: shrink it, add the photo, and continue adding photos in a new line
      const reduceRatio = totalRowWidth / newWidth;
      const reducedRowHeight = this.idealRowHeight * reduceRatio;
      if (reducedRowHeight >= this.minRowHeight) {
        addItemToCurrentRow(currentItem);
        updateCurrentRow( currentRow.map(it => resizeItem(it.item, reducedRowHeight, it.index)));
        startNewRow();
        continue;
      }

      // If not: try to grow the height of line to fill the space horizontally
      // (until max row height), go to the next row and try to process the photo again
      // (go back to the beginning of loop).

      const enlargeRatio = totalRowWidth / currentRowWidth;
      const enlargedRowHeight = this.idealRowHeight * enlargeRatio;
      if (enlargedRowHeight <= this.maxRowHeight) {
        updateCurrentRow( currentRow.map(it => resizeItem(it.item, enlargedRowHeight, it.index)));
        startNewRow();
        continue;
      }

      // If the row is empty, we also won't be able to add this image to the next row,
      // We simply add it as a full-width image
      if (currentRow.length === 0) {
        addItemToCurrentRow({
          resizedWidth: totalRowWidth,
          resizedHeight: totalRowWidth / currentItem.resizedWidth * currentItem.resizedHeight,
          item: currentItem.item,
          index: currentItem.index
        });
        startNewRow();
      }

      // If none of these works, leave the current row as it is and simply start a new row
      startNewRow();
    }

    // render and then rearrange if the row width is not stable
    // e.g. if a scroll bar appears, that can reduce available width
    setTimeout( () => this.arrange(totalRowWidth));
  }
}
