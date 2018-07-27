import { Component ,OnInit} from '@angular/core';
declare var $: any;

@Component({
    templateUrl: './webservice.component.html'
})
export class WebServiceComponent implements OnInit{
    
    constructor() {
     }

    ngOnInit()
    {
        $("#file-1").fileinput({
            language: 'zh',//设置语言
            uploadUrl: "", //上传的地址
            allowedFileExtensions:['wsdl','WSDL'],//接收的文件后缀
            showUpload:true,//是否显示上传按钮
            showPreview: false,
            browseClass:"btn btn-primary"//按钮样式      
        });
    }
    
    _submit()
    {
        
    }
}