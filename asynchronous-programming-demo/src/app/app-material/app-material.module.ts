import { NgModule } from '@angular/core';

import {
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class AppMaterialModule { }
