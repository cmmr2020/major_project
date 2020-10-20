//app.js
App({
  data: {
    //type 0复制  1粘贴   resType 资源类型 0图片 1视频 2音频
    tmpImgUrl:{'type':'','src':'',"resType":'','imgSrc':''},
    // tmpVideoUrl:{'type':'','src':''},
    // tmpVoiceUrl:{'type':'','src':''}
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
   // requestUrl:'http://192.168.20.79:8188'//本地
  }
})