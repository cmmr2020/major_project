import * as echarts from '../../../ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_bar_index:'',
    ecBar1: {
      lazyLoad: true,
    },
    ecBar2: {
      lazyLoad: true,
    },
    ecBar3: {
      lazyLoad: true,
    },
    ecBar4: {
      lazyLoad: true,
    },
    ecBar5: {
      lazyLoad: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      show_bar_index:options.char_index
    })
    if(options.char_index=='1'){
      this.init_char1(options.data)
    }else if(options.char_index=='2'){
      this.init_char2(options.data)
    }else if(options.char_index=='3'){
      this.init_char3(options.data)
    }else if(options.char_index=='4'){
      this.init_char4(options.data)
    }else if(options.char_index=='5'){
      this.init_char5(options.data)
    }
  },
  init_char1:function(dataStr){
    var that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar1');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const barChart = echarts.init(canvas,'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
    that.setOption1(barChart,JSON.parse(dataStr))
    // canvas.setChart(barChart);
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    that.ecBar1 = barChart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return barChart;
  })
  },
  setOption1:function(myChar,data){
    var dimensions = new Array();
    var oknums = new Array();
    var unOkNums = new Array();
    var rates = new Array();
    for (var i=0; i<data.length; i++){
      dimensions.push(data[i].name);
      oknums.push(data[i].standardNum);
      unOkNums.push(data[i].notNum);
      rates.push(data[i].rateStr);
    }
    const option = {
      //提示框组件
      tooltip: {
        show:true,
        /**
         * 触发类型
         * ‘item’数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
         * ‘axis’坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
         * ‘none’不触发
         */
        trigger: 'axis',
        /**
         * 这是坐标轴指示器的全局公用设置。
         */
        axisPointer: {
          type: 'cross', //指示器类型 ‘line’ 直线指示器  ‘shadow’ 阴影指示器 cross十字准星  ‘none’无指示器
          crossStyle: {
            color: '#999'
          }
        },
        triggerOn:"mousemove", //提示框触发的条件  mousemove 鼠标移动时触发  click 鼠标点击时触发   mousemove|click 同时鼠标移动和点击时触发
        hideDelay:0, //浮层隐藏的延迟，单位为 ms
        formatter:function (params) {
          // do some thing
          //console.log(params)
          var resultStr = "";
          params.forEach(function (item,i){
                if (i == 0) {
                  resultStr += item.axisValue + '\n' + item.marker + item.seriesName +'：';
                  if(item.componentSubType=='line'){
                    resultStr+=item.value+'%\n'
                  }else{
                    resultStr+=item.value+'\n'
                  }
                } else {
                  resultStr += item.marker + item.seriesName +'：';
                  if(item.componentSubType=='line'){
                    resultStr+=item.value+'%\n'
                  }else{
                    resultStr+=item.value+'\n'
                  }
                }
              }
          )
          return resultStr;
        },
        textStyle:{
          fontStyle:'normal',
          fontWeight:'bolder',
          fontSize:'13'
        }
      },
      textStyle:{
        color:"#fff",
        fontStyle:"normal",
        fontSize:"12"
      },
      title:{
        show:true,
        text:'点位类型测评符合情况',
        left:'center',
      },
      legend:{  //图例组件
        type:'plain',
        show:true,
        top:'10%',
        left:'right',
        textStyle:{
          color:"#fff",
          fontStyle:"normal",
          fontSize:"10"
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: 100,
        containLabel: true
      },
      dataZoom : [
      //1.横向使用滚动条
      {
        type: 'inside',//有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
        show: false,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
        xAxisIndex: [0],// 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
        bottom:'5%', //距离底部的距离
        start:0,
        end:30
      },
      //2.在内部可以横向拖动
      {
        type: 'inside',// 内置于坐标系中
      /*                start: 0,
        end: 30,*/
        xAxisIndex: [0]
      }
      ],
      toolbox: {
        feature: {
          dataView: {show: false, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: false}
        },
        iconStyle:{
          color:{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
            }, {
              offset: 1, color: 'blue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          borderColor:'#666',
          borderWidth:1,
          borderType:"solid"
        },
        right:'8%'
      },
      xAxis: [
        {
          type: 'category', //value 数值轴  category 类目轴  time 时间轴 log 对数轴
          data: dimensions,//['城市社区','小学','主次干道','居住小区','社区综合'],
          axisPointer: { //坐标轴指示器配置项
            type: 'shadow'
          },
          splitLine: { //坐标轴在 grid 区域中的分隔线。
            show: false
          },
          axisTick:{ //坐标轴刻度相关设置。
            show:false,
            alignWithLabel:true, //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
            interval:'auto', //坐标轴刻度的显示间隔，在类目轴中有效
          },
          axisLabel:{//坐标轴刻度标签的相关设置。
            show:true,
            interval:0,
            inside:false,
            rotate:316,
            //showMaxLabel:true,
            fontSize:10,
            formatter:function (value) {
              //console.log(value)
              //console.log(value.length)
              if (value.length>4){
                return value.slice(0,4)+"..."
              }
              return value;
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',  //value 数值轴  category 类目轴  time 时间轴 log 对数轴
          name: '指标数量', //坐标轴名称
          nameGap:10,
          nameTextStyle:{
            fontStyle:'normal',
            fontSize:10,
          },
          axisLabel: {  //坐标轴刻度标签的相关设置。
            fontStyle:'normal',
            fontSize:10,
            formatter: '{value}'
          },
          splitLine: { //坐标轴在 grid 区域中的分隔线
            show: false
          },
          splitNumber:4,
          scale:true,
          nameLocation:'end'  //坐标轴名称显示位置。
        },
        {
          type: 'value',
          name: '符合率',
          nameGap:10,
          nameTextStyle:{
            fontStyle:'normal',
            fontSize:10,
          },
          min: 0, //坐标轴刻度最小值。 可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。  不设置时会自动计算最小值保证坐标轴刻度的均匀分布
          max: 100,//坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。  不设置时会自动计算最大值保证坐标轴刻度的均匀分布。
          interval: 25, //是否是反向坐标轴。
          axisLabel: { //坐标轴刻度标签的相关设置。
            formatter: '{value} %',   //刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
            fontStyle:'normal',
            fontSize:10,
          },
          splitLine: {  //坐标轴在 grid 区域中的分隔线。
            show: false
          },
          nameLocation:'end'  //坐标轴名称显示位置。
        },
      ],
      series: [
        {
          name: '合格指标数',
          type: 'bar',
          itemStyle:{
            normal:{color:"#55a0ed"},
          },
          label:{ //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
            show:true,
            textStyle:{
              fontStyle:'normal',
              //fontWeight:'bolder',
              fontSize:'10'
            }
          },
          data: oknums//[300, 270, 340, 344, 300, 320, 310]
        },
        {
          name: '不合格指标数',
          type: 'bar',
          stack: '总量',
          itemStyle:{
            normal:{color:"#bb3843"},
          },
          label:{
            show:true,
            textStyle:{
              fontStyle:'normal',
              color:'#fff',
              //fontWeight:'bolder',
              fontSize:'10'
            }
          },
          data: unOkNums//[120, 102, 141, 174, 190, 250, 220]
        },
        {
          name: '符合率',
          type: 'line',
          yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
          data: rates,//[25,35,45,55,65,75,85],
          label:{  //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
            show:true,
            formatter:'{c}%',
            textStyle:{
              fontStyle:'normal',
              color:'#fff',
              //fontWeight:'bolder',
              fontSize:'10'
            }
          }
        }
      ]
    };
    myChar.setOption(option);
  },
  init_char2:function(dataStr){
    var that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar2');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const barChart = echarts.init(canvas,'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
    that.setOption2(barChart,JSON.parse(dataStr))
    // canvas.setChart(barChart);
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    that.ecBar2 = barChart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return barChart;
  })
},
  setOption2:function(myChar,data){
    var names =[];
    var nums = [];
    var newObj = data
    newObj.forEach(function(item,i){
      names.push(item.name);
      nums.push(item.rate.toFixed(2))
    })
    const option ={
      title:{
        show:true,
        text:'测评符合率最低的点位',
        left:'center',
      },
      color: ['#3398DB'],
      legend:{
        type:'plain',
        show:true,
        top:'10%',
        left:'right',
        textStyle:{
          color:"#fff",
          fontStyle:"normal",
          fontSize:"10"
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        triggerOn:"mousemove",
        hideDelay:0,
        formatter: function (params) {
          // do some thing
          //console.log(params)
          return params[0].axisValue+'\n'+params[0].marker+'点位符合率：'+params[0].data+'%';
        },
        textStyle:{
          fontStyle:'normal',
          fontWeight:'bolder',
          fontSize:'13'
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: 100,
        containLabel: true
      },
      dataZoom : [
      //1.横向使用滚动条
      {
        type: 'inside',//有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
        show: false,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
        xAxisIndex: [0],// 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
        bottom:'5%', //距离底部的距离
        start:0,
        end:1        
      },
      //2.在内部可以横向拖动
      {
        type: 'inside',// 内置于坐标系中
      /*                start: 0,
        end: 30,*/
        xAxisIndex: [0]
      }
      ],
      toolbox: {
        feature: {
          dataView: {show: false, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: false}
        },
        iconStyle:{
          color:{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
            }, {
              offset: 1, color: 'blue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          borderColor:'#666',
          borderWidth:1,
          borderType:"solid"
        },
        right:'8%'
      },

      textStyle:{
        color:"#fff",
        fontStyle:"normal",
        fontSize:"12"
  
      },
      xAxis: [
        {
          type: 'category',
          data: names,//['公园3', '永太路', '黄海路', '新城东路', '车站北路'],
          axisTick: {
            show:false,
            alignWithLabel: true
          },
          axisLabel: {
            show:false,
            show:true,
            interval:0,
            inside:false,
            rotate:316,
            //showMaxLabel:true,
            fontSize:10,
            formatter:function (value) {
              //console.log(value)
              //console.log(value.length)
              if (value.length>4){
                return value.slice(0,4)+"..."
              }
              return value;
            }
          },
          splitLine: {
            show: false
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '符合率',
          nameGap:10,
          nameTextStyle:{
            fontStyle:'normal',
            fontSize:10,
          },
          min: 0,
          max: 100,
          interval: 25,
          axisLabel: {
            formatter: '{value} %',
            fontStyle:'normal',
            fontSize:10,
          },
          splitLine: {
            show: false
          },
        }
      ],
      series: [
        {
          name: '点位符合率',
          type: 'bar',
          barWidth: 20,
          data: nums,//[58.88, 68.58, 70.58, 73.68, 78.89],
          label:{
            show:true,
            formatter:'{c}%',
            textStyle:{
              fontStyle:'normal',
              //fontWeight:'bolder',
              fontSize:'10',
              color:'#fff'
            }
          }
        }
      ]
    }
    myChar.setOption(option);
  },
  init_char3:function(dataStr){
    var that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar3');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const barChart = echarts.init(canvas,'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
    that.setOption3(barChart,JSON.parse(dataStr))
    // canvas.setChart(barChart);
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    that.ecBar3 = barChart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return barChart;
  });
  },
  setOption3:function (myChar,data) {
    var that = this
    var name;
    var total;
    var complete;
    var ratio;
    //chart1_data = data;
    name = data.pointNameList;
    total = data.quotaTotalList;
    complete = data.quotaCompleteList;
    ratio = data.CompleteRatioList;
    const option = {
      //提示框组件
      tooltip: {
        /**
         * 触发类型
         * ‘item’数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
         * ‘axis’坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
         * ‘none’不触发
         */
        trigger: 'axis',
        /**
         * 这是坐标轴指示器的全局公用设置。
         */
        axisPointer: {
          type: 'cross', //指示器类型 ‘line’ 直线指示器  ‘shadow’ 阴影指示器 cross十字准星  ‘none’无指示器
          crossStyle: {
            color: '#999'
          }
        },
        triggerOn:"mousemove", //提示框触发的条件  mousemove 鼠标移动时触发  click 鼠标点击时触发   mousemove|click 同时鼠标移动和点击时触发
        hideDelay:0, //浮层隐藏的延迟，单位为 ms
        formatter:function (params) {
          // do some thing
          //console.log(params)
          var resultStr = "";
          params.forEach(function (item,i){
                if (i == 0) {
                  resultStr += item.axisValue + '\n' + item.marker + item.seriesName +'：';
                  if(item.componentSubType=='line'){
                    resultStr+=item.value+'%\n'
                  }else{
                    resultStr+=item.value+'\n'
                  }
                } else {
                  resultStr += item.marker + item.seriesName +'：';
                  if(item.componentSubType=='line'){
                    resultStr+=item.value+'%\n'
                  }else{
                    resultStr+=item.value+'\n'
                  }
                }
              }
          )
          return resultStr;
        },
        textStyle:{
          fontStyle:'normal',
          fontWeight:'bolder',
          fontSize:'13'
        }
      },
      grid: {
                left: '5%',
                right: '5%',
                bottom: '5%',
                top: 100,
                containLabel: true
              },
      dataZoom : [
        //1.横向使用滚动条
        {
          type: 'slider',//有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
          show: false,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
          xAxisIndex: [0],// 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
          bottom:'5%', //距离底部的距离
          start:0,
          end:30
        },
        //2.在内部可以横向拖动
        {
          type: 'inside',// 内置于坐标系中
/*                start: 0,
          end: 30,*/
          xAxisIndex: [0]
        }
        ],
        toolbox: {
          feature: {
            dataView: {show: false, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: false}
          },
          iconStyle:{
            color:{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'red' // 0% 处的颜色
              }, {
                offset: 1, color: 'blue' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            borderColor:'#666',
            borderWidth:1,
            borderType:"solid"
          },
          right:'8%'
        },
      textStyle:{
        color:"#fff",
        fontStyle:"normal",
        fontSize:"12"
      },
      title:{
        show:true,
        text:'责任单位测评符合情况',
        left:'center',
      },
      legend:{  //图例组件
        type:'plain',
        show:true,
        top:'10%',
        left:'right',
        textStyle:{
          color:"#fff",
          fontStyle:"normal",
          fontSize:"10"
        }
      },
      xAxis: [
        {
          type: 'category', //value 数值轴  category 类目轴  time 时间轴 log 对数轴
          data: name,//['景德桥社区','市公安局','市住建局','市城管局','康乐社区'],
          axisPointer: { //坐标轴指示器配置项
            type: 'shadow'
          },
          splitLine: { //坐标轴在 grid 区域中的分隔线。
            show: false
          },
          axisTick:{ //坐标轴刻度相关设置。
            show:false,
            alignWithLabel:true, //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
            interval:'auto', //坐标轴刻度的显示间隔，在类目轴中有效
          },
          axisLabel:{//坐标轴刻度标签的相关设置。
            show:true,
            interval:0,
            inside:false,
            rotate:316,
            //showMaxLabel:true,
            fontSize:10,
            formatter:function (value) {
              //console.log(value)
              //console.log(value.length)
              if (value.length>4){
                return value.slice(0,4)+"..."
              }
              return value;
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',  //value 数值轴  category 类目轴  time 时间轴 log 对数轴
          name: '指标数量', //坐标轴名称
          nameGap:10,
          nameTextStyle:{
            fontStyle:'normal',
            fontSize:10,
          },
          axisLabel: {  //坐标轴刻度标签的相关设置。
            fontStyle:'normal',
            fontSize:10,
            formatter: '{value}'
          },
          splitLine: { //坐标轴在 grid 区域中的分隔线
            show: false
          },
          splitNumber:4,
          scale:true,
          nameLocation:'end'  //坐标轴名称显示位置。
        },
        {
          type: 'value',
          name: '符合率',
          nameGap:10,
          nameTextStyle:{
            fontStyle:'normal',
            fontSize:10,
          },
          min: 0, //坐标轴刻度最小值。 可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。  不设置时会自动计算最小值保证坐标轴刻度的均匀分布
          max: 100,//坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。  不设置时会自动计算最大值保证坐标轴刻度的均匀分布。
          interval: 25, //是否是反向坐标轴。
          axisLabel: { //坐标轴刻度标签的相关设置。
            formatter: '{value} %',   //刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
            fontStyle:'normal',
            fontSize:10,
          },
          splitLine: {  //坐标轴在 grid 区域中的分隔线。
            show: false
          },
          nameLocation:'end'  //坐标轴名称显示位置。
        },
      ],
      series: [
        {
          name: '合格指标数',
          type: 'bar',
          itemStyle:{
            normal:{color:"#55a0ed"},
          },
          label:{ //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
            show:true,
            textStyle:{
              fontStyle:'normal',
              //fontWeight:'bolder',
              fontSize:'10'
            }
          },
          data: total,//[29, 704, 226, 667, 82]
        },
        {
          name: '不合格指标数',
          type: 'bar',
          stack: '总量',
          itemStyle:{
            normal:{color:"#bb3843"},
          },
          label:{
            show:true,
            textStyle:{
              fontStyle:'normal',
              color:'#fff',
              //fontWeight:'bolder',
              fontSize:'10'
            }
          },
          data: complete,//[31, 324, 72, 180, 18]
        },
        {
          name: '符合率',
          type: 'line',
          yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
          data: ratio,//[43.66,61.85,72.83,74.05,74.05,77.17],
          label:{  //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
            show:true,
            formatter:'{c}%',
            textStyle:{
              fontStyle:'normal',
              color:'#fff',
              //fontWeight:'bolder',
              fontSize:'10'
            }
          }
        }
      ]
    };
    myChar.setOption(option);
  },
  init_char4:function(dataStr){
    var that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar4');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const barChart = echarts.init(canvas,'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
    that.setOption4(barChart,JSON.parse(dataStr))
    // canvas.setChart(barChart);
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    that.ecBar4 = barChart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return barChart;
  })
  },
  setOption4:function(myChar,data){
    data = {'quotaNameList':data.quotaNameList,'quotaScoreList':data.quotaScoreList}
    const option = {
      title:{
        show:true,
        text:'测评符合率最低的指标',
        left:'center',
      },
      color: ['#3398DB'],
      legend:{
        type:'plain',
        show:true,
        top:'10%',
        left:'right',
        textStyle:{
          color:"#fff",
          fontStyle:"normal",
          fontSize:"10"
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        triggerOn:"mousemove",
        hideDelay:0,
        formatter: function (params) {
          // do some thing
          //console.log(params)
          return params[0].axisValue+'\n'+params[0].marker+'指标符合率：'+params[0].data+'%';
        },
        textStyle:{
          fontStyle:'normal',
          fontWeight:'bolder',
          fontSize:'13'
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: 100,
        containLabel: true
      },
      dataZoom : [
      //1.横向使用滚动条
      {
        type: 'slider',//有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
        show: false,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
        xAxisIndex: [0],// 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
        bottom:'5%', //距离底部的距离
        start:0,
        end:30
      },
      //2.在内部可以横向拖动
      {
        type: 'inside',// 内置于坐标系中
      /*                start: 0,
        end: 30,*/
        xAxisIndex: [0]
      }
      ],
      toolbox: {
        feature: {
          dataView: {show: false, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: false}
        },
        iconStyle:{
          color:{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
            }, {
              offset: 1, color: 'blue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          borderColor:'#666',
          borderWidth:1,
          borderType:"solid"
        },
        right:'8%'
      },

      textStyle:{
        color:"#fff",
        fontStyle:"normal",
        fontSize:"12"
  
      },
      xAxis: [
        {
          type: 'category',
          data: data.quotaNameList,//['测试指标1','测试指标2','测试指标3','测试指标4','测试指标5'],
          axisTick: {
            show:false,
            alignWithLabel: true
          },
          axisLabel: {
            show:false,
            show:true,
            interval:0,
            inside:false,
            rotate:316,
            //showMaxLabel:true,
            fontSize:10,
            formatter:function (value) {
              //console.log(value)
              //console.log(value.length)
              if (value.length>4){
                return value.slice(0,5)+"..."
              }
              return value;
            }
          },
          splitLine: {
            show: false
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '符合率',
          nameGap:10,
          nameTextStyle:{
            fontStyle:'normal',
            fontSize:10,
          },
          min: 0,
          max: 100,
          interval: 25,
          axisLabel: {
            formatter: '{value} %',
            fontStyle:'normal',
            fontSize:10,
          },
          splitLine: {
            show: false
          },
        }
      ],
      series: [
        {
          name: '指标符合率',
          type: 'bar',
          barWidth: 20,
          data: data.quotaScoreList,//[65,70,75,80,85],
          label:{
            show:true,
            formatter:'{c}%',
            textStyle:{
              fontStyle:'normal',
              //fontWeight:'bolder',
              fontSize:'10',
              color:'#fff'
            }
          }
        }
      ]
    }
    myChar.setOption(option);
  },
  init_char5:function(dataStr){
    var that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar5');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const barChart = echarts.init(canvas,'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
    that.setOption5(barChart,JSON.parse(dataStr))
    // canvas.setChart(barChart);
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    that.ecBar5 = barChart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return barChart;
  })
},
setOption5:function(myChar,data){
  var dimensions = new Array();
  var oknums = new Array();
  var unOkNums = new Array();
  var rates = new Array();
  for (var i=0; i<data.length; i++){
    dimensions.push(data[i].departmentName);
    oknums.push(data[i].standardNum);
    unOkNums.push((data[i].unCheckNum + data[i].longTaskNum + data[i].unRectifyNum));
    rates.push(data[i].standardRate);
  }
  const option = {
    //提示框组件
    tooltip: {
      show:true,
      /**
       * 触发类型
       * ‘item’数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
       * ‘axis’坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
       * ‘none’不触发
       */
      trigger: 'axis',
      /**
       * 这是坐标轴指示器的全局公用设置。
       */
      axisPointer: {
        type: 'cross', //指示器类型 ‘line’ 直线指示器  ‘shadow’ 阴影指示器 cross十字准星  ‘none’无指示器
        crossStyle: {
          color: '#999'
        }
      },
      triggerOn:"mousemove", //提示框触发的条件  mousemove 鼠标移动时触发  click 鼠标点击时触发   mousemove|click 同时鼠标移动和点击时触发
      hideDelay:0, //浮层隐藏的延迟，单位为 ms
      formatter:function (params) {
        // do some thing
        //console.log(params)
        var resultStr = "";
        params.forEach(function (item,i){
              if (i == 0) {
                resultStr += item.axisValue + '\n' + item.marker + item.seriesName +'：';
                if(item.componentSubType=='line'){
                  resultStr+=item.value+'%\n'
                }else{
                  resultStr+=item.value+'\n'
                }
              } else {
                resultStr += item.marker + item.seriesName +'：';
                if(item.componentSubType=='line'){
                  resultStr+=item.value+'%\n'
                }else{
                  resultStr+=item.value+'\n'
                }
              }
            }
        )
        return resultStr;
      },
      textStyle:{
        fontStyle:'normal',
        fontWeight:'bolder',
        fontSize:'13'
      }
    },
    textStyle:{
      color:"#fff",
      fontStyle:"normal",
      fontSize:"12"
    },
    title:{
      show:true,
      text:'责任单位整改合格情况',
      left:'center',
    },
    legend:{  //图例组件
      type:'plain',
      show:true,
      top:'10%',
      left:'right',
      textStyle:{
        color:"#fff",
        fontStyle:"normal",
        fontSize:"10"
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: 100,
      containLabel: true
    },
    dataZoom : [
    //1.横向使用滚动条
    {
      type: 'inside',//有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
      show: false,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
      xAxisIndex: [0],// 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
      bottom:'5%', //距离底部的距离
      start:70,
      end:100
    },
    //2.在内部可以横向拖动
    {
      type: 'inside',// 内置于坐标系中
    /*                start: 0,
      end: 30,*/
      xAxisIndex: [0]
    }
    ],
    toolbox: {
      feature: {
        dataView: {show: false, readOnly: false},
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {show: false}
      },
      iconStyle:{
        color:{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'red' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        borderColor:'#666',
        borderWidth:1,
        borderType:"solid"
      },
      right:'8%'
    },
    xAxis: [
      {
        type: 'category', //value 数值轴  category 类目轴  time 时间轴 log 对数轴
        data: dimensions,//['城市社区','小学','主次干道','居住小区','社区综合'],
        axisPointer: { //坐标轴指示器配置项
          type: 'shadow'
        },
        splitLine: { //坐标轴在 grid 区域中的分隔线。
          show: false
        },
        axisTick:{ //坐标轴刻度相关设置。
          show:false,
          alignWithLabel:true, //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
          interval:'auto', //坐标轴刻度的显示间隔，在类目轴中有效
        },
        axisLabel:{//坐标轴刻度标签的相关设置。
          show:true,
          interval:0,
          inside:false,
          rotate:316,
          //showMaxLabel:true,
          fontSize:10,
          formatter:function (value) {
            //console.log(value)
            //console.log(value.length)
            if (value.length>4){
              return value.slice(0,4)+"..."
            }
            return value;
          }
        },
      }
    ],
    yAxis: [
      {
        type: 'value',  //value 数值轴  category 类目轴  time 时间轴 log 对数轴
        name: '任务数量', //坐标轴名称
        nameGap:10,
        nameTextStyle:{
          fontStyle:'normal',
          fontSize:10,
        },
        axisLabel: {  //坐标轴刻度标签的相关设置。
          fontStyle:'normal',
          fontSize:10,
          formatter: '{value}'
        },
        splitLine: { //坐标轴在 grid 区域中的分隔线
          show: false
        },
        splitNumber:4,
        scale:true,
        nameLocation:'end'  //坐标轴名称显示位置。
      },
      {
        type: 'value',
        name: '合格率',
        nameGap:10,
        nameTextStyle:{
          fontStyle:'normal',
          fontSize:10,
        },
        min: 0, //坐标轴刻度最小值。 可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。  不设置时会自动计算最小值保证坐标轴刻度的均匀分布
        max: 100,//坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。  不设置时会自动计算最大值保证坐标轴刻度的均匀分布。
        interval: 25, //是否是反向坐标轴。
        axisLabel: { //坐标轴刻度标签的相关设置。
          formatter: '{value} %',   //刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
          fontStyle:'normal',
          fontSize:10,
        },
        splitLine: {  //坐标轴在 grid 区域中的分隔线。
          show: false
        },
        nameLocation:'end'  //坐标轴名称显示位置。
      },
    ],
    series: [
      {
        name: '整改达标',
        type: 'bar',
        itemStyle:{
          normal:{color:"#55a0ed"},
        },
        label:{ //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
          show:true,
          textStyle:{
            fontStyle:'normal',
            //fontWeight:'bolder',
            fontSize:'10'
          }
        },
        data: oknums//[300, 270, 340, 344, 300, 320, 310]
      },
      {
        name: '未整改',
        type: 'bar',
        stack: '总量',
        itemStyle:{
          normal:{color:"#bb3843"},
        },
        label:{
          show:true,
          textStyle:{
            fontStyle:'normal',
            color:'#fff',
            //fontWeight:'bolder',
            fontSize:'10'
          }
        },
        data: unOkNums//[120, 102, 141, 174, 190, 250, 220]
      },
      {
        name: '合格率',
        type: 'line',
        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        data: rates,//[25,35,45,55,65,75,85],
        label:{  //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
          show:true,
          formatter:'{c}%',
          textStyle:{
            fontStyle:'normal',
            color:'#fff',
            //fontWeight:'bolder',
            fontSize:'10'
          }
        }
      }
    ]
  };
  myChar.setOption(option);
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})