import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatButtonModule, MatExpansionModule, MatListModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ListComponent} from './list/list.component';
import {JustifiedGridComponent} from './justified-grid/justified-grid.component';
import {SelectableItemComponent} from './selectable-item/selectable-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    JustifiedGridComponent,
    SelectableItemComponent
  ],
  imports: [
    BrowserModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule
  ],
  providers: [],
  entryComponents: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
