import { Component,OnInit} from '@angular/core';
import { Http } from '@angular/http';
import { Page } from '../../common/page.component';
import { AppCommonService } from '../../common/app-common';
import { BaseComponent } from '../../common/base.component';
import { ExcelService  } from '../../common/excelservice.component';
declare var $: any;
@Component({
    templateUrl: './budgetrelation.component.html',
    styles:[`#accounting_subject_name,#static_budget_account_name{height:35px;width:200px;padding-left:10px;}
    .table th, .table td{text-align: center;vertical-align: middle!important;}`]
})
export class BudgetRelationComponent extends BaseComponent implements OnInit{
  accounting_subject_name: string;
  static_budget_account_name: string;
  budgetRelationList: Array<any>;
  page: Page;
  constructor(private http: Http,private commonService:AppCommonService,private excelService: ExcelService) {
    super();
  }
  
  ngOnInit(){
    this.page = new Page(20);
    this.scroll();
  }
  queryBudgetRelation(){
    showLoading();
    let param = {'accounting_subject_name':this.accounting_subject_name,'static_budget_account_name':this.static_budget_account_name,'page':this.page};
    this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/科目映射表/query",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              this.budgetRelationList = res.json().list;
              this.setTotalPage(this.page, parseInt(res.json().totalSize));
              if(this.budgetRelationList!=null&&this.budgetRelationList.length!=0&&this.page.currentPage==0){
                        this.page.currentPage = 1;
              }
            }
      ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
      );
  }

  exportBudgetRelation(){
    showLoading();
        let param = {'accounting_subject_name':this.accounting_subject_name,'static_budget_account_name':this.static_budget_account_name,'page':null};
        this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/科目映射表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              let data = new Array();
              res.json().list.forEach(obj=>{
                data.push({
                           '会计科目代码':obj.ACCOUNTING_SUBJECT_CODE,
                           '会计科目名称':obj.ACCOUNTING_SUBJECT_NAME,
                           '基础科目代码':obj.BASE_BUDGET_ACCOUNT_CODE,
                           '基础科目名称':obj.BASE_BUDGET_ACCOUNT_NAME,
                           '统计科目代码':obj.STATIC_BUDGET_ACCOUNT_CODE,
                           '统计科目名称':obj.STATIC_BUDGET_ACCOUNT_NAME
                          });
              });
              this.excelService.exportAsExcelFile(data,"科目映射表",6);
            }
        ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
       );
  }

  _reset(){
    this.accounting_subject_name = null;
    this.static_budget_account_name = null;
  }

}