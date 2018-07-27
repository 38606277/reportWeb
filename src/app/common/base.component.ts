import { Component } from '@angular/core';
import { Headers } from '@angular/http';
import { Page } from './page.component';
import { SimplePage } from './simplepage.component';
declare var $: any;
export class BaseComponent {
    
    protected setTotalPage(page: Page,totalRows: number)
    {
        let remainder = totalRows%page.perPage;
        if(remainder==0)
        {
            page.totalPage = totalRows/page.perPage;
        }
        else if(totalRows>0&&totalRows<page.perPage)
        {
            page.totalPage = 1;
        }
        else
        {
            page.totalPage = Math.ceil(totalRows/page.perPage);
        }
    }
	protected setTotalPageToSimple(simplepage: SimplePage,totalRows: number)
    {
        let remainder = totalRows%simplepage.perPage;
        if(remainder==0)
        {
            simplepage.totalPage = totalRows/simplepage.perPage;
        }
        else if(totalRows>0&&totalRows<simplepage.perPage)
        {
            simplepage.totalPage = 1;
        }
        else
        {
            simplepage.totalPage = Math.ceil(totalRows/simplepage.perPage);
        }
    }

    scroll(){
        window.document.onscroll = function() {
            let scroll_height = document.documentElement.scrollTop || document.body.scrollTop; 
            //let f_table_height = $(".f_table").height();
            if(scroll_height>0){
                $(".fix_screen").show();
                $(".fix_screen").empty().append($(".t_result").clone().html());
                $(".f_table").hide();
                $(".t_result table thead").show();
                $(".fix_screen").width($(".t_result").width());
                $(".fix_screen").height($(".t_result thead").height());
                $(".fix_screen thead input").click(function(){
                    if($(".fix_screen thead input:checkbox:checked").length==1){
                        $(".t_result tbody input:checkbox").attr("checked",'true');
                    }else{
                        $(".t_result tbody input:checkbox").removeAttr("checked");
                    }
                });
            }else{
                $(".f_table").show();
                $(".t_result table thead").show();
                $(".fix_screen").empty();
                $(".fix_screen").hide();
            }
        };
        $(".t_result").scroll(function() {
            let width = $(".t_result").scrollLeft();
            $(".fix_screen").scrollLeft(width);
        });
        $(".fix_screen").scroll(function() {
            let width = $(".fix_screen").scrollLeft();
            $(".t_result").scrollLeft(width);
        });
    }

}