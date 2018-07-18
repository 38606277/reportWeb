import { Component, OnInit ,AfterViewInit} from '@angular/core';
import { BaseComponent } from '../../../common/base.component';
import { Http } from '@angular/http';
import { AppCommonService } from '../../../common/app-common';
import { Modal,BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Page } from '../../../common/page.component';
import { BalanceModal,BalanceModalContext,BalanceCloseGuard } from './balanceModal.component';
import { overlayConfigFactory } from 'angular2-modal';
declare var $: any;

@Component({
  selector: 'app-cache',
  templateUrl: './cache.component.html',
  styles: ['ul{border:1px solid #D3D3D3}','#tab1{border:1px solid #D3D3D3;}',
           '#cacheType,#cycleTime{height:35px;width:150px;padding-left:10px;}','#cacheType,input,#cycleTime{border-color:#D3D3D3;}']
})
export class CacheComponent extends BaseComponent implements OnInit,AfterViewInit{
  cacheList: Array<Cache>;
  cache: Cache;   //查询条件
  addCache: Cache;//配置新Cache
  cacheTypes:Array<CacheType>;
  cacheTypes1:Array<CacheType>;
  addConfig: CacheConfig;
  cacheConfig: CacheConfig;//查询条件
  cycleTimes:Array<CycleTime>;
  cacheConfigList: Array<CacheConfig>;
  lambdaWebservicePath: string;//eg:http://localhsot:8090/lambda
  constructor(private http: Http,private commonService:AppCommonService,private modal: Modal) {
    super(); 
    this.cache = new Cache();
    this.addCache = new Cache();
    this.addConfig = new CacheConfig();
    this.cacheConfig = new CacheConfig();
  }
  //初始化列表
  ngOnInit() 
  {
    this.initCacheTypes();
    this.initCacheTypes1();
    this.initCycleTimes();
    this.http.post(this.commonService.getReportServerPath()+"/getLambdaUrl",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res=> this.lambdaWebservicePath = res.text()
		);
  }

