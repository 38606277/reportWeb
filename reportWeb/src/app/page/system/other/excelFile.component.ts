import { Component ,OnInit} from '@angular/core';
import { CommonModule }     from '@angular/common';
import { AppCommonService } from '../../../common/app-common';
import { Http,Headers, RequestOptions } from '@angular/http';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { CookieService } from 'ngx-cookie';
declare var $: any;

@Component({
    templateUrl: './excelFile.component.html'
})
export class ExcelFileComponent implements OnInit {
    protected headers = new Headers({'Content-Type': 'application/json;charset=UTF-8'});
    excelType:string;
    cities:string;
    formData: FormData;
    constructor(private commonService:AppCommonService,private cookieService:CookieService,private http: Http,private modal: Modal) {
        this.formData = new FormData();    
        this.excelType = "";
        this.cities = "";
    }
   ngOnInit()
    {
        $("#excelFile").fileinput({
            language: 'zh',//设置语言
            allowedFileExtensions:['xlsx','xls'],//接收的文件后缀
            showUpload:false,//是否显示上传按钮
            showRemove:true,
            showPreview: false,
            browseClass:"btn btn-primary"//按钮样式      
        });
        
    }
    _submit(){
            console.log(this.excelType);
            console.log(this.formData);


        if(this.excelType==""){
            this.modal.alert()
                .okBtn('确定')
                .showClose(true)
                .title('提示')
                .body('<h4>请选择类型!</h4>')
                .open();
        }else if(this.cities==""){
            this.modal.alert()
                .okBtn('确定')
                .showClose(true)
                .title('提示')
                .body('<h4>请选择地市!</h4>')
                .open();
        }else{

            let svcCredentials = "{'UserCode':'sysadmin','Pwd':'dBLggK+2oofonatC2y8FzQ=='}";
            let headers = new Headers({ 
                "Content-Type": "multipart/form-data",
                "credentials" : svcCredentials
            });
            $("#submitBtn").attr("disabled",true);
            //let options = new RequestOptions({ headers });
            this.http.post(this.commonService.getReportServerPath()+"/file/uploadExcelFile/"+this.excelType+"/"+this.cities+"/"+this.cookieService.get('credentials'), this.formData, {headers:headers}).toPromise().then(
                res => {
                    console.log(res.json().state);
                    if("success"==res.json().state){
                        $("#submitBtn").attr("disabled",false);
                        this.modal.alert()
                            .okBtn('确定')
                            .showClose(true)
                            .title('提示')
                            .body('<h4>测试成功!</h4>')
                            .open();
                    }else{
                        $("#submitBtn").attr("disabled",false);
                        this.modal.alert()
                            .okBtn('确定')
                            .showClose(true)
                            .title('提示')
                            .body('<h4>'+res.json().msg+'</h4>')
                            .open();
                    }
                }
            );
        }
    }
    onFileChanged(fileList: FileList) {
        this.formData = new FormData();
        if (fileList.length > 0) {
            let file: File = fileList[fileList.length-1];
            this.formData.append('uploadFile', file, file.name); 
        }
        // if (fileList.length > 0) {
        //     let file: File = fileList[0];
        //     let formData: FormData = new FormData();
        //     formData.append('uploadFile', file, file.name);            
        //     let headers = new Headers({ 
        //         "Content-Type": "multipart/form-data"
        //     });
        //     //let options = new RequestOptions({ headers });
        //     this.http.post(this.commonService.getReportServerPath()+"/file/uploadExcelFile", formData, headers).toPromise().then(
        //         res => {
        //             console.log(res.text);
        //         }
        //     );
        // }
    }
    
}