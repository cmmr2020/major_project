//点位类型页面
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
  },

  onLoad: function (options) {
  },
    onShow:function(){
    var that = this;
    var terminalUserId = app.terminalUserId;
    var projectId = wx.getStorageSync('projectId');
    var isGrade = wx.getStorageSync('isGrade'); //是否打分
    var bgColor = wx.getStorageSync('bgColor');
    var fontSize = wx.getStorageSync('fontSize');
    var requestUrl = app.globalData.requestUrl; //服务器路径
    that.setData({
      requestUrl: requestUrl,
      isGrade: isGrade,
      projectId: projectId,
      surveyorId: terminalUserId,
      bgColor:bgColor,
      fontSize:fontSize,
      fontSize30:parseInt(fontSize)-2
    })
    that.getLocationList(terminalUserId, projectId);
  },
  getLocationList: function (terminalUserId, projectId) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    var requestUrl = that.data.requestUrl; //服务器路径
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/mobile/review/getFieldReviewPointLocationList',
      {
        terminalUserId: terminalUserId,
        projectId: projectId
      },
      app.seesionId,
      (res) =>{
        if (res.data.status == 'success') {
          wx.hideLoading();

          var mapList = res.data.retObj;
            if (typeof(mapList) === "undefined" ) {
              wx.showToast({
                title: '该调查员没有分配点位',
                icon: 'none',
                duration: 3000,
                mask: true
              })
            }else{
          let map = [];
          for (let i = 0; i < mapList.length; i++) {
            if (mapList[i].locationList != null) {
              map.push({
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
                pointId: map[i].list[j].id
              })
            }
          }
          that.setData({
            list: res.data.retObj,
            markersList: mapLists
          })
          wx.setStorageSync('markersList', mapLists);
        }
        } else {
          wx.showToast({
            title: '获取点位树失败',
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
    //   url: requestUrl + '/mobile/review/getFieldReviewPointLocationList',
    //   data: {
    //     terminalUserId: terminalUserId,
    //     projectId: projectId
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     if (res.data.status == 'success') {
    //       wx.hideLoading();

    //       var mapList = res.data.retObj;
    //         if (typeof(mapList) === "undefined" ) {
    //           wx.showToast({
    //             title: '该调查员没有分配点位',
    //             icon: 'none',
    //             duration: 3000,
    //             mask: true
    //           })
    //         }else{
    //       let map = [];
    //       for (let i = 0; i < mapList.length; i++) {
    //         if (mapList[i].locationList != null) {
    //           map.push({
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
    //             pointId: map[i].list[j].id
    //           })
    //         }
    //       }
    //       that.setData({
    //         list: res.data.retObj,
    //         markersList: mapLists
    //       })
    //       wx.setStorageSync('markersList', mapLists);
    //     }
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


  kindToggle: function (e) {
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
  // show(e) {
  //     let index = e.currentTarget.dataset.index;
  //     let active = this.data.active;

  //     this.setData({
  //       [`selected[${index}]`]: !this.data.selected[`${index}`],
  //       active: index
  //     });

  //     // 如果点击的不是当前展开的项，则关闭当前展开的项
  //     // 这里就实现了点击一项，隐藏另一项
  //     if (active !== null && active !== index) {
  //       this.setData({ [`selected[${active}]`]: false });
  //     }
  // }

  goToMap: function () {
    var that = this;
    var projectId = that.data.projectId;
    var isGrade = that.data.isGrade;
    var requestUrl = that.data.requestUrl;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;
    wx.navigateTo({
      url: "../fuCha_map/fuCha_map?projectId=" + projectId + "&isGrade=" + isGrade + "&requestUrl=" + requestUrl + "&fontSize=" + fontSize + "&bgColor=" + bgColor,
    })
  },
  submit: function (e) {
    var that = this;
    let locationId = e.currentTarget.dataset.index;
    var surveyorId = that.data.surveyorId;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl; //服务器路径
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldLocation/updateCheckStatus',
      {
        surveyorId: surveyorId,
        locationId: locationId,
        status: '2'
      },
      app.seesionId,
      (res) =>{
        // console.log("提交按钮：", res.data)

        that.getLocationList(surveyorId, projectId);

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
    //     status: '2'
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     // console.log("提交按钮：", res.data)

    //     that.getLocationList(surveyorId, projectId);


    //   },
    //   fail: (res) => {

    //   },
    //   complete: (res) => {

    //   }
    // })
  },

  changeData: function () {

    var options = {
      projectId: this.data.projectId,
      isGrade: this.data.isGrade
    }

    this.onLoad(options); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },

  changeParentData: function () {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
      //   id: res.data.data
      // })
      beforePage.changeData(); //触发父页面中的方法
    }
  },

  onUnload: function () {
    this.changeParentData();
  }

});