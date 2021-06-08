import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    MatGridListModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
