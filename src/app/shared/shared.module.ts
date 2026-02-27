import { NgModule } from '@angular/core';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [PaginationComponent],
  exports: [PaginationComponent],
})
export class SharedModule {}
