import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatButtonModule, MatExpansionModule, MatListModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ListComponent} from './list/list.component';
import { MediaGalleryComponent } from './media-gallery/media-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    MediaGalleryComponent
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
