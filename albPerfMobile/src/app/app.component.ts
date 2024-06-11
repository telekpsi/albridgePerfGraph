import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IAlbridgePerformanceElementProperties {
  columnWidth: string;
  identifierForDisplay?: string;
  header?: string;
  identifierType?: string;
  selectedPeriod?: string;  
  breakdownLevel?: string;
  includeNetContribution?: string;
  includeReturn?: string;
  includeReturnBarGraph?: string;
  includeTotalValue?: string;
  includeTimePeriod?: string;
  includeDataTable?: string;
  includeInvestmentLineOnValueChart?: string;
  dateFormat?: string;
  orientation ?: string;
  deviceType?: string;
  selectedDashlet?: string;   
  includeValueGraph?: string;
  valueGraphType?: string;
  includeBenchmarksOnChart?: string;
  calculationMethod?: string;
  includeAssignedAccountBenchmark?: string;   
  columnsOnDataTable?:ColumnsOnDataTable[];
  subPeriodsData?: string;
  carveoutsDisplayOptions?: string;
  includeManualAccounts?: string;
  includeExternalAccounts?: string;
  performanceReturnDecimals?: string;
  columnLock?: string;
  isInvokedFromRB?: string;
  width?: string;
  fontSize?: string;   
  portfolioName?: string; 
  accountInformationToShow?: AccountInformationToShow[];
  managedAccountsFlag?: string;
  recentManagerReturns?: string;
  excludeUnmanagedAccounts?: string;
  showHoldingsChart ?:  string;
  chartColors ?: string[];   
  chartType ?: string;
  noOfRowsToDisplay ?: string;
  tableWidthAllocation ?: string;
  chartHeaderText ?: string;
  chartFooterText ?: string;
  chartSize ?: string;
  showHeaderSection ?: string;
  showTimePeriod ?: string;
  showChartTooltip ?: string;
  sortItems ?: string[]; //['endValue']  //['assetName', 'endValue']
  sortOrder ?: string[]; //['DESC']   ['ASC', 'DESC']   
  disclosures?:boolean;  
}

export enum ColumnsOnDataTable{
  timePeriod= 'timePeriod',
  beginningValue= 'beginningValue',
  netContribution = 'netContribution',
  changeInValue= 'changeInValue',
  endingValue= 'endingValue',
  return = 'return',
  benchmark1Return= 'benchmark1Return',
  diff1= 'diff1',
  benchmark2Return = 'benchmark2Return',
  diff2= 'diff2'
}

export enum AccountInformationToShow{
  accountNumber= 'accountNumber',
  accountType= 'accountType',
  managedAccountManagerName = 'managedAccountManagerName',
  managedAccountProgramName= 'managedAccountProgramName',
  managedAccountStyle= 'managedAccountStyle',
  managedAccountType = 'managedAccountType'
}

export interface IAlbridgePerfSettings{
  albridgePerformanceApiUrl: string;
  graphScriptUrl: string;
  basePath: string;
  pageName: string;
  pageId: string;
  albridgePerfDateRange: IAlbridgePerfDateRange;
  aggregated: string;
  albridgeGraphHeader: string;
  client_id: string;
  client_secret: string;
  graphScroll: boolean;
  isAlbridgeDisclosure: boolean;
}

export interface IAlbridgePerfDateRange{
  inceptionToDate?: string[];
  oneMonthTrailing?: string[];
  threeMonthTrailing?: string[];
  oneYearTrailing?: string[];
  twoYearTrailing?: string[];
  threeYearTrailing?: string[];
  fiveYearTrailing?: string[];
  tenYearTrailing?: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'albPerfMobile';
  token = "";
  investorId = "1000034333295";
  identifierForDisplay = "";
  isSectionAreaShow = "";
  albridgePerfSettings = {
    "aggregated": "Aggregated",
    "albridgeGraphHeader": "Annualized Rate of Return",
    "albridgePerfDateRange": {
      "inceptionToDate": [
        "Since Inception",
        "SINCE_START_DATE"
      ],
      "threeMonthTrailing": [
        "Three Month Trailing",
        "THREE_MONTH_TRAILING"
      ],
      "oneYearTrailing": [
        "One Year Trailing",
        "ONE_YEAR_TRAILING"
      ],
      "threeYearTrailing": [
        "Three Year Trailing",
        "THREE_YEAR_TRAILING"
      ]
    },
    "albridgePerformanceApiUrl": "https://api.nonprod.adviceworks.net/acp-prc-int-uat",
    "basePath": "https://stgavnws.albridge.com",
    "client_id": "4fc4a92d4b3746a681f5bc6ac5ce3249",
    "client_secret": "5e8b40968d4448bBB4a570a831380eCb",
    "graphScriptUrl": "https://xat-www.pllcfiles.inautix.com/staticartifacts/@pershing/wri-portfolio-value-and-benchmark@14.0.59/wri-portfolio-value-and-benchmark-es2020.js",
    "graphScroll": true,
    "isAlbridgeDisclosure": false,
    "pageId": "SVwVmhrrMA9BKeuAtDz91587686210685",
    "pageName": "pssreport"
  };
  dateRange;
  albridgeList = [];
  dateRangeOptions: {displayName: string, argumentName: string}[];

