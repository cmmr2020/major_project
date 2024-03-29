// 点位详情页面
// 引入跳转js
import router from '../../../../utils/router.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    pointName: '',
    locationName:'',
    pointId: '',
    pointTypeId: '',
    list: {},
    projectId: '',
    // 是否打分
    isGrade: '',
    fontSize:'',
    fontSize30:'',
    fontSize28:'',
    fontSize35:'',
    bgColor:'',
    isRecord:'',//是否记录行走经纬度 0 不记录 1 记录
    timeInterval:'', //记录行走经纬度时时间间隔 单位毫秒
    submitStatus:'',//点位测评状态  0 未上传  1上传中  2测评完毕  待提交
    isHaveDoorHead:0, //是否含有门头照 0否 1是
    isDoorHeadPhoto:'',//是否需要拍摄门头照 0否 1是
    isFieldArchive:'0',//是否是实地指标档案化项目 0 否 1是（默认0） 1 不显示拒访和无法调查按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var projectId = options.projectId;
    var isGrade = options.isGrade;
    var requestUrl = options.requestUrl; //服务器路径
    var pointId = options.id;
    var pointTypeId = options.pointTypeId;
    var firstQuestion = options.firstQuestion; //是否为第一个问题，0是，1、2不是
    wx.setStorageSync("firstQuestion", firstQuestion);
    var fontSize = options.fontSize;
    var bgColor = options.bgColor;
    var name = options.locationName;
    that.data.isRecord = options.isRecord==='null'?app.data.isRecord:options.isRecord;
    that.data.timeInterval = options.timeInterval==='null'?app.data.timeInterval:options.timeInterval;
    that.data.submitStatus = options.submitStatus;
    that.setData({
      requestUrl: requestUrl,
      isGrade: isGrade,
      projectId: projectId,
      pointName: name,
      locationName : options.pointName,
      pointId: pointId,
      pointTypeId: pointTypeId,
      fontSize:fontSize,
      bgColor:bgColor,
      isHaveDoorHead:options.isHaveDoorHead,
      isDoorHeadPhoto:options.isDoorHeadPhoto,
      isFieldArchive:options.isFieldArchive,
      fontSize35:parseInt(fontSize)+3,
      fontSize30:parseInt(fontSize)-2,
      fontSize28:parseInt(fontSize)-4
    })
    that.getPointDetail(pointId);
  },
   
  getPointDetail: function(pointId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldLocation/getFieldLocationDetailById',
      {
        id: pointId
      },
      app.seesionId,
      (res) =>{
        if (res.data.status == 'success') {
          that.setData({
            list: res.data.retObj
          })

        } else {
          wx.showToast({
            title: '获取点位信息失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }

      },
      (err) =>{

      }
    )
    // wx.request({
    //   // 必需
    //   url: requestUrl + '/wechat/api/fieldLocation/getFieldLocationDetailById',
    //   data: {
    //     id: pointId
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //      console.log("点位详情",res)
    //     if (res.data.status == 'success') {
    //       that.setData({
    //         list: res.data.retObj
    //       })

    //     } else {
    //       wx.showToast({
    //         title: '获取点位树失败',
    //         icon: 'none',
    //         duration: 1000,
    //         mask: true
    //       })
    //     }
    //   },
    //   fail: (res) => {

    //   },
    //   complete: (res) => {

    //   }
    // })
  },
  goTo_door_head(){
    var that = this;
    var pointName = that.data.pointName;
    var pointId = that.data.pointId;
    var projectId = that.data.projectId;
    var pointTypeName = that.data.locationName;
    router.navigateTo({
      url: "../door_head_photo/door_head_photo?locationName="+pointName+"&locationId="+pointId+"&projectId="+projectId+"&pointTypeName="+pointTypeName
    })
  },
  goToquota_list: function() {
    var that = this;
    var pointTypeId = that.data.pointTypeId;
    var pointName = that.data.pointName;
    var pointId = that.data.pointId;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl;
    var bgColor = that.data.bgColor;
    var fontSize = that.data.fontSize;
    var isGrade = that.data.isGrade;
    router.navigateTo({
      url: "../quota_list/quota_list",
       success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('pointDetail', {
                  pointName: pointName,
                  pointTypeId: pointTypeId,
                  pointId: pointId,
                  projectId:projectId,
                  requestUrl:requestUrl,
                  bgColor:bgColor,
                  fontSize:fontSize,
                  isGrade:isGrade,
                  isRecord:that.data.isRecord,
                  timeInterval:that.data.timeInterval,
                  submitStatus:that.data.submitStatus,
                  pointTypeName:that.data.locationName
                })
              }
    })
  },

  //无法调查页面goNo_investigate
  goNo_investigate: function() {
    var that = this;
    var locationId = that.data.pointId;
    var isGrade = that.data.isGrade;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../no_investigate/no_investigate?locationId=" + locationId + "&isGrade=" + isGrade +"&projectId=" + projectId
    })
    // wx.navigateTo({
    //   url: "../no_investigate/no_investigate?locationId=" + locationId + "&isGrade=" + isGrade
    // })
  },
  //跳转拒访页面
  goToNo_refuse: function() {
    var that = this;
    var locationId = that.data.pointId;
    var isGrade = that.data.isGrade;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../no_refuse/no_refuse?locationId=" + locationId + "&isGrade=" + isGrade + "&projectId=" + projectId
    })
    // wx.navigateTo({
    //   url: "../no_refuse/no_refuse?locationId=" + locationId + "&isGrade=" + isGrade
    // })
  },

  changeData: function() {
    var that = this;
    var options = {
      id: that.data.pointId,
      pointTypeId: that.data.pointTypeId,
      name: that.data.pointName,
      firstQuestion: that.data.firstQuestion,
      requestUrl:that.data.requestUrl,
      isGrade:that.data.isGrade,
      projectId:that.data.projectId,
      fontSize:that.data.fontSize,
      bgColor:that.data.bgColor
    }
    that.onLoad(options); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },

  changeParentData: function() {
    var projectId = this.data.projectId;
    var isGrade = this.data.isGrade;
    var surveyorId = app.terminalUserId;
    var requestUrl = this.data.requestUrl;
    var bgColor = this.data.bgColor;
    var fontSize = this.data.fontSize;
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.setData({ //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
        projectId: projectId,
        isGrade: isGrade,
        surveyorId:surveyorId,
        requestUrl:requestUrl,
        bgColor:bgColor,
        fontSize:fontSize
      })
      beforePage.changeData(); //触发父页面中的方法
    }
  },

  onUnload: function() {
    this.changeParentData();
  },
  //调起用户手机拨打电话
  goToCall:function(e){
    var that = this;
    var phone = e.currentTarget.dataset.phone;
    if (typeof(phone)==="undefined" && phone.length < 6) {
      wx.showToast({
        title: '此号码不存在',
        icon: 'none',
        duration: 2000
      })
    }else{
      if (phone.length>11) {
        wx.makePhoneCall({
          phoneNumber: phone.slice(0,11)
        })
      }else{
        wx.makePhoneCall({
          phoneNumber: phone
        })
      }
    }
    
  },
  //内置地图导航
  goToMap:function(e){
    var that = this;
    var address = e.currentTarget.dataset.address;
    var latitude = Number(e.currentTarget.dataset.latitude);
    var longitude = Number(e.currentTarget.dataset.longitude);
    if (typeof(address)!="undefined" && typeof(latitude)!="undefined" && typeof(longitude)!="undefined") {
       wx.openLocation({
         address,
         latitude,
         longitude,
         scale: 18
       })
     }else{
         wx.showToast({
          title: '该地址位置不合法',
          icon: 'none',
          duration: 2000
        })
     }
  }
})