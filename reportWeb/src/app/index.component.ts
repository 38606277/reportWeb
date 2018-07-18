import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AppCommonService } from './common/app-common';
import { IndexService } from './index.service';
import { RecursionComponent } from './page/report/recursion.component';
import { Modal,BSModalContext  } from 'angular2-modal/plugins/bootstrap';
import { CustomCloseGuard } from './modal/common.component';
import { UserViewComponent } from './modal/userview.component';
import { overlayConfigFactory } from 'angular2-modal';
import { DialogRef} from 'angular2-modal';
import { PromptCloseGuard,PromptModalContext,PromptModal} from './common/promptmodal.component';
declare var $:any;
declare var FastClick:any;

@Component({
    templateUrl: './index.component.html',
    styles:['.content{padding-top:0px;}']
})
export class IndexComponent implements OnInit,AfterViewInit{
    myReports;
    myTemplates;
    budgetReportTemplates;
    isAdmin: number =0;
    ibas2DownloadPath;
    menuList:Map<number,boolean>;
    dialog:DialogRef<any>;
    private unfinishTaskList:Array<any>;
    private finishedTaskList:Array<any>;
    
    constructor(private router:Router,private cookieService:CookieService,
                private indexService:IndexService,private modal: Modal,private route: ActivatedRoute){
        let userName = route.snapshot.queryParams['userName'];
        if(userName){
            let Days = 3/24;
            let exp = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            this.cookieService.put('credentials',JSON.stringify({UserCode:userName,Pwd:'',isAdmin:0}),{'expires':exp});
        }
        this.menuList = new Map<number,boolean>();
        this.isAdmin = JSON.parse(this.cookieService.get('credentials')).isAdmin;
    }

    getIbas2DownloadPath()
    {
        this.ibas2DownloadPath = this.indexService.getIbas2DownloadPath();
    }

    ngOnInit()
    {
        let int = window.setInterval(()=>{
            if(this.cookieService.get('credentials')==null)
            {
                window.clearInterval(int);
                this.router.navigate(['']);
            }
        },60*1000);
        this.indexService.getMyReports().then(
            data => this.myReports = data
        );
        this.indexService.getMyTemplates().then(
            data => this.myTemplates = data
        );
        this.indexService.qryMenuList().then(
            data => {
                for(let i=0;i<data.length;i++){
                    this.menuList.set(data[i].func_id,true);
                }
            }
        );
        this.indexService.getBudgetReport().then(
            data => this.budgetReportTemplates = data
        );
    }

    getTaskList(state){
        if(state=="3"){
            this.indexService.getTaskList(state).then(
                data => this.finishedTaskList = data
            );
        }else{
            this.indexService.getTaskList(state).then(
                data => this.unfinishTaskList = data
            );
        }
    }

    showUserView(){
        let guard = new CustomCloseGuard(this);
        this.modal.open(UserViewComponent, overlayConfigFactory(null, BSModalContext)).then(
            dialogref=>{
                 dialogref.setCloseGuard(guard);
                 this.dialog = dialogref;
            }
        );
    }

    okButton(){
        this.cookieService.remove('credentials');
        this.router.navigate(['']);
    }

    cancelButton(){
        this.cookieService.remove('credentials');
        this.router.navigate(['']);
    }

    selectOk(){
        this.dialog.result.then(
            data=>{
                let resultCode = data.resultCode;
                let message = data.message;
                if("1000"==resultCode){
                    let guard = new PromptCloseGuard(this);
                    let context = new PromptModalContext();
                    context.message = "修改成功,请重新登录!";
                    this.modal.open(PromptModal, overlayConfigFactory(context, BSModalContext)).then(
                        dialogref=>{
                            dialogref.setCloseGuard(guard);
                            this.dialog = dialogref;
                        }
                    );
                }else{
                    this.modal.alert()
                    .okBtn('确定')
                    .showClose(true)
                    .title('提示')
                    .body('<h4>'+message+'</h4>')
                    .open();
                }
            }
        );
    }

