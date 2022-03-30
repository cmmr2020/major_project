//app.js
// 引入跳转js
import router from '/utils/router.js';
App({
  data: {
    //type 0复制  1粘贴   resType 资源类型 0图片 1视频 2音频
    tmpImgUrl:{'type':'','src':'',"resType":'','imgSrc':''},
    isRecord:'0',  //是否记录行走经纬度 0 不记录 1 记录
    timeInterval : '120000', //记录行走经纬度时时间间隔 单位毫秒, 2分钟
    locationIsHaveAnswer:{},//记录点位是否已上传答案  [{locationId:submitStatus}]  //点位测评状态  0 未上传  1上传中  2测评完毕  待提交
    locationUpdateFlag:false,
    isPhoto:1, //当前项目达标指标是否必须拍照 0否  1是   默认 1
    isStars:0, //当前政府是否开启地图星级模式 0否  1是   默认 0
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

   /**
 * 封装wx.request请求
 * method： 请求方式
 * url: 请求地址
 * data： 要传递的参数
 * callback： 请求成功回调函数
 * errFun： 请求失败回调函数
 **/
 wxRequest(method, url, data,seesionid, callback, errFun) {
  wx.showLoading({
    title:'数据加载中'
  });
  wx.request({
   url: url,
   method: method,
   data: data,
   header: {
    'content-type': method == 'GET'?'application/json':'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    "cookie":seesionid
   },
   dataType: 'json',
   success: function (res) { 
     console.log(res)
     //超时  重新登录
    if(res.header["sessionstatus"] == "timeout"){
      //var that = this
      const app = getApp();//that.getApp()
      //console.log(app)
      wx.request({
        url : app.globalData.requestUrl+'/wehcat/api/memberMange/silenceuserLogin',
        method : "POST",
        data: {
          terminalUserId:app.terminalUserId,
          openid:app.openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
         },
         dataType: 'json',
         success: function (res) {
           console.log(res)
          if (res.data.status == 'success'){
            var seesionId =res.header["Set-Cookie"]; 
            app.seesionId = seesionId
            console.log(app.seesionId)
            app.wxRequest(method, url, data,seesionId, callback, errFun)
          }else{
            if(res.data.path == "jumpToLogin"){
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
              setTimeout(() => {
                router.navigateTo({
                  url: "/pages/functionPage/functionPage"
                }) 
              }, 1000)
            }
          }
        },
          fail: function (res) {
            console.log(res)   
          }
      })
    }else{
      callback(res);
    }
   },
   fail: function (err) {
    console.log(err)
    errFun(err);
   },
   complete:(res) => {
    wx.hideLoading()
  }
  })
 },
    globalData: {
      ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ],
    userInfo: null,
    requestUrl: 'https://wxp.diaochaonline.com'//35
    //requestUrl: 'https://wmccpr.diaochaonline.com'//线上
    //requestUrl:'https://cmmrpr.diaochaonline.com'//13o
    //requestUrl:'http://221.216.95.200:8286'//35
    //requestUrl:'http://192.168.20.78:8190'//本地
  }
})