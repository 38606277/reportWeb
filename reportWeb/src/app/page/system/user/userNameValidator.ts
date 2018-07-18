import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator,AsyncValidator, AbstractControl, NG_ASYNC_VALIDATORS ,ValidationErrors} from '@angular/forms';
import { BaseComponent } from '../../../common/base.component';
import { Http } from '@angular/http';
import { ActivatedRoute} from '@angular/router';
import { AppCommonService } from '../../../common/app-common';

@Directive({
    selector: '[UserNameValidator][ngModel]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UserNameValidator), multi: true }
    ]
})
export class UserNameValidator extends BaseComponent implements Validator{
    private operType:string;
    constructor(private http: Http,private commonService:AppCommonService,private route: ActivatedRoute) {
        super();
        this.operType = route.snapshot.params['operType'];
     }
    validate(control: AbstractControl):Promise<ValidationErrors>{
        if(this.operType=='update'||this.operType=='view'){
            return new Promise(function(resolve,eject){
                resolve(null);    
            });
        }
        let userName = control.value;
        return this.http.post(this.commonService.getReportServerPath()+"/formUser/getCountByUserName",userName,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                let count = parseInt(res.text());
                if(count>0) {
                    return {UserNameValidator: false};
                }
                return null;
            }
        )
    }
}