  ngAfterViewInit()
  {
     $('#startMonth,#endMonth,#cacheMonth').fdatepicker({
       language:'zh-CN',
       format: 'yyyy-m',
       startView:'year',
       minView:'year',
       maxView:'year',
     });
     var nowTemp = new Date();
		 var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 0, 0, 0, 0, 0);
		 var checkin = $('#startMonth').on('changeDate', function (ev) {
        if (ev.date.valueOf() > checkout.date.valueOf()) {
          var newDate = new Date(ev.date)
          checkout.update(newDate);
        };
        checkin.hide();
        $('#endMonth')[0].focus();
    }).data('datepicker');
		var checkout = $('#endMonth').on('changeDate', function (ev) {checkout.hide();}).data('datepicker');
  }

  initCacheTypes()
  {
    let arr = new Array<CacheType>();
    arr.push(new CacheType("gl","账套缓存"));
    arr.push(new CacheType("allocate","分摊缓存"));
    arr.push(new CacheType("user","用户缓存"));
    arr.push(new CacheType("auth","权限缓存"));
    arr.push(new CacheType("dic","科目缓存"));
    this.cacheTypes = arr;
  }
   initCacheTypes1()
  {
    let arr = new Array<CacheType>();
    arr.push(new CacheType("gl","账套缓存"));
    arr.push(new CacheType("allocate","分摊缓存"));
    this.cacheTypes1 = arr;
  }
  initCycleTimes()
  {
    let arr = new Array<CycleTime>();
    arr.push(new CycleTime(1,"1分钟"));
    arr.push(new CycleTime(5,"5分钟"));
    arr.push(new CycleTime(10,"10分钟"));
    arr.push(new CycleTime(15,"15分钟"));
    arr.push(new CycleTime(30,"30分钟"));
    arr.push(new CycleTime(60,"1小时"));
    arr.push(new CycleTime(180,"3小时"));
    arr.push(new CycleTime(360,"6小时"));
    arr.push(new CycleTime(720,"12小时"));
    arr.push(new CycleTime(1440,"24小时"));
    arr.push(new CycleTime(10080,"一星期"));
    this.cycleTimes = arr;
  }

  getCacheList(cacheType,page?)
  {
    if(!cacheType)
    {
      this.modal.alert()
                .okBtn('确定')
                .showClose(true)
                .title('提示')
                .body('<h4>请先在缓存启动配置项选择一个缓存类型!</h4>')
                .open();
    }
    this.http.post(this.lambdaWebservicePath+"/cache/getAll/"+cacheType,null,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
             this.cacheList = res.json();
         }
		);
  }

  getCachesByPeriod(cacheType)
  {
    this.http.post(this.lambdaWebservicePath+"/cache/getCachesByPeriod/"+cacheType,this.cache,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
             this.cacheList = res.json();
         }
		);
  }

  restartCache(cacheType)
  {
      this.addCache.startMonth = $("#startMonth").val();
      this.addCache.endMonth = $("#endMonth").val();
      if(!this.addCache.cacheType||!this.addCache.bookId||!this.addCache.startMonth||!this.addCache.endMonth)
      {
          return;
      }

      this.http.post(this.lambdaWebservicePath+"/cache/restart/"+cacheType,this.addCache,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
              if("ok"==res.text()){
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>启动成功!</h4>')
                        .open();
                    }else{
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>启动失败!</h4>')
                        .open();
                    }
         }
		);
  }

  removeCache(cache,cacheType){
    this.http.post(this.lambdaWebservicePath+"/cache/removeCache/"+cacheType,cache,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
              this.cacheList = res.json();
         }
		);
  }

  reloadCache(cache,cacheType)
  {
    this.http.post(this.lambdaWebservicePath+"/cache/reload/"+cacheType,cache,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
              this.cacheList = res.json();
         }
		);
  }

  showCacheDetail(cache)
  {
      let pContext = new BalanceModalContext();
      pContext.cache = cache;
      pContext.lambdaWebservicePath = this.lambdaWebservicePath;
      let guard = new BalanceCloseGuard();
      
      this.modal.open(BalanceModal, overlayConfigFactory(pContext, BSModalContext)).then(
          dialogref=>{
                dialogref.setCloseGuard(guard);
          }
      );
  }

  getCacheConfigList()
  {
    this.http.post(this.lambdaWebservicePath+"/cache/getAllCacheConfig",this.cacheConfig,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
              this.cacheConfigList = res.json();
         }
		);
  }

  addCacheConfig()
  {
    if(!this.addConfig.cacheType||!this.addConfig.cycleTime)
    {
        return;
    }
    this.addConfig.cacheMonth = $("#cacheMonth").val();
    this.http.post(this.lambdaWebservicePath+"/cache/addCacheConfig",this.addConfig,{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
            this.modal.alert()
                .okBtn('确定')
                .showClose(true)
                .title('提示')
                .body('<h4>'+res.json().retMsg+'</h4>')
                .open();
         }
		);
  }

  selectCacheTypeChange(value)
  {
    this.addConfig.cacheType = value;
    if('user'==value||'auth'==value)
    {
      this.addConfig.bookId=null;
      this.addConfig.cacheMonth=null;
    }
  }

  selectCacheTypeChange1(value)
  {
    this.addCache.cacheType = value;
  }

  selectCycleTimeChange(value)
  {
    this.addConfig.cycleTime = value;
  }

  removeCacheConfig(obj)
  {
    this.http.post(this.lambdaWebservicePath+"/cache/removeCacheConfig",[obj,this.cacheConfig],{headers: this.commonService.getHeaders()}).toPromise().then(
         res => {
           this.cacheConfigList = res.json();
         }
    );
  }

}

export class Cache{
  cacheType;
  bookId;
  period;
  startMonth;
  endMonth;
  status;//缓存状态
  cacheTime;//缓存时间
  count;//记录数
  constructor(){}
  toString()
  {
    "{cacheType="+this.cacheType+",bookId="+this.bookId+",period="+this.period+",startMonth="+this.startMonth+",endMonth="+this.endMonth+
    ",cacheTime="+this.cacheTime+",count="+this.count+"}";
  }
}
export class CacheType{
  type; //类型,"gl"/"allocate"
  text; //描述
  constructor(type,text){
    this.type = type;
    this.text = text;
  }
}
export class CacheConfig
{
  id;
  bookId;
  cacheMonth;
  cycleTime;
  cycleTimeText;
  cacheType;
  cacheTypeText;
  createDate;
  constructor(){}
}
export class CycleTime
{
  time: number;//正整数
  text;//描述
  constructor(time,text){
    this.time = time;
    this.text = text;
  }
}