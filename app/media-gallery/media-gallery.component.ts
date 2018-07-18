import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {hostElement} from '@angular/core/src/render3/instructions';
import {fromEvent, Subscription} from 'rxjs';

interface Item {
  width: number;
  height: number;
  color: string;
}


interface ArrangedItem {
  width: number;
  height: number;
  item: Item;
}

@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.css']
})
export class MediaGalleryComponent implements AfterViewInit, OnDestroy {

  @Input() idealRowHeight = 150;
  @Input() minRowHeight = 130;
  @Input() maxRowHeight = 200;

  @Input() items: Item[];

  rows: ArrangedItem[][] = [];

  private resizeSubscription: Subscription;

  @ViewChild('galleryContainer') container: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => this.arrange(), 0);
    this.resizeSubscription = fromEvent(window, 'resize').subscribe( () => this.arrange());
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  arrange() {
    const totalRowWidth = this.container.nativeElement.clientWidth - 1;

    const resizeItem = (it: Item, height: number): ArrangedItem => {
      const ratio = height / it.height;
      return {
        width: it.width * ratio,
        height: height,
        item: it
      }
    }

    const startNewRow = () => {
      const r: ArrangedItem[] = [];
      this.rows.push(r);
      currentRow = r;
      currentRowWidth = 0;
    }

    const addItemToCurrentRow = (it: ArrangedItem) => {
      currentRow.push(it);
      currentRowWidth += it.width;
      currentItemIndex++;
    }

    const updateCurrentRow = ( row: ArrangedItem[] ) => {
      this.rows[this.rows.length-1] = row;
    }

    this.rows = [];
    const arrangedItems = this.items.map(it => resizeItem(it, this.idealRowHeight));

    let currentItemIndex = 0;
    let currentRow;
    let currentRowWidth;

    startNewRow();

    while (currentItemIndex < arrangedItems.length) {

      const currentItem: ArrangedItem = arrangedItems[currentItemIndex];
      const newWidth = currentRowWidth + currentItem.width;

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
        updateCurrentRow( currentRow.map(it => resizeItem(it.item, reducedRowHeight)));
        startNewRow();
        continue;
      }

      // If not: try to grow the height of line to fill the space horizontally
      // (until max row height), go to the next row and try to process the photo again
      // (go back to the beginning of loop).

      const enlargeRatio = totalRowWidth / currentRowWidth;
      const enlargedRowHeight = this.idealRowHeight * enlargeRatio;
      if (enlargedRowHeight <= this.maxRowHeight) {
        updateCurrentRow( currentRow.map(it => resizeItem(it.item, enlargedRowHeight)));
        startNewRow();
        continue;
      }

      // If the row is empty, we also won't be able to add this image to the next row,
      // We simply add it as a full-width image
      if (currentRow.length == 0) {
        addItemToCurrentRow({
          width: totalRowWidth,
          height: totalRowWidth / currentItem.width * currentItem.height,
          item: currentItem.item
        });
        startNewRow();
      }

      // If none of these works, leave the current row as it is and simply start a new row
      startNewRow();
    }
  }

  constructor() {
  }


  getStyle(arrangedItem: ArrangedItem) {
    return {
      'width.px': arrangedItem.width,
      'height.px': arrangedItem.height,
      'background-color': arrangedItem.item.color,
    };
  }
}
