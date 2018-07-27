import { Component,ElementRef ,OnInit,AfterViewInit,ViewChild,Renderer2} from '@angular/core';
import { Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
import { Company } from './ztree.component';
import { DepartMent } from './newcontract.component';
import { Page } from '../../common/page.component';
import { BaseComponent } from '../../common/base.component';
import { ExcelService  } from '../../common/excelservice.component';
import { AppService } from '../../app.service';
declare var $: any;
@Component({
    templateUrl: './signcontract.component.html',
    styles:[`#budget_year,#company_code,#department_id{height:35px;width:200px;padding-left:10px;}
    .table th, .table td{text-align: center;vertical-align: middle!important;}`]
})
export class SignContractComponent extends BaseComponent implements OnInit{

  budget_year: number;
  company_code: string;
  department_id: number;
  selectYear: Array<number>;
  companyList:Array<Company>;
  departmentList:Array<DepartMent>;
  signContractList:Array<any>;
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
        return {'budget_year':this.budget_year,'companycodes':companycodes,'departmentids':departmentids,'page':null};
  }
  querySignContract(){
    showLoading();
    this.clearDetailInfo();
    let param = this.prepareSqlParam();
    param.page = this.page;
    this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/合同签订进度表/query",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              this.signContractList = res.json().list;
              for(let signContract of this.signContractList){
                signContract.APPROVED_BUDGET_AMOUNT = this.appService.comdify(signContract.APPROVED_BUDGET_AMOUNT);
                signContract.UNFINISH_APPROVED_BUDGET_AMOUNT = this.appService.comdify(signContract.UNFINISH_APPROVED_BUDGET_AMOUNT);
                signContract.FINISH_APPROVED_BUDGET_AMOUNT = this.appService.comdify(signContract.FINISH_APPROVED_BUDGET_AMOUNT);
              }
              this.setTotalPage(this.page, parseInt(res.json().totalSize));
              if(this.signContractList!=null&&this.signContractList.length!=0&&this.page.currentPage==0){
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

  showSignContractDetail(signcontract,index,obj){
        let company_code = signcontract.COMPANY_CODE;
        let department_id = signcontract.DEPARTMENT_ID;
        let budget_account_id = signcontract.BUDGET_ACCOUNT_ID;
        let finish_amount = signcontract.FINISH_APPROVED_BUDGET_AMOUNT;
        let unfinish_amount = signcontract.UNFINISH_APPROVED_BUDGET_AMOUNT;
        let trs = $(".t_result tr[id="+index+"]");
        if(trs!=null&&trs.length>0){
            trs.remove();
        }else{
            //查询详情数据
            showLoading();
            this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/合同签订进度明细表/detail",
                {'budget_year':this.budget_year,'company_code':company_code,'department_id':department_id,'budget_account_id':budget_account_id},
                {headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                    stopLoading();
                    //解决双击鼠标查询重复数据问题
                    let trs = $(".t_result tr[id="+index+"]");
                    if(trs!=null&&trs.length>0){   
                        return;
                    }                     
                    let signContractDetail = res.json().list;
                    for(let signContract of signContractDetail){
                        signContract.APPROVED_BUDGET_AMOUNT = this.appService.comdify(signContract.APPROVED_BUDGET_AMOUNT);
                        signContract.UNFINISH_APPROVED_BUDGET_AMOUNT = this.appService.comdify(signContract.UNFINISH_APPROVED_BUDGET_AMOUNT);
                        signContract.FINISH_APPROVED_BUDGET_AMOUNT = this.appService.comdify(signContract.FINISH_APPROVED_BUDGET_AMOUNT);
                    }
                    signContractDetail.forEach(function(detail){
                        $(obj.target.parentNode.parentNode).after(
                           "<tr id="+index+" style=\"text-align: center;\"><td></td><td>"+detail.COMPANY_NAME+"</td><td>"+detail.DEPARTMENT_NAME+"</td>"+
                           "<td>"+detail.BUDGET_ACCOUNT_NAME+"</td>"+
                           "<td>"+detail.PROJECT_NUMBER+"</td><td>"+detail.PROJECT_NAME+"</td><td>"+detail.BMS_CURRENT_PERSON+"</td>"+
                           "<td style='text-align: right'>"+detail.APPROVED_BUDGET_AMOUNT+"</td><td style='text-align: right'>"+detail.UNFINISH_APPROVED_BUDGET_AMOUNT+"</td>"+
                           "<td style='text-align: right'>"+detail.UNFINISH_PRE+"%</td>"+
                           "<td style='text-align: right'>"+detail.FINISH_APPROVED_BUDGET_AMOUNT+"</td>"+
                           "<td style='text-align: right'>"+detail.FINISH_PRE+"%</td>"+
                           "<td>"+detail.DOCUMENT_DESCRIPTION+"</td>"+
                           "<td>"+detail.HT_CURRENT_PERSON+"</td>"+
                           "</tr>");
                    });
                }
            ).catch(
                reason=>{
                    console.error(reason);
                    stopLoading();
                }
            );
        }
   }

   exportSignContract(){
       showLoading();
       let param = this.prepareSqlParam();
       this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/合同签订进度表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              let data = new Array();
              res.json().list.forEach(obj=>{
                data.push({
                           '公司编码':obj.COMPANY_ID,
                           '公司名称':obj.COMPANY_NAME,
                           '部门编码':obj.DEPARTMENT_ID,
                           '部门名称':obj.DEPARTMENT_NAME,
                           '预算科目编码':obj.BUDGET_ACCOUNT_ID,
                           '预算科目名称':obj.BUDGET_ACCOUNT_NAME,
                           '当前已审批立项金额':obj.APPROVED_BUDGET_AMOUNT,
                           '审批中':obj.UNFINISH_APPROVED_BUDGET_AMOUNT,
                           '审批中进度':obj.UNFINISH_PRE+"%",
                           '已签订':obj.FINISH_APPROVED_BUDGET_AMOUNT,
                           '已签订进度':obj.FINISH_PRE+"%"
                          });
              });
              this.excelService.exportAsExcelFile(data,"合同签订进度表",11);
            }
        ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
       );
   }
   exportSignContractDetail(){
       let data = new Array<any>();
       let context = this;
       let length = 0;
       showLoading();
       $(".t_result tbody input:checkbox:checked").each(function(){
           let index = $(this).val();
           let signcontract = context.signContractList[index];
           let company_code = signcontract.COMPANY_CODE;
           let department_id = signcontract.DEPARTMENT_ID;
           let budget_account_id = signcontract.BUDGET_ACCOUNT_ID;
           let finish_amount = signcontract.FINISH_APPROVED_BUDGET_AMOUNT;
           let has_budget_signed = 0;//未审批
           if(finish_amount!=0){
               has_budget_signed = 1;
           }
           context.http.post(context.commonService.getReportServerPath()+"/budget/report/报表展示/合同签订进度明细表/detail",
                {'budget_year':context.budget_year,'company_code':company_code,'department_id':department_id,'budget_account_id':budget_account_id,'has_budget_signed':has_budget_signed},
                {headers: context.commonService.getHeaders()}).toPromise().then(
                    res => {
                            data.concat(res.json().list.forEach(obj=>{
                                data.push({
                                        '公司编码':company_code,
                                        '公司名称':obj.COMPANY_NAME,
                                        '部门编码':department_id,
                                        '部门名称':obj.DEPARTMENT_NAME,
                                        '预算科目编码':budget_account_id,
                                        '预算科目名称':obj.BUDGET_ACCOUNT_NAME,
                                        '预算立项编号':obj.PROJECT_NUMBER,
                                        '预算立项名称':obj.PROJECT_NAME,
                                        '预算立项当前审批人':obj.BMS_CURRENT_PERSON,
                                        '当前已审批立项金额':obj.APPROVED_BUDGET_AMOUNT,
                                        '审批中':obj.UNFINISH_APPROVED_BUDGET_AMOUNT,
                                        '审批中进度':obj.UNFINISH_PRE+"%",
                                        '已签订':obj.FINISH_APPROVED_BUDGET_AMOUNT,
                                        '已签订进度':obj.FINISH_PRE+"%",
                                        '合同名称':obj.DOCUMENT_DESCRIPTION,
                                        '当前审批人':obj.HT_CURRENT_PERSON
                                        });
                        }));
                        length++;
                }
            )
       });
       let inteval = setInterval(function(){
           if(length==$(".t_result tbody input:checkbox:checked").length){
               stopLoading();
               context.excelService.exportAsExcelFile(data,"合同签订进度明细表",16);
               clearInterval(inteval);
           }else{
               return;
           }
       },1000);
   }
   getAllCheckboxSelected(){
       if($(".t_result thead input:checkbox:checked").length==1){
           $(".t_result tbody input:checkbox").attr("checked",'true');
       }else{
           $(".t_result tbody input:checkbox").removeAttr("checked");
       }
   }
   clearDetailInfo(){
       for(let index=0;index<20;index++){
            let trs = $(".t_result tr[id="+index+"]");
            if(trs!=null&&trs.length>0){
                trs.remove();
            }
        }
   }
  _reset(){
    this.company_code = null;
    this.budget_year = new Date().getFullYear();
    this.department_id = null;
  }

}