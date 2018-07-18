import { Component,EventEmitter } from '@angular/core';

@Component({
    selector: 'simplepage-content',
    templateUrl: './simplepage.component.html',
    outputs:['simplepagination'],
    inputs: ['simplepage']
})
export class SimplePageComponent {
    simplepage: SimplePage ;
    simplepagination = new EventEmitter<SimplePage>();
    constructor(){
        //this.page = new Page();
    }
    lastPage()
    {
        if(this.simplepage.currentPage!=1)
        {
            this.simplepage.currentPage-=1;
            this.simplepage.startIndex-=this.simplepage.perPage;
            this.simplepagination.emit(this.simplepage);
        }
    }
    nextPage()
    {
        if(this.simplepage.currentPage!=this.simplepage.totalPage)
        {
            this.simplepage.currentPage+=1;
            this.simplepage.startIndex+=this.simplepage.perPage;
            this.simplepagination.emit(this.simplepage);
        }
    }
    currentPage()
    {
        this.simplepage.startIndex=((this.simplepage.currentPage-1)*this.simplepage.perPage);
        this.simplepagination.emit(this.simplepage);
    }
}
export class SimplePage{
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