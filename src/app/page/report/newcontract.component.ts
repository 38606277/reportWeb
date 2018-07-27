import { Component,ElementRef ,OnInit,AfterViewInit,Renderer2} from '@angular/core';
import { Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
import { Company } from './ztree.component';
import { Page } from '../../common/page.component';
import { BaseComponent } from '../../common/base.component';
import { Modal  } from 'angular2-modal/plugins/bootstrap';
import { ExcelService  } from '../../common/excelservice.component';
import { AppService } from '../../app.service';
declare var $: any;
@Component({
    templateUrl: './newcontract.component.html',
    styles:[`#budget_year,#company_code,#department_id{height:35px;width:200px;padding-left:10px;}
    .table th, .table td{text-align: center;vertical-align: middle!important;}`]
})
export class NewContractComponent extends BaseComponent implements OnInit{
    budget_year: number;
    company_code: string;
    department_id: number;
    selectYear: Array<number>;
    companyList:Array<Company>;
    departmentList:Array<DepartMent>;
    newContractList:Array<any>;
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

    queryNewContract(){
        showLoading();
        this.clearDetailInfo();
        let param = this.prepareSqlParam();
        param.page = this.page;
        this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/本年度新增合同列账进度表/query",param,{headers: this.commonService.getHeaders()}).toPromise().then(
                res => {
                    stopLoading();
                    this.newContractList = res.json().list;
                    for(let newContract of this.newContractList){
                        newContract.HT_AMOUNT = this.appService.comdify(newContract.HT_AMOUNT);
                        newContract.BZ_AMOUNT = this.appService.comdify(newContract.BZ_AMOUNT);
                    }
                    this.setTotalPage(this.page, parseInt(res.json().totalSize));
                    if(this.newContractList!=null&&this.newContractList.length!=0&&this.page.currentPage==0){
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
    
    showContractDetail(company_code,department_id,index,obj){
        let trs = $(".t_result tr[id="+index+"]");
        if(trs!=null&&trs.length>0){
            trs.remove();
        }else{
            //查询详情数据
            showLoading();
            this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/本年度新增合同列账进度明细表/detail",
                {'budget_year':this.budget_year,'company_code':company_code,'department_id':department_id},
                {headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                    stopLoading();
                     //解决双击鼠标查询重复数据问题
                    let trs = $(".t_result tr[id="+index+"]");
                    if(trs!=null&&trs.length>0){   
                        return;
                    } 
                    let newContractDetail = res.json().list;
                    for(let newContract of newContractDetail){
                        newContract.HT_AMOUNT = this.appService.comdify(newContract.HT_AMOUNT);
                        newContract.BZ_AMOUNT = this.appService.comdify(newContract.BZ_AMOUNT);
                    }
                    newContractDetail.forEach(function(detail){
                        $(obj.target.parentNode.parentNode).after(
                           "<tr id="+index+" style=\"text-align: center;\"><td></td><td>"+detail.COMPANY_NAME+"</td><td>"+detail.DEPARTMENT_NAME+"</td>"+
                           "<td style='text-align: right'>"+detail.HT_AMOUNT+"</td><td style='text-align: right'>"+detail.BZ_AMOUNT+"</td>"+
                           "<td style='text-align: right'>"+detail.BZ_PRE+"%</td><td>"+detail.DOCUMENT_DESCRIPTION+detail.DOCUMENT_CODE+"</td></tr>");
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

   exportNewContract(){
       showLoading();
       let param = this.prepareSqlParam();
       this.http.post(this.commonService.getReportServerPath()+"/budget/report/报表展示/本年度新增合同列账进度表/export",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              stopLoading();
              let data = new Array();
              res.json().list.forEach(obj=>{
                data.push({
                           '公司编码':obj.COMPANY_ID,
                           '公司名称':obj.COMPANY_NAME,
                           '部门编码':obj.DEPARTMENT_ID,
                           '部门名称':obj.DEPARTMENT_NAME,
                           '本年度已签订合同金额':obj.HT_AMOUNT,
                           '报账总金额':obj.BZ_AMOUNT,
                           '报账进度':obj.BZ_PRE+"%"
                          });
              });
              this.excelService.exportAsExcelFile(data,"本年度新增合同列账进度表",7);
            }
      ).catch(
            reason=>{
                    console.error(reason);
                    stopLoading();
            }
      );
   }

   exportNewContractDetail(){
       let data = new Array<any>();
       let context = this;
       let length = 0;
       showLoading();
       $(".t_result tbody input:checkbox:checked").each(function(){
           let index = $(this).val();
           let newContract = context.newContractList[index];
           let company_code = newContract.COMPANY_CODE;
           let department_id = newContract.DEPARTMENT_ID;
           context.http.post(context.commonService.getReportServerPath()+"/budget/report/报表展示/本年度新增合同列账进度明细表/detail",
                {'budget_year':context.budget_year,'company_code':company_code,'department_id':department_id},
                {headers: context.commonService.getHeaders()}).toPromise().then(
                    res => {
                            data.concat(res.json().list.forEach(obj=>{
                                data.push({
                                        '公司编码':company_code,
                                        '公司名称':obj.COMPANY_NAME,
                                        '部门编码':department_id,
                                        '部门名称':obj.DEPARTMENT_NAME,
                                        '本年度已签订合同金额':obj.HT_AMOUNT,
                                        '报账总金额':obj.BZ_AMOUNT,
                                        '报账进度':obj.BZ_PRE+"%",
                                        '合同说明':obj.DOCUMENT_DESCRIPTION+obj.DOCUMENT_CODE
                                        });
                        }));
                        length++;
                }
            )
       });
       let inteval = setInterval(function(){
           if(length==$(".t_result tbody input:checkbox:checked").length){
               stopLoading();
               context.excelService.exportAsExcelFile(data,"本年度新增合同列账进度明细表",8);
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

export class DepartMent{
    constructor(public value: number, public name: string){}

}