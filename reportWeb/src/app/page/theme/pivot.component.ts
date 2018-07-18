import { Component,OnInit } from '@angular/core';
declare var $: any;
@Component({
    templateUrl: './pivot.component.html'
})
export class PivotComponent implements OnInit{
    constructor() { }

    ngOnInit()
    {
        var derivers = $.pivotUtilities.derivers;
        var renderers = $.extend($.pivotUtilities.renderers,
            $.pivotUtilities.c3_renderers);

        $.getJSON("/assets/mps.json", function(mps) {
            $("#output").pivotUI(mps, {
                renderers: renderers,
                cols: ["Party"],
                rows: ["Province"],
                rendererName: "Horizontal Stacked Bar Chart",
                rowOrder: "value_z_to_a", 
                colOrder: "value_z_to_a",
                rendererOptions: {
                    c3: { data: {colors: {
                        Liberal: '#dc3912', Conservative: '#3366cc', NDP: '#ff9900',
                        Green:'#109618', 'Bloc Quebecois': '#990099'
                    }}}
                }
            });
        });
    }

}