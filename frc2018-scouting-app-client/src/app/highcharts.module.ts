import { NgModule } from '@angular/core';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';

import * as Highcharts from 'highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as boostCanvas from 'highcharts/modules/boost-canvas';
import * as boost from 'highcharts/modules/boost.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as heatmap from 'highcharts/modules/heatmap.src.js';
import * as noDataToDisplay from 'highcharts/modules/no-data-to-display.src';
import * as offlineExporting from 'highcharts/modules/offline-exporting.src';

@NgModule({
  exports: [ChartModule],
  providers: [
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [
        boostCanvas, 
        boost, 
        noDataToDisplay, 
        more
      ]
    }
  ]
})
export class HighchartsModule {
  constructor() {
    const globalOptions: Highcharts.GlobalObject = {
      // http://api.highcharts.com/highstock/global.timezoneOffset
      timezoneOffset: new Date().getTimezoneOffset()
    };

    Highcharts.setOptions({
      global: globalOptions
    });
  }
}