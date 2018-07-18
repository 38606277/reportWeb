import { Component,ElementRef ,OnInit,AfterViewInit,ViewChild,Renderer2} from '@angular/core';
import { Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
import { BaseComponent } from '../../common/base.component';
import { ActivatedRoute} from '@angular/router';
declare var $: any;

@Component({
    templateUrl: './reporttask.component.html',
    styles:[`.table th, .table td{text-align: center;vertical-align: middle!important;}`]
})
export class ReportTaskComponent extends BaseComponent implements OnInit{
  report_id:string;
  user_id:string;
  taskList:Array<ReportTask>;
  cellNames:Array<string>;

  constructor(private http: Http,private commonService:AppCommonService,private route: ActivatedRoute) {
    super();
    this.report_id = route.snapshot.params['report_id'];
    this.user_id = route.snapshot.params['user_id'];
  }

  ngOnInit(){
    this.qryCurrentReportTask();
  }

  qryCurrentReportTask(){
    let param = {reportId:this.report_id,userId:this.user_id};
    this.http.post(this.commonService.getReportServerPath()+"/formReport/viewTask",param,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                      this.taskList = res.json().data;
                      if(this.taskList.length>0){
                        let taskCells = this.taskList[0].taskCells;
                        this.cellNames = new Array<string>();
                        for(let taskCell of taskCells){
                          this.cellNames.push(taskCell.cell_name);
                        }
                      }
                  }
    );
  }

  updateReportData(report_id,user_id,taskCells){
    let task_cells = new Array<any>();
    taskCells.forEach(taskCell=>{
      task_cells.push({cellId:taskCell.cell_id,cellValue:taskCell.cell_value});
    });
    let param = {report_id:report_id,user_id:user_id,task_cells:task_cells}
    this.http.post(this.commonService.getReportServerPath()+"/formReport/updateReportData",param,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                }
    );
    //查询完需要更新填报状态,已填报则置灰填报按钮
    this.qryCurrentReportTask();
  }
}
export class ReportTask{
  constructor(public report_id:number,public user_id:string,public create_by:string,
              public state:string,public taskCells:Array<ReportTaskCell>){}
}
export class ReportTaskCell{
  constructor(public cell_id:number,public report_id:number,public user_id:string,public sheet_name:string,
              public cell_address:string,public cell_name:string,public cell_value:string,public cell_type:string){}
}