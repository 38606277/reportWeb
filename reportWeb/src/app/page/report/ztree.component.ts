import { Component,ElementRef ,OnInit,AfterViewInit,ViewChild,Renderer2} from '@angular/core';
import { Http } from '@angular/http';
import { Router,ActivatedRoute} from '@angular/router';
import { AppCommonService } from '../../common/app-common';
import { CookieService } from 'ngx-cookie';
import { ExcelService  } from '../../common/excelservice.component';
import { BaseComponent } from '../../common/base.component';
import { PromptModal,PromptModalContext,PromptCloseGuard} from '../../common/promptmodal.component';
import { Modal,BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { overlayConfigFactory } from 'angular2-modal';

declare var $: any;
@Component({
    templateUrl: './ztree.component.html',
    styles:[`#budget_year,#budget_month,#company_code,#budget_account_code{height:35px;width:200px;padding-left:10px;}
    .table th, .table td{text-align: center;vertical-align: middle!important;}`]
})
export class ZtreeComponent extends BaseComponent implements OnInit{

  budget_year: number;
  budget_month: number;
  company_code: string;
  budget_account_code: string;
  selectYear: Array<number>;
  selectMonth: Array<number>;
  companyList:Array<Company>;
  budgetAccountList: Array<BudgetAccount>;

  @ViewChild('tree')
  tree: ElementRef;

  constructor(private http: Http,private commonService:AppCommonService,private cookieService:CookieService,
              private excelService: ExcelService,private route: ActivatedRoute,private modal: Modal) {
    super();
    let userName = route.snapshot.queryParams['userName'];
    if(userName){
      let Days = 3/24;
      let exp = new Date();
      exp.setTime(exp.getTime() + Days*24*60*60*1000);
      this.cookieService.put('credentials',JSON.stringify({UserCode:userName,Pwd:'',isAdmin:0}),{'expires':exp});
    }
  }

  ngOnInit(){
    let date = new Date();
    let currentYear = date.getFullYear();
    this.budget_year = currentYear;
    this.selectYear = new Array<number>();
    for(let i=0;i<=5;i++){
      this.selectYear.push(currentYear-i);
    }
    this.budget_month = date.getMonth()+1;
    this.getAllMonth();
    this.http.post(this.commonService.getReportServerPath()+"/budget/getCompanyByDicItem",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res =>{
              this.companyList = res.json().companys;
              this.companyList.unshift(new Company('0',''));
            }
	  	);
    this.http.post(this.commonService.getReportServerPath()+"/budget/getBudgetAccountCode",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res =>{
              this.budgetAccountList = res.json();
              this.budgetAccountList.unshift(new BudgetAccount('0',''));
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
    if(this.budget_account_code=='0'){
      this.budget_account_code = null;
    }
    return {'budget_year':this.budget_year,'budget_month':this.budget_month,'companycodes':companycodes,'budget_account_code':this.budget_account_code};
  }
  isFinish(param){
    let falg = true;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    //console.log(year+" "+month+" "+hours+" "+minutes);
    //console.log(this.budget_year+" "+this.budget_month);
    //console.log(hours%2);
    if(year==this.budget_year&&month==this.budget_month){
      if(hours%2!=0 && minutes>30){
        //console.log('1');
        this.http.post(this.commonService.getReportServerPath()+"/budget/isFinish",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res =>{
              if(res.text()!="true"){
                falg = false;
              }
            }
	  	  );
      }else if(hours%2!=0 && minutes<30){
        //console.log('2');
        falg = false;
      }
    }
    return falg;
  }

  queryBudgetDetail(){
    let param = this.prepareSqlParam();
    if(this.isFinish(param)){
      showLoading();
      this.http.post(this.commonService.getReportServerPath()+"/budget/getBudgetDetail/报表展示/预算完成情况汇总表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
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
    }else{
      let pContext = new PromptModalContext();
      pContext.message = "本月数据正在更新,请稍后再试";
      this.modal.open(PromptModal, overlayConfigFactory(pContext, BSModalContext));
    }
  }

  exportBudgetDetail(){
      let param = this.prepareSqlParam();
      if(this.isFinish(param)){
        showLoading();
        this.http.post(this.commonService.getReportServerPath()+"/budget/exportBudgetDetail/报表展示/预算完成情况汇总表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
              res => {
                stopLoading();
                let data = new Array();
                res.json().forEach(obj=>{
                  data.push({
                            '公司编码':obj.COMPANY_ID,
                            '公司名称':obj.COMPANY_NAME,
                            '预算科目编码':obj.BUDGET_ACCOUNT_CODE,
                            '预算科目名称':obj.BUDGET_ACCOUNT_NAME,
                            '本年预算金额':obj.TRANSMIT_BUDGET_AMOUNT,
                            '立项金额':obj.APPROVED_BUDGET_AMOUNT,
                            '预算立项进度':obj.APPROVED_PRO,
                            '列账总金额(含计提)':obj.ACCOUNT_AMOUNT,
                            '预算完成进度':obj.ACCOUNT_PRO,
                            '计提金额':obj.CLAIM_AMOUNT,
                            '列账进度(不含计提)':obj.BUDGET_PRO
                            });
                });
                this.excelService.exportAsExcelFile(data,"预算完成情况汇总表",11);
              }
        ).catch(
              reason=>{
                      console.error(reason);
                      stopLoading();
              }
        );
    }else{
      let pContext = new PromptModalContext();
      pContext.message = "本月数据正在更新,请稍后再试";
      this.modal.open(PromptModal, overlayConfigFactory(pContext, BSModalContext));
    }
  }

  _reset(){
    this.company_code = null;
    this.budget_account_code = null;
    this.budget_year = new Date().getFullYear();
  }
  getAllMonth(){
    this.selectMonth = new Array<number>();
    this.selectMonth.push(1);
    this.selectMonth.push(2);
    this.selectMonth.push(3);
    this.selectMonth.push(4);
    this.selectMonth.push(5);
    this.selectMonth.push(6);
    this.selectMonth.push(7);
    this.selectMonth.push(8);
    this.selectMonth.push(9);
    this.selectMonth.push(10);
    this.selectMonth.push(11);
    this.selectMonth.push(12);
  }
}
export class Company{
  value: string;//公司编码
  name: string;//公司名称
  constructor(value: string,name: string){
    this.value = value;
    this.name = name;
  }
}
export class BudgetAccount{
  budgetAccountCode: string;
  budgetAccountName: string;
  constructor(budgetAccountCode: string,budgetAccountName: string){
    this.budgetAccountCode = budgetAccountCode;
    this.budgetAccountName = budgetAccountName;
  }
}