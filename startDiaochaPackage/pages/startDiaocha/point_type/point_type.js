// 点位类型页面
const app = getApp();
Page({

  data: {
    requestUrl: '', //服务器路径
    projectId: '',
    surveyorId: '', //调查员id
    isGrade: '',
    open: false,
    selected: [false, false, false], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [],
    // 指标经纬度集合
    markersList: [],
    fontSize:'',
    fontSize30:'',
    bgColor:'', 
    modalName:'',
    isDoorHeadPhoto:'',//是否需要拍摄门头照 0否 1是
    isFieldArchive:'0',//是否是实地指标档案化项目 0 否 1是（默认0）
  },

  onLoad: function(e) {
    var that = this;
    //console.log(e)
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // projectList页面传递过来的参数
    var isGrade = e.isGrade;
    var projectId = e.projectId;
    var surveyorId = e.terminalUserId;
    var requestUrl = e.requestUrl;
    var bgColor = e.bgColor;
    var fontSize = e.fontSize;
    var isFieldArchive = e.isFieldArchive;
    that.setData({
      isGrade: isGrade,
      projectId: projectId,
      surveyorId: surveyorId,
      requestUrl: requestUrl,
      bgColor: bgColor,
      fontSize: fontSize,
      fontSize30: parseInt(fontSize) - 2,
      isFieldArchive:isFieldArchive
    })
    that.getLocationList(surveyorId, projectId, requestUrl);
  },
  onShow : function(){
    //记录用户测评路线功能  获取所需权限
    //点位列表页面加载完毕 是否获取后台定位权限
    var that =  this;
    wx.getSetting({
      success (res) {
        //没有的话  引导用户开启后台定位权限
        if(!res.authSetting['scope.userLocationBackground']){
          wx.showModal({
            title: '提示',
            content: '因需要记录行动轨迹,请点击确定,设置定位权限，选择 “使用小程序期间和离开小程序之后” ！',
            success (res) {
              if (res.confirm) {
                that.goSetting()
              } else if (res.cancel) {
                wx.showModal({
                  title: '提示',
                  content: '您未授权后台获取位置信息，此点位将无法记录您的行走路线！',
                  showCancel:false
                })
              }
            }
          })
          // that.setData({
          //   modalName:'bottomModal'
          // })
        }else{
          that.setData({
            modalName:null
          })
        }
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  goSetting(){
          wx.openSetting({
            success (res) {
              console.log(res.authSetting)
              // res.authSetting = {
              //   "scope.userInfo": true,
              //   "scope.userLocation": true
              // }
            }
          })
  },
  getLocationList:function(terminalUserId, projectId,requestUrl) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    // var requestUrl = that.data.requestUrl; //服务器路径
    //console.log("requestUrl:",requestUrl);
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldLocation/getFieldPointLocationList',
      {
        terminalUserId: terminalUserId,
        projectId: projectId
      },
      app.seesionId,
      (res) =>{
        wx.hideLoading();
        if (res.data.status ==="success") {
          var mapList = res.data.retObj;
          console.log(mapList)
           //console.log("有没有点位：",mapList)
           if (typeof(mapList) === "undefined" ) {
              wx.showToast({
                title: '该调查员没有分配点位',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }else{
          let map = [];
          for (let i = 0; i < mapList.length; i++) {
            if (mapList[i].locationList != null) {
              map.push({
                pointTypeId:mapList[i].id,
                isRecord:mapList[i].isRecord==null?app.data.isRecord:mapList[i].isRecord,
                timeInterval:mapList[i].timeInterval==null?app.data.timeInterval:mapList[i].timeInterval,
                list: mapList[i].locationList
              })
            }
          }
          let mapLists = [];
          for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].list.length; j++) {
              mapLists.push({
                pointTypeId:map[i].pointTypeId,
                longitude: map[i].list[j].longitude,
                latitude: map[i].list[j].latitude,
                name: map[i].list[j].name,
                address: map[i].list[j].address,
                pointId: map[i].list[j].id,
                submitStatus: map[i].list[j].submitStatus,
                isRecord:map[i].isRecord,
                timeInterval:map[i].timeInterval
              })
              let pointId = map[i].list[j].id
              if(!app.data.locationIsHaveAnswer.hasOwnProperty(pointId)){
                if(map[i].list[j].submitStatus===1){
                  //将上传中的标志放到全局变量中
                  app.data.locationIsHaveAnswer[pointId] = 1;
                }
              }
            }        
          }
          that.setData({
            list: res.data.retObj,
            markersList: mapLists,
            isDoorHeadPhoto:mapList[0].isDoorHeadPhoto
          })
          wx.setStorageSync('markersList', mapLists);
          //console.log("点位", mapLists)
          }
        } else {
          wx.showModal({
              title: '提示',
              content: "获取点位树失败",
              showCancel:false,
              confirmColor:"#0081ff",
              success (res) {
              }
            })
        }

      },
      (err) =>{

      }
    )
    // wx.request({
    //   // 必需
    //   url: requestUrl + '/wechat/api/fieldLocation/getFieldPointLocationList',
    //   // url: 'http://localhost:8088/wechat/api/fieldLocation/getFieldPointLocationList',
    //   // url: 'http://192.168.5.105:8080/wechat/api/fieldLocation/getFieldPointLocationList',
    //   data: {
    //     terminalUserId: terminalUserId,
    //     projectId: projectId
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     //console.log("出来：",res)
    //     wx.hideLoading();
    //     if (res.data.status ==="success") {
    //       var mapList = res.data.retObj;
    //       // console.log("有没有点位：",mapList)
    //        if (typeof(mapList) === "undefined" ) {
    //           wx.showToast({
    //             title: '该调查员没有分配点位',
    //             icon: 'none',
    //             duration: 2000,
    //             mask: true
    //           })
    //         }else{
    //       let map = [];
    //       for (let i = 0; i < mapList.length; i++) {
    //         if (mapList[i].locationList != null) {
    //           map.push({
    //             pointTypeId:mapList[i].id,
    //             isRecord:mapList[i].isRecord==null?app.data.isRecord:mapList[i].isRecord,
    //             timeInterval:mapList[i].timeInterval==null?app.data.timeInterval:mapList[i].timeInterval,
    //             list: mapList[i].locationList
    //           })
    //         }
    //       }
    //       let mapLists = [];
    //       for (let i = 0; i < map.length; i++) {
    //         for (let j = 0; j < map[i].list.length; j++) {
    //           mapLists.push({
    //             pointTypeId:map[i].pointTypeId,
    //             longitude: map[i].list[j].longitude,
    //             latitude: map[i].list[j].latitude,
    //             name: map[i].list[j].name,
    //             address: map[i].list[j].address,
    //             pointId: map[i].list[j].id,
    //             submitStatus: map[i].list[j].submitStatus,
    //             isRecord:map[i].isRecord,
    //             timeInterval:map[i].timeInterval
    //           })
    //           let pointId = map[i].list[j].id
    //           if(!app.data.locationIsHaveAnswer.hasOwnProperty(pointId)){
    //             if(map[i].list[j].submitStatus===1){
    //               //将上传中的标志放到全局变量中
    //               app.data.locationIsHaveAnswer[pointId] = 1;
    //             }
    //           }
    //         }        
    //       }
    //       that.setData({
    //         list: res.data.retObj,
    //         markersList: mapLists
    //       })
    //       wx.setStorageSync('markersList', mapLists);
    //       //console.log("点位", mapLists)
    //       }
    //     } else {
    //       wx.showModal({
    //           title: '提示',
    //           content: "获取点位树失败",
    //           showCancel:false,
    //           confirmColor:"#0081ff",
    //           success (res) {
    //           }
    //         })
    //     }
    //   },
    //   fail: (res) => {

    //   },
    //   complete: (res) => {

    //   }
    // })
  },


  kindToggle: function(e) {
    //页面传递过来的点击id
    let id = e.currentTarget.dataset.index;

    //当前展开的id
    let active = this.data.active;
    //展开项给selected数组动态赋值
    var selectId = 'selected[' + id + ']'
    //不是展开项给selected数组动态赋值
    var selectActive = 'selected[' + active + ']'
    //获取页面id赋值
    var Id = '[' + id + ']'
    this.setData({
      [selectId]: !this.data.selected[Id],
      active: id
    });

    // 如果点击的不是当前展开的项，则关闭当前展开的项
    // 这里就实现了点击一项，隐藏另一项
    if (active !== null && active !== id) {
      this.setData({
        [selectActive]: false
      });
    }
    if (active == id) {
      this.setData({
        [selectId]: false,
        active: null
      });
    }

  },

  goToMap: function() {
    var that = this;
    var projectId = that.data.projectId;
    var isGrade = that.data.isGrade;
    var requestUrl = that.data.requestUrl;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;
    // console.log("地图资源：", that.data.markersList)
    wx.navigateTo({
      url: "../map/map?projectId=" + projectId + "&isGrade=" + isGrade + "&requestUrl=" + requestUrl + "&fontSize=" + fontSize + "&bgColor=" + bgColor ,
    })
  },

  showModal:function(e){
    var that = this;
    // console.log(e)
    // console.log(that.data.isDoorHeadPhoto)
    let locationId = e.currentTarget.dataset.index;
    let checkstatus =e.currentTarget.dataset.checkstatus
    if(that.data.isDoorHeadPhoto == 1){
      if(e.currentTarget.dataset.ishavedoorhead != 1){
        wx.showModal({
          title: '提示',
          content: '当前项目需要拍摄门头照,请先拍摄~',
          showCancel:false
        })
        return
      }
    }
      wx.showModal({
      title: '提示',
      content: '确定提交该点位下的资源吗？',
      confirmColor:'#e54d42',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击缺认')
          that.submit(locationId,checkstatus);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    },


  submit: function(locationId,checkstatus) {
    var that = this;
    // let locationId = e.currentTarget.dataset.index;
    var surveyorId = that.data.surveyorId;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl; //服务器路径
    let status = 2;
    if(checkstatus=='4'){
      status = 5;
    }
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldLocation/updateCheckStatus',
      {
        surveyorId: surveyorId,
        locationId: locationId,
        status: status
      },
      app.seesionId,
      (res) =>{
        if (res.data.status == 'success') {
          var value = wx.getStorageSync(locationId)
          if (value) {
            //调用全局 请求方法
            app.wxRequest(
              'POST',
              requestUrl + '/wechat/api/fieldLocation/saveOrUpdateFieldTaskWalkLocus',
              {
                "surveyorId": surveyorId,
                "locationId": locationId,
                "projectId": projectId,
                "addressJsonStr": value,
                "type":0
              },
              app.seesionId,
              (res) =>{
                //清空缓存的该点位行走路线经纬度
                wx.removeStorageSync(locationId)
              },
              (err) =>{

              }
            )
            // wx.request({
            //   // 必需
            //   url: requestUrl + '/wechat/api/fieldLocation/saveOrUpdateFieldTaskWalkLocus',
            //   method:'POST',
            //   dataType:'json',
            //   data: {
            //     "surveyorId": surveyorId,
            //     "locationId": locationId,
            //     "projectId": projectId,
            //     "addressJsonStr": value,
            //     "type":0
            //   },
            //   header: {
            //     'Content-Type': 'application/x-www-form-urlencoded'
            //   },
            //   success: (res) => {

            //   },
            //   fail: (res) => {
            //   },
            //   complete: (res) => {
            //     //清空缓存的该点位行走路线经纬度
            //      wx.removeStorageSync(locationId)
            //   }
            // })
          }
        }
        that.getLocationList(surveyorId, projectId,requestUrl);
      },
      (err) =>{

      }
    )

    // wx.request({
    //   // 必需
    //   url: requestUrl + '/wechat/api/fieldLocation/updateCheckStatus',
    //   data: {
    //     surveyorId: surveyorId,
    //     locationId: locationId,
    //     status: status
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     if (res.data.status == 'success') {
    //       var value = wx.getStorageSync(locationId)
    //       if (value) {
    //         wx.request({
    //           // 必需
    //           url: requestUrl + '/wechat/api/fieldLocation/saveOrUpdateFieldTaskWalkLocus',
    //           method:'POST',
    //           dataType:'json',
    //           data: {
    //             "surveyorId": surveyorId,
    //             "locationId": locationId,
    //             "projectId": projectId,
    //             "addressJsonStr": value,
    //             "type":0
    //           },
    //           header: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //           },
    //           success: (res) => {

    //           },
    //           fail: (res) => {
    //           },
    //           complete: (res) => {
    //             //清空缓存的该点位行走路线经纬度
    //              wx.removeStorageSync(locationId)
    //           }
    //         })
    //       }
    //     }
    //     that.getLocationList(surveyorId, projectId,requestUrl);
    //   },
    //   fail: (res) => {
    //   },
    //   complete: (res) => {
    //   }
    // })
  },
  changeData: function() {
    console.log("接收id：", this.data.surveyorId)
    var options = {
      projectId: this.data.projectId,
      isGrade: this.data.isGrade,
      terminalUserId: this.data.surveyorId,
      requestUrl: this.data.requestUrl,
      bgColor: this.data.bgColor,
      fontSize: this.data.fontSize
    }
    this.onLoad(options); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
  changeParentData: function() {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
      //   id: res.data.data
      // })
      beforePage.changeData(); //触发父页面中的方法
    }
  },
  onUnload: function() {
    this.changeParentData();
  }

});