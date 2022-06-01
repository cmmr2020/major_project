// 菜单页面
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
// 引入跳转js
import router from '../../utils/router.js';
const app = getApp();
var requestUrl = app.globalData.requestUrl; //请求路径
let qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    menuName: '',
    terminalUserName: '', //调查员名称
    departmentName: '', //所属部门
    surveyList: [],
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    address: '',
    longitude: '',
    latitude: '',
    fontSize:'',
    bgColor:'',
    menufontSize:'30'
  },
   onShareAppMessage: function (res) {
      return {
        title: '创城专业版小程序！',
        path: '/pages/index/index',
        success: function () { },
        fail: function () { }
      }
    },
    onLoad: function(option){
      //console.log(option)
      var that = this;
      var fontSize = wx.getStorageSync('fontSize');
      var bgColor = wx.getStorageSync('bgColor');
      that.setData({
        fontSize:fontSize,
        bgColor:bgColor
      })
      var list = JSON.parse(option.data);
      if(option.fromType == 'appPage'){
        let terminalUserName = '';
        if( option.terminalUserName){
          terminalUserName = option.terminalUserName;
          if(terminalUserName.indexOf('#') != -1){
            terminalUserName = terminalUserName.split('#')[1];
          }
        }
        that.setData({
          surveyList: list,
          departmentName: option.departmentName,
          terminalUserName: terminalUserName
        })
      }else{
        let terminalUserName = '';
        if(option.terminalUserName){
          terminalUserName = option.terminalUserName;
          if(terminalUserName.indexOf('#') != -1){
            terminalUserName = terminalUserName.split('#')[1];
          }
        }
        that.setData({
          surveyList: list,
          departmentName: option.departmentName,
          terminalUserName: terminalUserName
        })
      }
      qqmapsdk = new QQMapWX({
        key: that.data.key
      });
      //获取当前位置 测试阶段先关闭了
      that.currentLocation();
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(option) {
    // console.log(option)
    // var that = this;
    // var fontSize = wx.getStorageSync('fontSize');
    // var bgColor = wx.getStorageSync('bgColor');
    // that.setData({
    //   fontSize:fontSize,
    //   bgColor:bgColor
    // })
    // const eventChannel = that.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // // login页面传递过来的菜单列表
    // eventChannel.on('loginPage', function(data) {
    //   //console.log("loginPage传递过来的数据", data.data)
    //   let terminalUserName = '';
    //   if( data.terminalUserName){
    //     terminalUserName = data.terminalUserName;
    //     if(terminalUserName.indexOf('#') != -1){
    //       terminalUserName = terminalUserName.split('#')[1];
    //     }
    //   }
    //   that.setData({
    //     surveyList: data.data,
    //     departmentName: data.departmentName,
    //     terminalUserName: terminalUserName
    //   })
    //   // console.log("loginPage绑定菜单", that.data.surveyList)
    // })
    // // index.js页面传递过来的菜单列表
    // eventChannel.on('appPage', function(data) {
    //   //console.log("appPage传递过来的数据", data)
    //   let terminalUserName = '';
    //   if( data.terminalUserName){
    //     terminalUserName = data.terminalUserName;
    //     if(terminalUserName.indexOf('#') != -1){
    //       terminalUserName = terminalUserName.split('#')[1];
    //     }
    //   }
    //   that.setData({
    //     surveyList: data.data,
    //     departmentName: data.departmentName,
    //     terminalUserName: terminalUserName
    //   })
    //   // console.log("appPage绑定菜单", that.data.surveyList)
    // })
    // qqmapsdk = new QQMapWX({
    //   key: that.data.key
    // });
    // //获取当前位置 测试阶段先关闭了
    // that.currentLocation();
  },
  currentLocation() {
    //当前位置
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
      }
    })
  },
  getAddress: function(lng, lat) {
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        // console.log(res)
        this.setData({
          address: res.result.formatted_addresses.recommend //res.result.address
        })
        // 保存用户登录信息
        this.saveUserLog();
      },
      fail: (res) => {
        this.setData({
          address: "获取位置信息失败"
        })
      }
    })
  },
  // 保存用户登录信息
  saveUserLog: function() {
    var that = this;
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    var address = that.data.address;
    var terminalUserId = app.terminalUserId;
    //console.log("这是调查员id",terminalUserId)
    // console.log("这是地址",address)
    if (terminalUserId != '') {
      wx.request({
        // 必需
        url: requestUrl + '/wehcat/api/memberMange/saveUserLog',
        method: "POST",
        data: {
          'terminalUserId': terminalUserId,
          'longitude': longitude,
          'latitude': latitude,
          'address': address
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {},
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
    }
  },
  //点击调查员名字后面的icon
  goToPage:function(){
      router.navigateTo({
          url: "../functionPage/functionPage"
      })
  },
  //点击菜单触发函数
  junmp: function(even) {
    var that = this;
    that.setData({
      menuName: even.currentTarget.dataset.type
    })
    var menuName = that.data.menuName;
    // console.log(menuName)
    switch (menuName) {
      // case "绑定账号":
      //   router.navigateTo({
      //     url: "../login/login"
      //   })
      //   break;
      case "开始调查":
        router.navigateTo({
          url: "../../startDiaochaPackage/pages/startDiaocha/project_list/project_list"
        })
        break;
      case "开始整改":
        router.navigateTo({
          url: "../../correctionPackage/pages/surveyDept/dept_project/dept_project"
        })
        break;
      case "分配点位":
        that.checkUser(app.terminalUserId)
        break;
      case "地图展示":
        router.navigateTo({
          url:"../../displayPackage/pages/fenXi/projectList/projectList?type=1"
        })
        break;
      case "统计排名":
        router.navigateTo({
          url: "../../displayPackage/pages/paiMing/projectList/projectList?type=1"
        })
        break;
      case "材料审核":
        router.navigateTo({
          url: "../../datumCheckPackage/pages/DatumCheck/datum_check_project/datum_check_project"
        })
        break;
      case "材料上报":
        router.navigateTo({
          url: "../../datumUploadPackage/pages/DatumUpload/upload_project/upload_project"
        })
        break;
      case "实地审核":
        router.navigateTo({
          url: "../../shiDiCheckPackage/pages/ShiDiCheck/check_project/check_project"
        })
        break;
      case "开始复查":
       router.navigateTo({
          url: "../../startFuchaPackage/pages/fuCha/projectList/projectList"
        })
        break;
      case "数据分析":
       router.navigateTo({
         url: "../../displayPackage/pages/fenXi/projectList/projectList?type=0"
        })
        break;
      default:
        // console.log("default");
    }
  },
  //校验用户是否是组长
  checkUser:function(terminalUserId){
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      requestUrl + '/wechat/api/distributeLocation/checkTerminalUser',
      {
        'terminalUserId': terminalUserId 
      },
      app.seesionId,
      (res) =>{
        if(res.data.status == "success"){
          if(res.data.message == '1'){
            app.groupIdList = res.data.retObj
            router.navigateTo({
              url: "../../fenPeiDWPackage/pages/projectList/projectList"
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '您没有此权限,请联系督导!',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        }
      },
      (err) =>{
        wx.showModal({
          title: '提示',
          content: '系统错误!',
          // success (res) {
          //   if (res.confirm) {
          //     console.log('用户点击确定')
          //   }
          // }
        })

      }
    )

    // wx.request({
    //   // 必需
    //   url: requestUrl + '/wechat/api/distributeLocation/checkTerminalUser',
    //   method: "POST",
    //   data: {
    //     'terminalUserId': terminalUserId 
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: (res) => {
    //     if(res.data.status == "success"){
    //       if(res.data.retObj == '1'){
    //         router.navigateTo({
    //           url: "../../fenPeiDWPackage/pages/projectList/projectList"
    //         })
    //       }else{
    //         wx.showModal({
    //           title: '提示',
    //           content: '您没有此权限,请联系督导!',
    //           success (res) {
    //             if (res.confirm) {
    //               console.log('用户点击确定')
    //             }
    //           }
    //         })
    //       }
    //     }
    //   },
    //   fail: (res) => {
    //     wx.showModal({
    //       title: '提示',
    //       content: '系统错误!',
    //       // success (res) {
    //       //   if (res.confirm) {
    //       //     console.log('用户点击确定')
    //       //   }
    //       // }
    //     })
    //   }
    // })
  }
})