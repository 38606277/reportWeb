import { Component ,OnInit} from '@angular/core';
import { echarts} from './theme';
declare var $: any;
@Component({
    templateUrl: './asset.html'
})
export class AssetComponent implements OnInit{
    
    constructor(){}

    ngOnInit()
    {
        //地图
        $.getJSON("/assets/hubei.json",function(data){
        echarts.registerMap('hubei',data);
        var option1 = {
            title: {
                text: '湖北移动用户区域人数统计(2017)',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var value = params.value;
                    return params.seriesName + '<br/>' + params.name + ': ' + value + '人';
                }
            },
            visualMap: [{
                type:'continuous',
                left: 'left',
                min: 10000,
                max: 500000,
                // inRange: {
                //     //color: ['#e52c3c','#f7b1ab','#fa506c','#f59288','#f8c4d8','#e54f5c','#f06d5c','#e54f80','#f29c9f','#eeb5b7']
                //     color:['#1e88e5','#8C8C8C','#29b6f6','#C4C4C4','#7171C6','#8A2BE2','#63B8FF','#CD3333']
                // },
                text:['高','低'],
                calculable: true
            }],
            toolbox: {
                show: true,
                left: 'right',
                top: 'top',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [{
                        name: '用户统计',
                        type: 'map',
                        roam: false, 
                        map: 'hubei',
                        itemStyle:{
                            normal:{label:{show:true}},
                            emphasis:{label:{show:true}}
                        },
                        data:[
                            {name: '武汉市', value: 490000},
                            {name: '黄石市', value: 460000},
                            {name: '十堰市', value: 430000},
                            {name: '襄阳市', value: 400000},
                            {name: '神农架林区', value: 370000},
                            {name: '恩施土家族苗族自治州', value: 340000},
                            {name: '宜昌市', value: 310000},
                            {name: '荆门市', value: 280000},
                            {name: '荆州市', value: 250000},
                            {name: '潜江市', value: 220000},
                            {name: '仙桃市', value: 190000},
                            {name: '天门市', value: 160000},
                            {name: '孝感市', value: 130000},
                            {name: '随州市', value: 100000},
                            {name: '黄冈市', value: 70000},
                            {name: '鄂州市', value: 40000},
                            {name: '咸宁市', value: 10000}
                        ]
            }]
        };
       var myChart1 = echarts.init($("#hubei-map")[0],'sakura');
        myChart1.setOption(option1);
      });
      //仪表盘
      var option2 = {
            title:{
                text: '完成率',
                left: 'left'
            },
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name:'业务指标',
                    type:'gauge',
                    splitNumber: 10,       // 分割段数，默认为5
                    // axisLine: {            // 坐标轴线
                    //     lineStyle: {       // 属性lineStyle控制线条样式
                    //         color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']], 
                    //         width: 8
                    //     }
                    // },
                    // axisTick: {            // 坐标轴小标记
                    //     splitNumber: 10,   // 每份split细分多少段
                    //     length :12,        // 属性length控制线长
                    //     lineStyle: {       // 属性lineStyle控制线条样式
                    //         color: 'auto'
                    //     }
                    // },
                    // axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    //     textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    //         color: 'auto'
                    //     }
                    // },
                    // splitLine: {           // 分隔线
                    //     show: true,        // 默认显示，属性show控制显示与否
                    //     length :30,         // 属性length控制线长
                    //     lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    //         color: 'auto'
                    //     }
                    // },
                    // pointer : {
                    //     width : 5
                    // },
                    title : {
                        show : true,
                        offsetCenter: [0, '-40%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    detail : {
                        formatter:'{value}%',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder'
                        }
                    },
                    data:[{value: 50, name: '完成率'}]
                }
            ]
        };
        var myChart2 = echarts.init($("#dashboard")[0],'sakura');
        myChart2.setOption(option2);
        var option3 = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name:'个性化仪表盘',
                    type:'gauge',
                    // center : ['80%', '50%'],    // 默认全局居中
                    // radius : [0, '75%'],
                    startAngle: 140,
                    endAngle : -140,
                    min: 0,                     // 最小值
                    max: 100,                   // 最大值
                    precision: 0,               // 小数精度，默认为0，无小数点
                    splitNumber: 10,             // 分割段数，默认为5
                    axisLine: {            // 坐标轴线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, 'lightgreen'],[0.4, 'orange'],[0.8, 'skyblue'],[1, '#ff4500']], 
                            width: 30
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        show: true,        // 属性show控制显示与否，默认不显示
                        splitNumber: 5,    // 每份split细分多少段
                        length :8,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: '#eee',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                        show: true,
                        formatter: function(v){
                            switch (v+''){
                                case '10': return '弱';
                                case '30': return '低';
                                case '60': return '中';
                                case '90': return '高';
                                default: return '';
                            }
                        },
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        length :30,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: '#eee',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    pointer : {
                        length : '80%',
                        width : 8,
                        color : 'auto'
                    },
                    title : {
                        show : true,
                        offsetCenter: ['-65%', -10],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333',
                            fontSize : 15
                        }
                    },
                    detail : {
                        show : true,
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderWidth: 0,
                        borderColor: '#ccc',
                        width: 100,
                        height: 40,
                        offsetCenter: ['-60%', 10],       // x, y，单位px
                        formatter:'{value}%',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontSize : 30
                        }
                    },
                    data:[{value: 50, name: 'CPU使用率'}]
                }
            ]
        };
        var myChart3 = echarts.init($("#dashboard1")[0],'sakura');
        myChart3.setOption(option3);
        var option5 = {
            title:{text:'用户业务量视图'},
            tooltip:{trigger:'axis'},
            toolbox:{show:true,feature:{mark:{show:true},restore:{show:true},saveAsImage:{show:true}}},
            legend:{data:['流量','语音']},
            xAxis:{name:'单位：小时',data:['0-2','2-4','4-6','6-8','8-10','10-12','12-14','14-16','16-18','18-20','20-22','22-24']},
            yAxis:{name:'单位：M/分钟'},
            series:[{name:'流量',type:'bar',data:['220','10','20','0','0','230','330','430','630','230','800','1230']},
            {name:'语音',type:'bar',data:['220','10','20','0','0','230','330','430','630','230','800','1230']}]
        }
        var myChart5 = echarts.init($("#user_consume")[0],'sakura');
        myChart5.setOption(option5);
        var option6 = {
            title:{text:'用户渠道接触视图',left:'center'},
            tooltip:{},
            toolbox:{show:true,feature:{mark:{show:true},restore:{show:true},saveAsImage:{show:true}}},
            legend:{data:['服务咨询','前台业务办理','电话业务办理','客户投诉','其他'],left:'left',orient:'vertical'},
            series:[{name:'接触渠道',type:'pie',startAngle:180,radius:'55%',center:['50%','60%'],
                    data:[{name:'服务咨询',value:'833'},{name:'前台业务办理',value:'2333'},{name:'电话业务办理',value:'1333'},
                    {name:'客户投诉',value:'153'},{name:'其他',value:'855'}]}]
        }
        var myChart6 = echarts.init($("#user_contact")[0],'sakura');
        myChart6.setOption(option6);
        var option7 = {
            title:{text:'用户满意度视图',left:'center'},
            tooltip:{trigger: 'axis'},
            toolbox:{show:true,feature:{mark:{show:true},restore:{show:true},saveAsImage:{show:true}}},
            grid: {containLabel: true},
            legend:{data:['消费总额','资费使用','网络使用','投诉','咨询','渠道业务办理'],left:'left',orient:'vertical'},
            xAxis:[{name:'      年份/2016',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']}],
            yAxis:[{type:'value',name:'消费总额',min: 0,max: 300000,position:'left'},
                   {type:'value',name:'满意度',min:0,max:100,position:'right',axisLabel:{formatter:'{value}%'}}],
            series:[{name:'消费总额',type:'line',label:{normal:true,position:'top'},data:['53000','51000','100000','250000','30000','100000','120000','130000','140000','150000','160000','170000']},
                    {name:'资费使用',type:'bar',yAxisIndex: 1,label:{normal:true,position:'top'},data:['30','31','55','90','23','29','30','35','40','45','50','55']},
                    {name:'网络使用',type:'bar',yAxisIndex: 1,label:{normal:true,position:'top'},data:['31','32','56','91','24','30','31','36','41','46','51','56']},
                    {name:'投诉',type:'bar',yAxisIndex: 1,label:{normal:true,position:'top'},data:['32','33','57','92','25','31','32','37','42','47','52','57']},
                    {name:'咨询',type:'bar',yAxisIndex: 1,label:{normal:true,position:'top'},data:['33','34','58','93','26','32','33','38','43','48','53','58']},
                    {name:'渠道业务办理',type:'bar',yAxisIndex: 1,label:{normal:true,position:'top'},data:['34','35','59','94','27','33','34','39','44','49','54','59']}]
        }
        var myChart7 = echarts.init($("#user_satisfication")[0],'sakura');
        myChart7.setOption(option7);
    }
}