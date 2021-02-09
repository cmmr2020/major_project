//app.js
App({
  data: {
    //type 0复制  1粘贴   resType 资源类型 0图片 1视频 2音频
    tmpImgUrl:{'type':'','src':'',"resType":'','imgSrc':''},
    isRecord:'0',  //是否记录行走经纬度 0 不记录 1 记录
    timeInterval : '120000', //记录行走经纬度时时间间隔 单位毫秒, 2分钟
    locationIsHaveAnswer:{},//记录点位是否已上传答案  [{locationId:submitStatus}]  //点位测评状态  0 未上传  1上传中  2测评完毕  待提交
    locationUpdateFlag:false,
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //设置文本初始值大小  32
     wx.setStorageSync('fontSize', 34);
     //设置主题初始颜色  blue #0081ff
     wx.setStorageSync('bgColor','blue')
     wx.setStorageSync('bgColorUi','#0081ff')
  },
  globalData: {
    userInfo: null,
    requestUrl: 'https://wxp.diaochaonline.com'//35
   // requestUrl: 'https://wmccpr.diaochaonline.com'//线上
   // requestUrl:'https://cmmrpr.diaochaonline.com'//13o
    // requestUrl:'http://221.216.95.200:8286'//35
   //requestUrl:'http://192.168.20.66:8188'//本地
  }
})