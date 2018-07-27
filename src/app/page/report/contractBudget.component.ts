import { Component,ElementRef ,OnInit,AfterViewInit,ViewChild,Renderer2} from '@angular/core';
import { Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
import { Company } from './ztree.component';
import { DepartMent } from './newcontract.component';
import { BaseComponent } from '../../common/base.component';
import { Page } from '../../common/page.component';
import { ExcelService  } from '../../common/excelservice.component';
import { AppService } from '../../app.service';

declare var $: any;
@Component({
    templateUrl: './contractBudget.component.html',
    styles:[`#contract_code,#contract_name,#budget_year,#company_code,#department_id,#budget_account_name,#project_number{height:35px;width:200px;padding-left:10px;}
             #start_Date,#end_Date{height:35px;width:100px;padding-left:10px;}
             input{border-color:#D3D3D3;}
             .table th, .table td {text-align: center;vertical-align: middle!important;}`]
})
export class ContractBudgetComponent extends BaseComponent implements OnInit{
  department_id: number;
  contract_code: string;
  contract_name: string;
  company_code: string;
  budget_year: string;
  selectYear: Array<any>;
  start_Date: any;
  end_Date: any;
  budget_account_name: string;
  project_number: string;
  create_Start_Date: any;
  create_End_Date: any;
  companyList:Array<Company>;
  departmentList:Array<DepartMent>;
  contractList:any;
  page: Page;
  constructor(private http: Http,private commonService:AppCommonService,private excelService: ExcelService,private appService:AppService) {
      super();
  }

  ngOnInit(){
    this.page = new Page(20);
    let date = new Date();
    let currentYear: any = date.getFullYear();
    this.budget_year = currentYear;
    this.selectYear = new Array<number>();
    for(let i=0;i<=5;i++){
      this.selectYear.push(currentYear-i);
    }
    this.selectYear.unshift('');
    this.getCompanyAndDepartmentByPermission();
    this.scroll();
  }
  getCompanyAndDepartmentByPermission(){
      this.http.post(this.commonService.getReportServerPath()+"/budget/getCompanyAndDepartmentByPermission",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res =>{
              this.companyList = res.json().companys;
              this.departmentList = res.json().departments;
              this.companyList.unshift(new Company('0',''));
              this.departmentList.unshift(new DepartMent(0,''));
            }
	  	);
  }
  ngAfterViewInit()
    {
        $('#start_Date,#end_Date').fdatepicker({
            format: 'yyyy-mm-dd',
            language:'zh-CN'
        });
    }

  getDepartment(companyCode){
    if(companyCode==0){
        this.getCompanyAndDepartmentByPermission();
        return;
    }
    this.company_code = companyCode;
    let param = {
      'companyCode':companyCode
    };
    this.http.post(this.commonService.getReportServerPath()+"/budget/getDepartmentByCompanyCode",param,{headers: this.commonService.getHeaders()}).toPromise().then(
         res =>{
                this.departmentList = res.json();
                if(this.departmentList!=null&&this.departmentList.length!=0){
                    this.departmentList.unshift(new DepartMent(0,''));
                }else{
                    this.departmentList = null;
                }
            }
    );
  }

  prepareSqlParam(){
    let companycodes = new Array<Company>();
    if(this.company_code==null||this.company_code=='0'){
      companycodes = this.companyList;
    }else{
      companycodes.push(new Company(this.company_code,""));
    }
    let departmentids = new Array<DepartMent>();
    if(this.department_id==null||this.department_id==0){
        departmentids = this.departmentList;
    }else{
        departmentids.push(new DepartMent(this.department_id,""));
    }
    if($("#start_Date").val()!=null&&$("#start_Date").val()!=""){
      this.start_Date = "";
      this.start_Date = $("#start_Date").val();
    }
    if($("#end_Date").val()!=null&&$("#end_Date").val()!=""){
      this.end_Date = "";
      this.end_Date = $("#end_Date").val();
    }
    return {
      'companycodes':companycodes,
      'departmentids':departmentids,
      'contract_code':this.contract_code,
      'contract_name':this.contract_name,
      'budget_year':this.budget_year,
      'start_Date':this.start_Date,
      'end_Date':this.end_Date,
      'budget_account_name':this.budget_account_name,
      'project_number':this.project_number,
      'namespace': '报表展示',
      'sqlid':'合同预算明细表',
      'page':this.page
    };
  }

  queryContractBudgetList(){
    showLoading();
    let param = this.prepareSqlParam();
    console.log(param);
    this.http.post(this.commonService.getReportServerPath()+"/budget/getContractBudgetList/报表展示/合同预算明细表/query",param,{headers: this.commonService.getHeaders()}).toPromise().then(
          res => {
            console.log(res.json());
            this.contractList= res.json().list;
            for(let contract of this.contractList){
               contract.CONTRACT_AMOUNT_TOTAL = this.appService.comdify(contract.CONTRACT_AMOUNT_TOTAL);
               contract.CONTRACT_AMOUNT = this.appService.comdify(contract.CONTRACT_AMOUNT);
               contract.BUDGET_AMOUNT = this.appService.comdify(contract.BUDGET_AMOUNT);
            }
            this.setTotalPage(this.page, parseInt(res.json().totalSize));
            if(this.contractList!=null&&this.contractList.length!=0&&this.page.currentPage==0){
                this.page.currentPage = 1;
            }
            stopLoading();  
          }
	  	);
  }
  exportContractBudetList(){
    showLoading();
    let param = this.prepareSqlParam();
    this.http.post(this.commonService.getReportServerPath()+"/budget/getContractBudgetList/报表展示/合同预算明细表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
    res => {
      stopLoading();
      let data = new Array();
        res.json().list.forEach(obj=>{
          data.push({
                    '分公司':obj.COMPANY_NAME,
                    '合同需求部门':obj.DEPARTMENT_NAME,
                    '合同编号':obj.CONTRACT_CODE,
                    '合同名称':obj.CONTRACT_NAME,
                    '合同金额（含税）':this.appService.comdify(obj.CONTRACT_AMOUNT_TOTAL),
                    '合同金额（不含税）':this.appService.comdify(obj.CONTRACT_AMOUNT),
                    '合同起时间':obj.START_DATE_ACTIVE,
                    '合同止时间':obj.END_DATE_ACTIVE,
                    '合同审批情况':obj.CONTRACT_STATUS,
                    '合同类型':obj.CONTRACT_TYPE,
                    '合同预算年份':obj.BUDGET_YEAR,
                    '合同预算金额':this.appService.comdify(obj.BUDGET_AMOUNT),
                    '预算部门':obj.ORG_NAME,
                    '预算科目':obj.BUDGET_ACCOUNT_NAME,
                    '预算立项编号':obj.PROJECT_NUMBER,
                    '预算立项名称':obj.PROJECT_NAME
                    });
        });
              
              this.excelService.exportAsExcelFile(data,"合同预算占用情况表",16);
            }
    ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
      );
  }
  _reset(){
    
  }

}