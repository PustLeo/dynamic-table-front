import {NgModule} from "@angular/core";
import {DynamicTableComponent} from "./dynamic-table/dynamic-table.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MinTableSizeDirective} from "./utils/min-table-size.directive";
import {HeadersRowComponent} from "./headers-row/headers-row.component";
import {FiltersRowComponent} from "./filters-row/filters-row.component";
import {SettingsRowComponent} from "./settings-row/settings-row.component";
import {ElementsContainerComponent} from "./elements-container/elements-container.component";
import {ElementRowComponent} from "./element-row/element-row.component";
import {FilterEntityComponent} from "./filter-entity/filter-entity.component";
import {FILTERS} from "./filters/filters.const";
import {SharedModule} from "@hospital/shared-module";

@NgModule({
  declarations: [
    DynamicTableComponent,
    MinTableSizeDirective,
    HeadersRowComponent,
    FiltersRowComponent,
    SettingsRowComponent,
    ElementsContainerComponent,
    ElementRowComponent,
    FilterEntityComponent,
    ...FILTERS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    DynamicTableComponent,
  ],
  providers: []
})
export class DynamicTableModule {}