  constructor(private http: HttpClient) {
    this.dateRangeOptions = [];
    const range = this.albridgePerfSettings.albridgePerfDateRange;
    if(range.threeMonthTrailing) {
      this.dateRangeOptions.push({displayName: "3M", 
        argumentName: range.threeMonthTrailing[1]});
    }
    if(range.oneYearTrailing) {
      this.dateRangeOptions.push({displayName: "1Y", 
        argumentName: range.oneYearTrailing[1]});
    }
    if(range.threeYearTrailing) {
      this.dateRangeOptions.push({displayName: "3Y", 
        argumentName: range.threeYearTrailing[1]});
    }
    if(range.inceptionToDate) {
      this.dateRangeOptions.push({displayName: "All", 
        argumentName: range.inceptionToDate[1]});
    }
    this.dateRange = this.dateRangeOptions[this.dateRangeOptions.length-1].argumentName;
  }

  getAlbridge() {
    (window as any)['wriSettings'] = {
      jwtToken: this.token,
      basePath: this.albridgePerfSettings.basePath,
      pageName: this.albridgePerfSettings.pageName,
      pageId: this.albridgePerfSettings.pageId,
      appURL: '',
      prod:true,
      debug:false,
      deployed:true,
    };
    this.createAlbridgeContainer();
  }

  createAlbridgeContainer() {
    let el: IAlbridgePerformanceElementProperties;
    if(document.querySelector('wri-portfolio-value-and-benchmark')){
      document.querySelector("wri-portfolio-value-and-benchmark")?.remove();
      el = (document.createElement("wri-portfolio-value-and-benchmark")) as any;
    }else{
      el = (document.createElement("wri-portfolio-value-and-benchmark")) as any;
    }
    el.identifierForDisplay = this.investorId;
    el.header = this.albridgePerfSettings.albridgeGraphHeader;
    el.identifierType = "INVESTOR";
    el.selectedPeriod = this.dateRange;
    el.breakdownLevel = "portfolio";
    el.includeReturn = "true";
    el.includeReturnBarGraph = "true";
    el.includeTotalValue = "false";
    el.includeTimePeriod = "true";
    el.dateFormat = "YYYY-MM-DD";
    el.orientation = "Horizontal Left";
    el.includeValueGraph = "false";
    el.columnsOnDataTable = [];
    el.columnWidth = "Compact";
    el.deviceType = "mobile";
    for(let i in ColumnsOnDataTable){
      el.columnsOnDataTable.push(ColumnsOnDataTable[i as ColumnsOnDataTable])
    };
    el.disclosures = this.albridgePerfSettings.isAlbridgeDisclosure;
    el.showChartTooltip = 'true';
    document.getElementById('sectionArea2')?.appendChild(el as any);
    this.getAlbridgeScript();
  }

  async getAlbridgeScript() {
    const graphScriptUrl = "https://xat-www.pllcfiles.inautix.com/staticartifacts/@pershing/wri-portfolio-value-and-benchmark@16.0.18/wri-portfolio-value-and-benchmark-es2022.js";
    let albridgeGraphScript: HTMLScriptElement | null;
    if(document.querySelector("script[src=" + "'" +  graphScriptUrl + "'" + "]")){
      albridgeGraphScript = document.querySelector("script[src=" + "'" + graphScriptUrl + "'" + "]"); 
      while (document.querySelector("wri-portfolio-value-and-benchmark")?.shadowRoot?.querySelector("highcharts-chart") == null) {
        await new Promise(resolve => setTimeout(resolve,1000));
      }
      let chart = document.querySelector("wri-portfolio-value-and-benchmark")?.shadowRoot?.querySelector("highcharts-chart") as HTMLElement | null;
      if (chart && this.albridgePerfSettings.graphScroll) {
        chart.style.overflowX = "scroll";
        chart.style.overflowY = "scroll";
        chart.style.height = "100%";
      }
    } else {
      albridgeGraphScript = document.createElement('script');
      albridgeGraphScript.src = graphScriptUrl;
      albridgeGraphScript.type = 'text/javascript';
      document.body.appendChild(albridgeGraphScript);
    }
    if (albridgeGraphScript) {
      albridgeGraphScript.onload = async () => {   
        while(document.querySelector("wri-portfolio-value-and-benchmark")?.shadowRoot?.querySelector("highcharts-chart") == null) {
          await new Promise(resolve => setTimeout(resolve,1000));
        }
        let chart = document.querySelector("wri-portfolio-value-and-benchmark")?.shadowRoot?.querySelector("highcharts-chart") as HTMLElement | null;
        if (chart && this.albridgePerfSettings.graphScroll) {
          chart.style.overflowX = "scroll";
          chart.style.overflowY = "scroll";
          chart.style.height = "100%";
        }  
      }  
    }
  }

  changeRange(range: {displayName: string, argumentName: string}) {
    this.dateRange = range.argumentName;
    this.getAlbridge();
  }
}
