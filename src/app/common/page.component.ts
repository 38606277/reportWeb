import { Component,EventEmitter } from '@angular/core';

@Component({
    selector: 'page-content',
    templateUrl: './page.component.html',
    outputs:['pagination'],
    inputs: ['page']
})
export class PageComponent {
    page: Page ;
    pagination = new EventEmitter<Page>();
    constructor(){
        //this.page = new Page();
    }
    lastPage()
    {
        if(this.page.currentPage!=1)
        {
            this.page.currentPage-=1;
            this.page.startIndex-=this.page.perPage;
            this.pagination.emit(this.page);
        }
    }
    nextPage()
    {
        if(this.page.currentPage!=this.page.totalPage)
        {
            this.page.currentPage+=1;
            this.page.startIndex+=this.page.perPage;
            this.pagination.emit(this.page);
        }
    }
    currentPage()
    {
        this.page.startIndex=((this.page.currentPage-1)*this.page.perPage);
        this.pagination.emit(this.page);
    }
}
export class Page{
    startIndex = 0;  //起始记录数
    currentPage = 0; //当前页数
    totalPage = 0;   //总的页数
    // perPage = 0;     //每页记录数

    constructor(public perPage: number){}
    toString()
    {
        return "{startIndex:"+this.startIndex+",currentPage:"+this.currentPage+",totalPage:"+this.totalPage+"}";
    }
}