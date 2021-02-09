// 地图模式页面
var QQMapWX = require('../../../../libs/qqmap-wx-jssdk.min.js');

let qqmapsdk;

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    amapPlugin: null,
    // key: "6799b5f6f88d3d9fb52ac244855a8759",
    // key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    key: 'ZI6BZ-MS2WF-ODSJP-NHDBT-TPBNH-KLB4G',
    lat: 39.915744,//地图默认经纬度中心，目前没用上，目前是当前是用户当前位置作为地图中心，在getAddress()函数定义。
    lng: 116.465212,
    covers: [],
    address: [],
    scrollH: 256,

    showTitle: '地图可缩放',//点位名称
    showAddress: '',//点位地址
    showDistance: '请点击点位标识查看定位详细信息',//当前位置距离点位的距离
    showId: '',
    pointId: '',
    hidden: true,

    markersList: [],
    projectId:'', 
     isGrade:'', 
     requestUrl:'',
     fontSize:'',
     bgColor:''
  },

  onLoad: function(options) {
    var that = this;
    var markersList = wx.getStorageSync('markersList');
    //console.log(markersList)
    var projectId = options.projectId;
    var isGrade = options.isGrade;
    var requestUrl = options.requestUrl;
    var fontSize = options.fontSize;
    var bgColor = options.bgColor;
    that.setData({
      projectId: projectId,
      isGrade: isGrade,
      requestUrl: requestUrl,
      fontSize: fontSize,
      bgColor: bgColor
    })
    wx.getSystemInfo({
      success: function(res) {
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将600rpx转换为px）
          scrollH: res.windowHeight - 50 - res.windowWidth / 750 * 600
        })
      }
    })
    // this.setData({
    //   amapPlugin: new amap.AMapWX({
    //     key: this.data.key
    //   })
    // })
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    that.currentLocation();
    if (markersList.length != 0) {
      that.getList(markersList)
    }else{
      wx.showToast({
        title: '该点位列表无经纬度',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      that.setData({
        showTitle: '该点位列表无经纬度'
      })
      return;
    }

   
  },

  currentLocation() {
    //当前位置
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
        that.getLocationByLonglat(res.longitude, res.latitude);
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
          lng: res.result.location.lng,
          lat: res.result.location.lat
        })
      },
      fail: (res) => {
        callback();
      }
    })
  },
  // getLocation() {
  //   var that = this
  //   this.data.amapPlugin.getRegeo({
  //     success: (data) => {
  //       console.log("这是：",data)
  //       that.setData({
  //         lng: data[0].longitude,
  //         lat: data[0].latitude
  //       })
  //     },
  //     fail: (info) => {
  //       callback();
  //     }
  //   })
  // },

  marker: function(e) {
    var that = this;
    var index = Number(e.markerId);
    var item = this.data.address[index];
    // console.log("item:",item)
    var showTitle = item.title;
    var showAddress = item.address;
    // var pointId  = item.pointId;
    var showId = item.id;
    var log = item.longitude;
    var lat = item.latitude;
    // 调用接口
    qqmapsdk.calculateDistance({
      to: [{
        latitude: lat, //商家的纬度
        longitude: log, //商家的经度
      }],
      success: function(res) {
        // console.log("这是距离：",res)
        let hw = res.result.elements[0].distance //拿到距离(米)
        if (hw < 1000) {
          hw = hw + 'm',
            that.setData({
              showDistance: hw
            })
        } else {
          if (hw && hw !== -1) { //拿到正确的值
            //转换成公里
            hw = (hw / 2 / 500).toFixed(2) + 'km'
          } else {
            hw = "距离太近或请刷新重试"
          }
          that.setData({
            showDistance: hw
          })
        }
        // console.log(hw)
      }
    });
    that.setData({
      showTitle: showTitle,
      showAddress: showAddress,
      showId: showId,
      hidden: false
    })
    this.getLocationByLonglat(log, lat);
  },
  // // 计算距离
  // findShop(log, lat) {
  //   // 实例化API核心类
  //   var that = this
  //   // var demo = new QQMapWX({
  //   //   key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP' // 必填
  //   // });

  // },
  // 
  //经纬度获取位置
  getLocationByLonglat: function(log, lat) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: log
      },
      success: function(res) {
        // console.log(res)
        let city = res.result.address_component.city;
        // console.log(city)
      }
    })
  },

 
  getList(list) {
    var that = this;
    // var list = that.data.markersList;
    console.log("当前位置，", list)
    let arr = [];
    let addr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push({
        id: i,
        latitude: list[i].latitude,
        longitude: list[i].longitude,
        title: list[i].name
      })
      addr.push({
        id: i,
        latitude: list[i].latitude,
        longitude: list[i].longitude,
        title: list[i].name,
        address: list[i].address,
        pointId: list[i].pointId,
        pointTypeId:list[i].pointTypeId,
        submitStatus:list[i].submitStatus,
        isRecord:list[i].isRecord,
        timeInterval:list[i].timeInterval
      })
    }
    that.setData({
      address: addr,
      covers: arr
    })
    console.log("address:",addr)
    // wx.hideLoading()
  },
  go(event) {
    var index = Number(event.currentTarget.dataset.id);
    var item = this.data.address[index];
    if (item.title === "请点击点位标识查看定位详细信息") {
      wx.showToast({
        title: '请点击地图点位标识',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    // console.log(item)
    var latitude = Number(item.latitude)
    var longitude = Number(item.longitude)
    // console.log(latitude)
    wx.openLocation({
      name: item.title,
      address: item.address,
      latitude,
      longitude,
      scale: 18
    })
  },
  goToPoint_detail: function(event) {
    var that = this;
    var projectId = that.data.projectId;
    var isGrade = that.data.isGrade;
    var requestUrl = that.data.requestUrl;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;
    var index = Number(event.currentTarget.dataset.id);
    var item = this.data.address[index];
    if (item.title === "地图可缩放") {
      wx.showToast({
        title: '请点击地图点位标识',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    var id = item.pointId;
    var name = item.title;
    var pointTypeId = item.pointTypeId;
    var firstQuestion = item.submitStatus;
    var timeInterval = item.timeInterval;
    var isRecord = item.isRecord;
    var submitStatus = item.submitStatus;
    // var id = that.data.pointId;
    wx.navigateTo({
      url: "../point_detail/point_detail?id=" + id + "&name=" + name + "&pointTypeId=" + pointTypeId + "&firstQuestion=" + firstQuestion + "&projectId=" + projectId + "&isGrade=" + isGrade + "&requestUrl=" + requestUrl + "&fontSize=" + fontSize + "&bgColor=" + bgColor +"&timeInterval="+timeInterval+"&isRecord="+isRecord+"&submitStatus="+submitStatus
    })
  }
})