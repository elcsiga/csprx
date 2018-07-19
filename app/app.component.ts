import {Component} from '@angular/core';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  items = [];

  constructor() {
    for (let i = 0; i < 50; i++) {
      this.items.push({
        width: 500 + Math.floor(Math.random() * 200 ),
        height: 300 + Math.floor(Math.random() * 200 ),
        selected: true,
        color: `rgb(${150 + Math.floor(Math.random() * 100)},${150 + Math.floor(Math.random() * 100)},${150 + Math.floor(Math.random() * 100)})`
      });
    }
  }

  selectItem(index: number, selected: boolean) {
    this.items[index].selected = selected;

    console.log(this.items[0]);
  }
}