    ngAfterViewInit()
    {
        var resizefunc = [];
        var Sidemenu = function() {
            this.$body = $("body"),
            this.$openLeftBtn = $(".open-left"),
            this.$menuItem = $("#sidebar-menu a")
        };
        Sidemenu.prototype.openLeftBar = function() {
            $("#wrapper").toggleClass("enlarged");
            $("#wrapper").addClass("forced");

            if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
                $("body").removeClass("fixed-left").addClass("fixed-left-void");
            } else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
                $("body").removeClass("fixed-left-void").addClass("fixed-left");
            }
            
            if($("#wrapper").hasClass("enlarged")) {
                $(".left ul").removeAttr("style");
            } else {
                $(".subdrop").siblings("ul:first").show();
            }
            
            toggle_slimscroll(".slimscrollleft");
            $("body").trigger("resize");
        },
        //menu item click
        Sidemenu.prototype.menuItemClick = function(e) {
            $(this).addClass("a_bg_color");
            var content = $(this).text();
            $("#sidebar-menu a:not(:contains("+content+"))").removeClass("a_bg_color");
            if(!$("#wrapper").hasClass("enlarged")){
                if($(this).parent().hasClass("has_sub")){
                if(!$(this).hasClass("active")){
                    e.preventDefault();
                }
                }   
                if(!$(this).hasClass("subdrop")) {
                // hide any open menus and remove all other classes
                $("ul",$(this).parents("ul:first")).slideUp(350);
                $("a",$(this).parents("ul:first")).removeClass("subdrop");
                $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");
                
                // open our new menu and add the open class
                $(this).next("ul").slideDown(350);
                $(this).addClass("subdrop");
                //$(".pull-right i",$(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
                //$(".pull-right i",$(this).siblings("ul")).removeClass("md-remove").addClass("md-add");
                $(".pull-right i",$(this).parents(".has_sub:last")).removeClass("md-remove").addClass("md-add");
                $(".pull-right i:eq(0)",$(this).parents(".has_sub:last")).addClass("md-remove");
                $(".pull-right i",$(this)).removeClass("md-add").addClass("md-remove");
                }else if($(this).hasClass("subdrop")) {
                $(this).removeClass("subdrop");
                $(this).next("ul").slideUp(350);
                $(".pull-right i",$(this).parent()).removeClass("md-remove").addClass("md-add");
                }
            }
            else
            {
                if($(this).parent().hasClass("has_sub")){
                    if(!$(this).hasClass("active")){
                        e.preventDefault();
                    }
                }   
            }
        },

        //init sidemenu
        Sidemenu.prototype.init = function() {
            var $this  = this;
            //bind on click
            $(".open-left").click(function(e) {
                e.stopPropagation();
                $this.openLeftBar();
            });

            // LEFT SIDE MAIN NAVIGATION
            //$this.$menuItem.on('click', $this.menuItemClick);
            $("#sidebar-menu").delegate("a","click",$this.menuItemClick);
            // NAVIGATION HIGHLIGHT & OPEN PARENT
            $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
        },

        //init Sidemenu
        $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu;

        var FullScreen = function() {
            this.$body = $("body"),
            this.$fullscreenBtn = $("#btn-fullscreen")
        };

        //turn on full screen
        // Thanks to http://davidwalsh.name/fullscreen
        FullScreen.prototype.launchFullscreen  = function(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        FullScreen.prototype.exitFullscreen = function() {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } 
            // else if(document.mozCancelFullScreen) {
            //     document.mozCancelFullScreen();
            // }
            else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },
        //toggle screen
        FullScreen.prototype.toggle_fullscreen  = function() {
            var $this = this;
            // var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
            var fullscreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
            if(fullscreenEnabled) {
                // if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if(!document.fullscreenElement && !document.webkitFullscreenElement) {
                $this.launchFullscreen(document.documentElement);
                } else{
                $this.exitFullscreen();
                }
            }
        },
        //init sidemenu
        FullScreen.prototype.init = function() {
            var $this  = this;
            //bind
            $this.$fullscreenBtn.on('click', function() {
                $this.toggle_fullscreen();
            });
        },
        //init FullScreen
        $.FullScreen = new FullScreen, $.FullScreen.Constructor = FullScreen;

        /**
        Portlet Widget
        */
        var Portlet = function() {
            this.$body = $("body"),
            this.$portletIdentifier = ".portlet",
            this.$portletCloser = '.portlet a[data-toggle="remove"]',
            this.$portletRefresher = '.portlet a[data-toggle="reload"]'
        };

        //on init
        Portlet.prototype.init = function() {
            // Panel closest
            var $this = this;
            $(document).on("click",this.$portletCloser, function (ev) {
                ev.preventDefault();
                var $portlet = $(this).closest($this.$portletIdentifier);
                    var $portlet_parent = $portlet.parent();
                $portlet.remove();
                if ($portlet_parent.children().length == 0) {
                    $portlet_parent.remove();
                }
            });

            // Panel Reload
            $(document).on("click",this.$portletRefresher, function (ev) {
                ev.preventDefault();
                var $portlet = $(this).closest($this.$portletIdentifier);
                // This is just a simulation, nothing is going to be reloaded
                $portlet.append('<div class="panel-disabled"><div class="loader-1"></div></div>');
                var $pd = $portlet.find('.panel-disabled');
                setTimeout(function () {
                    $pd.fadeOut('fast', function () {
                        $pd.remove();
                    });
                }, 500 + 300 * (Math.random() * 5));
            });
        },
        //
        $.Portlet = new Portlet, $.Portlet.Constructor = Portlet;
        var MoltranApp = function() {
            this.VERSION = "1.0.0", 
            this.AUTHOR = "Coderthemes", 
            this.SUPPORT = "coderthemes@gmail.com", 
            this.pageScrollElement = "html, body", 
            this.$body = $("body")
        };

        //initializing tooltip
        MoltranApp.prototype.initTooltipPlugin = function() {
            $.fn.tooltip && $('[data-toggle="tooltip"]').tooltip()
        }, 

        //initializing popover
        MoltranApp.prototype.initPopoverPlugin = function() {
            $.fn.popover && $('[data-toggle="popover"]').popover()
        }, 

        //initializing nicescroll
        MoltranApp.prototype.initNiceScrollPlugin = function() {
            //You can change the color of scroll bar here
            $.fn.niceScroll &&  $(".nicescroll").niceScroll({ cursorcolor: '#9d9ea5', cursorborderradius: '0px'});
        },
        //initializing knob
        MoltranApp.prototype.initKnob = function() {
            if ($(".knob").length > 0) {
                $(".knob").knob();
            }
        },
        
        //on doc load
        MoltranApp.prototype.onDocReady = function(e) {
        FastClick.attach(document.body);
        resizefunc.push("initscrolls");
        resizefunc.push("changeptype");

        $('.animate-number').each(function(){
            $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-duration"))); 
        });
        
        //RUN RESIZE ITEMS
        $(window).resize(debounce(resizeitems,100,null));
        $("body").trigger("resize");

        // right side-bar toggle
        $('.right-bar-toggle').on('click', function(e){
            e.preventDefault();
            $('#wrapper').toggleClass('right-bar-enabled');
        }); 

        
        },
        //initilizing 
        MoltranApp.prototype.init = function() {
            var $this = this;
            this.initTooltipPlugin(),
            this.initPopoverPlugin(),
            this.initNiceScrollPlugin(),
            this.initKnob(),
            //document load initialization
            $(document).ready($this.onDocReady);
            //creating portles
            $.Portlet.init();
            //init side bar - left
            $.Sidemenu.init();
            //init fullscreen
            $.FullScreen.init();
        },

        $.MoltranApp = new MoltranApp, $.MoltranApp.Constructor = MoltranApp;
        $.MoltranApp.init();
        
    }
     _exit()
    {
        this.cookieService.remove('credentials');
        this.router.navigate(['']);
    }
}