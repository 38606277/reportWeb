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
    templateUrl: './orgList.component.html',
    styles:[`#project_number,#project_name,#budget_account_name,#document_code,#document_description,#order_number,#bz_document_number,#budget_year,#company_code,#department_id{height:35px;width:200px;padding-left:10px;}
             input{border-color:#D3D3D3;}
             .table th,.table td {text-align: center;vertical-align: middle!important;position：relative;}`]
})
export class OrgListComponent extends BaseComponent implements OnInit{
  department_id: number;
  project_number: string;
  project_name: string;
  budget_account_name: string;
  document_code: string;
  document_description: string;
  order_number: string;
  bz_document_number: string;
  budget_year: number;
  company_code: string;
  selectYear: Array<number>;
  companyList:Array<Company>;
  departmentList:Array<DepartMent>;
  orgList:any;
  page: Page;
  constructor(private http: Http,private commonService:AppCommonService,private excelService: ExcelService,private appService:AppService) {
      super();
  }

  ngOnInit(){
      this.page = new Page(20);
      let date = new Date();
      let currentYear = date.getFullYear();
      this.budget_year = currentYear;
      this.selectYear = new Array<number>();
      for(let i=0;i<=5;i++){
        this.selectYear.push(currentYear-i);
      }
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
    if(this.company_code==null){
      companycodes = this.companyList;
    }else{
      companycodes.push(new Company(this.company_code,""));
    }
    let departmentids = new Array<DepartMent>();
    if(this.department_id==null){
        departmentids = this.departmentList;
    }else{
        departmentids.push(new DepartMent(this.department_id,""));
    }
    return {
      'budget_year':this.budget_year,
      'companycodes':companycodes,
      'departmentids':departmentids,
      'project_number':this.project_number,
      'project_name':this.project_name,
      'budget_account_name':this.budget_account_name,
      'document_code':this.document_code,
      'document_description':this.document_description,
      'order_number':this.order_number,
      'bz_document_number':this.bz_document_number,
      'namespace': '报表展示',
      'sqlid':'部门明细表',
      'page':this.page
    };
  }
  
  queryOrgList(){
    showLoading();
    let param = this.prepareSqlParam();
    this.http.post(this.commonService.getReportServerPath()+"/budget/getOrgList/报表展示/部门明细表/query",param,{headers: this.commonService.getHeaders()}).toPromise().then(
          res => {
            console.log(res.json());
            this.orgList = res.json().list;
            for(let org of this.orgList){
               org.APPROVED_BUDGET_AMOUNT = this.appService.comdify(org.APPROVED_BUDGET_AMOUNT);
               org.SUBMIT_HT_AMOUNT = this.appService.comdify(org.SUBMIT_HT_AMOUNT);
               org.HT_AMOUNT = this.appService.comdify(org.HT_AMOUNT);
               org.BZ_AMOUNT = this.appService.comdify(org.BZ_AMOUNT);
               org.TOTAL_ORDER_AMOUNT = this.appService.comdify(org.TOTAL_ORDER_AMOUNT);
               org.TOTAL_NOT_IN_ACCOUNT = this.appService.comdify(org.TOTAL_NOT_IN_ACCOUNT);
               org.ORDER_BILL_AMOUNT = this.appService.comdify(org.ORDER_BILL_AMOUNT);
            }
            this.setTotalPage(this.page, parseInt(res.json().totalSize));
            if(this.orgList!=null&&this.orgList.length!=0&&this.page.currentPage==0){
                this.page.currentPage = 1;
            }
            stopLoading();
          }
	  	);
  }

  exportOrgList(){
    showLoading();
    let param = this.prepareSqlParam();
    this.http.post(this.commonService.getReportServerPath()+"/budget/getOrgList/报表展示/部门明细表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              let data = new Array();
              if(this.company_code=='3510'||this.company_code=='3511'){
                res.json().list.forEach(obj=>{
                  data.push({
                            '公司名称':obj.COMPANY_NAME,
                            '预算部门':obj.DEPARTMENT_NAME,
                            '预算科目':obj.BUDGET_ACCOUNT_NAME,
                            '预算立项编号':obj.PROJECT_NUMBER,
                            '预算立项名称':obj.PROJECT_NAME,
                            '预算立项当前审批人':obj.BMS_CURRENT_PERSON,
                            '已审批立项金额':obj.APPROVED_BUDGET_AMOUNT,
                            '已提交合同金额':obj.SUBMIT_HT_AMOUNT,
                            '合同编号':obj.DOCUMENT_CODE,
                            '合同名称':obj.DOCUMENT_DESCRIPTION,
                            '合同当前审批人':obj.HT_CURRENT_PERSON,
                            '合同价款':obj.HT_AMOUNT,
                            '合同受益期起':obj.HT_PROFIT_FROM,
                            '合同受益期止':obj.HT_PROFIT_TO,
                            '合同供应商名称':obj.HT_SUPPLIER,
                            '需求单位':obj.FROM_DEPT,
                            '需求提交人':obj.DOCUMENT_CREATE_BY,
                            '报账单编号':obj.BZ_DOCUMENT_NUMBER,
                            '报账单起草人':obj.BZ_DOCUMENT_CREATE_BY,
                            '列账价款':obj.BZ_AMOUNT,
                            '报账单当前审批人':obj.BZ_CURRENT_PERSON,
                            'MIS订单号':obj.ORDER_NUMBER,
                            'MIS订单金额':obj.TOTAL_ORDER_AMOUNT,
                            'MIS订单未列账金额':obj.TOTAL_NOT_IN_ACCOUNT,
                            'MIS订单开单金额':obj.ORDER_BILL_AMOUNT
                            });
                });
                this.excelService.exportAsExcelFile(data,"部门预算完成情况明细表",25);
              }else{
                res.json().list.forEach(obj=>{
                  data.push({
                            '公司名称':obj.COMPANY_NAME,
                            '预算部门':obj.DEPARTMENT_NAME,
                            '预算科目':obj.BUDGET_ACCOUNT_NAME,
                            '预算立项编号':obj.PROJECT_NUMBER,
                            '预算立项名称':obj.PROJECT_NAME,
                            '预算立项当前审批人':obj.BMS_CURRENT_PERSON,
                            '已审批立项金额':obj.APPROVED_BUDGET_AMOUNT,
                            '已提交合同金额':obj.SUBMIT_HT_AMOUNT,
                            '合同编号':obj.DOCUMENT_CODE,
                            '合同名称':obj.DOCUMENT_DESCRIPTION,
                            '合同当前审批人':obj.HT_CURRENT_PERSON,
                            '合同价款':obj.HT_AMOUNT,
                            '合同受益期起':obj.HT_PROFIT_FROM,
                            '合同受益期止':obj.HT_PROFIT_TO,
                            '合同供应商名称':obj.HT_SUPPLIER,
                            '需求单位':obj.FROM_DEPT,
                            '需求提交人':obj.DOCUMENT_CREATE_BY,
                            '报账单编号':obj.BZ_DOCUMENT_NUMBER,
                            '报账单起草人':obj.BZ_DOCUMENT_CREATE_BY,
                            '列账价款':obj.BZ_AMOUNT,
                            '报账单当前审批人':obj.BZ_CURRENT_PERSON
                            });
                });
              this.excelService.exportAsExcelFile(data,"部门预算完成情况明细表",21);
              }
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