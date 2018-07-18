import {Component} from '@angular/core';

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
        width: 500 + Math.floor( Math.random() * 200 ),
        height: 300 + Math.floor(Math.random() * 200 ),
        color: `rgb(${100+Math.floor(Math.random() * 100)},${100+Math.floor(Math.random() * 100)},${100+Math.floor(Math.random() * 100)})`
      })
    }
  }
}
