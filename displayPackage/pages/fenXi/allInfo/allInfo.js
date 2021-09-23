// displayPackage/pages/fenXi/allInfo/allInfo.js
import * as echarts from '../../../ec-canvas/echarts';
const app = getApp();
var requestUrl=app.globalData.requestUrl
var projectId = '';
var govId = '';
var limiNum = 5;
var loadFlag = false;
const load_option ={
  text:'', //显示的文本
  color:'#1E90FF', //显示转圈的圆圈颜色
  textCloor:'#0000ff', //显示文本的颜色
  maskColor:'rgba(16,12,42,1)', //显示的背景色
  // 字体大小。从 `v4.8.0` 开始支持。
  fontSize:20,
  // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
  showSpinner:true,
  // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
  spinnerRadius:50,
  // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
  lineWidth:8,
  // 字体粗细。从 `v5.0.1` 开始支持。
  fontWeight:'normal',
  // 字体风格。从 `v5.0.1` 开始支持。
  fontStyle:'normal',
  // 字体系列。从 `v5.0.1` 开始支持。
  fontFamily:'sans-serif'
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    data_char1:'',
    data_char2:'',
    data_char3:'',
    data_char4:'',
    quota_total:'',
    quota_ok_num:'',
    quota_rate_num:'',
    point_total:'',
    swiperList: [],/*[{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }]*/
    imgInfoUrl:'',
    imgInfoDesc:'',
    imgInfoLocation:'',
    imgInfoAddr:'',
    IsShowInfo:false,
    isLoadStatistics:false,
    isLoadImg:false,
    ColorList: app.globalData.ColorList,  
    projectName:'研发项目',
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
    projectId = options.projectId;
    govId = options.govId;
    if(!projectId||!govId){
      wx.showToast({
        title: '参数获取失败',
        icon: 'none', // "success", "loading", "none"
        duration: 1500,
        mask: false,
      })
      return
    }
    wx.setNavigationBarTitle({
      title: options.projectName+'数据分析'
    })
    let that = this
    that.initQuotaInfo()
    that.initPointInfo()
    that.inintchar1()
    that.inintchar2()
    that.inintchar3()
    that.inintchar4()
    that.inintchar5()
    that.inintPic()
  },
  hideModal(e) {
    this.setData({
      IsShowInfo:false
    })
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

  },
  initQuotaInfo:function(){
    var that = this;
    wx.request({
      // 必需
      url: requestUrl + '/private/largeScreenDisplay/getQuotaScoreMap',
      data: {
        projectId:projectId,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          var okNum = res.data.retObj.okNum;
          var allNum = res.data.retObj.all;
          var okRateStr = parseFloat(okNum)/parseFloat(allNum)*100
          that.setData({
            quota_total:allNum,
            quota_ok_num:okNum,
            quota_rate_num:(okRateStr.toFixed(2))+'%',
          })
          if(loadFlag){
            that.setData({
              isLoadStatistics:true
            })
          }else{
            loadFlag = true
          }
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }

      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    })
  },
  initPointInfo:function(){
    var that = this
    wx.request({
      // 必需
      url: requestUrl + '/private/largeScreenDisplay/getQLocationCheckNumAndFieldTaskInfoMap',
      data: {
        projectId:projectId,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          if(loadFlag){
            that.setData({
              isLoadStatistics:true
            })
          }else{
            loadFlag = true
          }
          that.setData({
            point_total:res.data.retObj.locationNum,
          })
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }

      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    })
  },

  inintchar1:function(){
    let that = this;
    var barChart;
    //因为插件bug this.ecComponent 多次实例化 实现加载动画 和 初始化数据, 无法通过实例化一次实现.
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
        barChart = echarts.init(canvas,  'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      barChart.showLoading(load_option)
    });
      wx.request({
        // 必需
        url: requestUrl + '/private/largeScreenDisplay/getPointQuotaScoreMap',
        data: {
          projectId:projectId,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          barChart.hideLoading();
          if (res.data.status === "success") {
            this.ecComponent = this.selectComponent('#mychart-dom-multi-bar');
            this.ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              barChart = echarts.init(canvas,  'dark', {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
            that.setOption1(barChart,res.data.retObj,limiNum)
            // canvas.setChart(barChart);
            // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
            that.ecBar1 = barChart;
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return barChart;
          });
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
  
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }
      })
  },
  setOption1:function (myChar,data,limiNum) {
    var that = this
    that.data_char1=JSON.stringify(data);
    var dimensions = new Array();
    var oknums = new Array();
    var unOkNums = new Array();
    var rates = new Array();
    for (var i=0; i<limiNum; i++){
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
        left: 20,
        right: 20,
        bottom: 15,
        top: 90,
        containLabel: true
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
    myChar.on('click',that.openChart1)
  },
  openChart1:function(index){
    var that = this;
    wx.navigateTo({
      url: '../single_chart/single_chart?data='+that.data_char1+"&char_index=1",
    })
  },
  inintchar2:function(){
    let that = this;
    var barChart;
    //因为插件bug this.ecComponent 多次实例化 实现加载动画 和 初始化数据, 无法通过实例化一次实现.
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar2');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
        barChart = echarts.init(canvas,  'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      barChart.showLoading(load_option)
    });
      wx.request({
        // 必需
        url: requestUrl + '/private/largeScreenDisplay/getLowestPointMap',
        data: {
          projectId:projectId,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          barChart.hideLoading();
          if (res.data.status === "success") {
            this.ecComponent = this.selectComponent('#mychart-dom-multi-bar2');
            this.ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              barChart = echarts.init(canvas,  'dark', {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
            that.setOption2(barChart,res.data.retObj,limiNum)
            // canvas.setChart(barChart);
            // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
            that.ecBar2 = barChart;
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return barChart;
          });
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
  
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }
      })
  },
  setOption2:function(myChar,data,limiNum){
    var that = this;
    that.data_char2 = JSON.stringify(data);
    var names =[];
    var nums = [];
    var newObj = data.slice(0,limiNum);
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
        top: 90,
        left: 20,
        right: 20,
        bottom: "0%",
        show: true,
        borderColor: "#012f4a",
        containLabel: true
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
    myChar.on('click',that.openChart2)
  },
  openChart2:function(index){
    var that = this;
    wx.navigateTo({
      url: '../single_chart/single_chart?data='+that.data_char2+"&char_index=2",
    })
  },
  inintchar3:function(){
    let that = this;
    var barChart;
    //因为插件bug this.ecComponent 多次实例化 实现加载动画 和 初始化数据, 无法通过实例化一次实现.
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar3');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
        barChart = echarts.init(canvas,  'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      barChart.showLoading(load_option)
    });
      wx.request({
        // 必需
        url: requestUrl + '/private/largeScreenDisplay/getDeptQuotaScoreMap',
        data: {
          projectId:projectId,
          govId:govId,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          barChart.hideLoading();
          if (res.data.status === "success") {
            this.ecComponent = this.selectComponent('#mychart-dom-multi-bar3');
            this.ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              barChart = echarts.init(canvas,  'dark', {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
            that.setOption3(barChart,res.data.retObj,limiNum)
            // canvas.setChart(barChart);
            // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
            that.ecBar3 = barChart;
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return barChart;
          });
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
  
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }
      })
  },
  setOption3:function (myChar,data,limiNum) {
    var that = this
    that.data_char3=JSON.stringify(data);
    var name;
    var total;
    var complete;
    var ratio;
    //chart1_data = data;
    name = data.pointNameList.slice(0,5);
    total = data.quotaTotalList.slice(0,5);
    complete = data.quotaCompleteList.slice(0,5);
    ratio = data.CompleteRatioList.slice(0,5);
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
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 90,
        containLabel: true
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
    myChar.on('click',that.openChart3)
  },
  openChart3:function(index){
    var that = this;
    wx.navigateTo({
      url: '../single_chart/single_chart?data='+that.data_char3+"&char_index=3",
    })
  },
  inintchar4:function(){
    let that = this;
    var barChart;
    //因为插件bug this.ecComponent 多次实例化 实现加载动画 和 初始化数据, 无法通过实例化一次实现.
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar4');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
        barChart = echarts.init(canvas,  'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      barChart.showLoading(load_option)
    });
      wx.request({
        // 必需
        url: requestUrl + '/private/largeScreenDisplay/getLowestQuotaMap',
        data: {
          projectId:projectId,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          barChart.hideLoading();
          if (res.data.status === "success") {
            this.ecComponent = this.selectComponent('#mychart-dom-multi-bar4');
            this.ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              barChart = echarts.init(canvas,  'dark', {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
            that.setOption4(barChart,res.data.retObj,limiNum)
            // canvas.setChart(barChart);
            // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
            that.ecBar4 = barChart;
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return barChart;
          });
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
  
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }
      })
  },
  setOption4:function (myChar,data,limiNum) {
    var that = this
    that.data_char4=JSON.stringify(data);
    data = {'quotaNameList':data.quotaNameList.slice(0,limiNum),'quotaScoreList':data.quotaScoreList.slice(0,limiNum)}
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
        top: 90,
        left: 20,
        right: 20,
        bottom: "0%",
        show: true,
        borderColor: "#012f4a",
        containLabel: true
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
    myChar.on('click',that.openChart4)
  },
  openChart4:function(index){
    var that = this;
    wx.navigateTo({
      url: '../single_chart/single_chart?data='+that.data_char4+"&char_index=4",
    })
  },
  inintchar5:function(){
    let that = this;
    var barChart;
    //因为插件bug this.ecComponent 多次实例化 实现加载动画 和 初始化数据, 无法通过实例化一次实现.
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar5');
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
        barChart = echarts.init(canvas,  'dark', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      barChart.showLoading(load_option)
    });
      wx.request({
        // 必需
        url: requestUrl + '/private/largeScreenDisplay/getlastDayQuotaScore',
        data: {
          projectId:projectId,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          barChart.hideLoading();
          if (res.data.status === "success") {
            this.ecComponent = this.selectComponent('#mychart-dom-multi-bar5');
            this.ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              barChart = echarts.init(canvas,  'dark', {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
            that.setOption5(barChart,res.data.retObj,limiNum)
            // canvas.setChart(barChart);
            // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
            that.ecBar5 = barChart;
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return barChart;
          });
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
  
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }
      })
  },
  setOption5:function (myChar,data,limiNum) {
    var title=['指标合格数','指标不合格数'];
    var data_obj = [{"value":data.okNum,"name":title[0]},{"value":data.unOkNum,"name":title[1]}];
    const option = {
      title:{
        show:true,
        text:data.date+' 指标实时测评情况',
        left:'center',
      },
      grip:{//直角坐标系内绘图网格
        top: 90,
        left: 20,
        right: 20,
        bottom: 0,
      },
      tooltip: { //提示框组件
        formatter: '{a}'+'\n'+'{b} : {c} ({d}%)',
        confine:true,
        triggerOn:"mousemove",
        hideDelay:0,
        textStyle:{
          fontStyle:'normal',
          fontWeight:'bolder',
          fontSize:'13'
        }
      },
      textStyle:{//全局的字体样式
        color:"#fff",
        fontStyle:"normal",
        fontSize:"12"
      },
      legend: {//图例组件
        show:true,
        name:'指标测评情况',
        type: 'plain',//'plain'：普通图例。缺省就是普通图例。  'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
        orient: 'vertical',  //图例列表的布局朝向
        right: 5,
        top: '20%',
        bottom: 0,
        textStyle:{
          color:"#fff",
          fontStyle:"normal",
          fontSize:"10"
        },
      },
      series: [//系列列表
        {
          name:'指标测评情况',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data:data_obj,
          // data: [
          //   {
          //     value:240,name:'不合格指标数'
          //   },
          //   {
          //   value:300,name:'合格指标数'
          //  }
          // ],
          legendHoverLink:true,
          label:{
            show:true,
            fontSize:10,
            fontStyle:'normal',
            formatter:function(params){
              //console.log(params) params.data.name+"：\n\n"+
              return params.data.value+"("+params.percent+"%)";
            },
            position:'outside',
            color:'#fff',
            align:'center',
            margin:'0',
          },
          //startAngle:180,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              textStyle:{
                color:"#fff",
                fontStyle:"normal",
                fontSize:"12"
              },
            }
          }
        }
      ],
      color:['#55a0ed', 'red',] //ED7007
    };
    myChar.setOption(option);
  },
  inintPic:function(){
    var that = this;
    wx.request({
      // 必需
      url: requestUrl + '/private/largeScreenDisplay/getDeptResourceList',
      data: {
        projectId:projectId,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          //console.log(res.data.retObj)
          var data =res.data.retObj;
          var list = [];
          for(let i=0; i<data.length; i++){
            list.push({
              'id':data[i].resourceId,
              'type':'image','url':data[i].url,
              'addr':(data[i].addr==null?'暂无':data[i].addr),
              'desc':(data[i].description==null?'暂无':data[i].description),
              'location':data[i].locationName
          })
          }
          that.setData({
            swiperList:list,
            isLoadImg:true
          })
          that.towerSwiper('swiperList');
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    })
  },
  toswiper:function(e){
    const that = this;
    const data = e.currentTarget.dataset;
    that.setData({
      imgInfoUrl:data.src,
      imgInfoDesc:data.desc,
      imgInfoLocation:data.location,
      imgInfoAddr:data.addr,
      IsShowInfo:true
    })
  },



    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
      // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
});



