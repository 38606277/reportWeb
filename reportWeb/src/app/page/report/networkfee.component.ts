import { Component,ElementRef ,OnInit,AfterViewInit,ViewChild,Renderer2} from '@angular/core';
import { Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
import { Company } from './ztree.component';
import { ExcelService  } from '../../common/excelservice.component';
import { BaseComponent } from '../../common/base.component';
declare var $: any;
@Component({
    templateUrl: './networkfee.component.html',
    styles:[`#budget_year,#company_code,#budget_account_code{height:35px;width:200px;padding-left:10px;}
    .table th, .table td{text-align: center;vertical-align: middle!important;}`]
})
export class NetWorkFeeComponent extends BaseComponent implements OnInit{

  budget_year: number;
  company_code: string;
  selectYear: Array<number>;
  companyList:Array<Company>;

  @ViewChild('tree')
  tree: ElementRef;

  constructor(private http: Http,private commonService:AppCommonService,private excelService: ExcelService) {
    super();
  }

  ngOnInit(){
    let date = new Date();
    let currentYear = date.getFullYear();
    this.budget_year = currentYear;
    this.selectYear = new Array<number>();
    for(let i=0;i<=5;i++){
      this.selectYear.push(currentYear-i);
    }
    this.http.post(this.commonService.getReportServerPath()+"/budget/getCompanyByDicItem",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res =>{
              this.companyList = res.json().companys;
              this.companyList.unshift(new Company('0',''));
            }
	  	);
      this.scroll();
  }

  prepareSqlParam(){
    let companycodes = new Array<Company>();
    if(this.company_code==null||this.company_code=='0'){
      companycodes = this.companyList;
    }else{
      companycodes.push(new Company(this.company_code,""));
    }
    return  {'budget_year':this.budget_year,'companycodes':companycodes};
  }

  queryNetfee(){
    showLoading();
    let param = this.prepareSqlParam();
    this.http.post(this.commonService.getReportServerPath()+"/budget/getNetWorkFee/报表展示/网络维修费申报占用情况表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              this.tree.nativeElement.innerHTML=res.text();
                $('.tree').treegrid({
                  'initialState': 'collapsed',
                  'expanderExpandedClass': 'glyphicon glyphicon-minus',
                  'expanderCollapsedClass': 'glyphicon glyphicon-plus'
	              });
            }
      ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
      );
  }

  exportNetworkFee(){
    showLoading();
    let param = this.prepareSqlParam();
    this.http.post(this.commonService.getReportServerPath()+"/budget/exportNetWorkFee/报表展示/网络维修费申报占用情况表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              let data = new Array();
              res.json().list.forEach(obj=>{
                data.push({
                           '公司编码':obj.COMPANY_ID,
                           '公司名称':obj.COMPANY_NAME,
                           '预算科目编码':obj.BUDGET_ACCOUNT_CODE,
                           '预算科目名称':obj.BUDGET_ACCOUNT_NAME,
                           '本年预算金额':obj.TRANSMIT_BUDGET_AMOUNT,
                           '申报完成金额':obj.APPROVED_BUDGET_AMOUNT,
                           '申报进度':obj.APPROVED_PRO+"%",
                           '预算占用金额':obj.OCCUPIED_BUDGET_AMOUNT_SUM,
                           '占用进度':obj.OCCUPIED_PRO+"%"
                          });
              });
              this.excelService.exportAsExcelFile(data,"网络维修费申报占用情况表",9);
            }
    ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
      );
  }

  _reset(){
    this.company_code = null;
    this.budget_year = new Date().getFullYear();
  }

}