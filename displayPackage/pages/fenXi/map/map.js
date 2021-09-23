var projectId =''; //'ff80808173960d9a01739fc10889583b';
var icon_green = '../../../../images/green_location.png';
var icon_red = '../../../../images/red_location.png';
const app = getApp();
var requestUrl=app.globalData.requestUrl
var mapCtx;
const allMarkers = [];
const markers_map=new Map();
const customCallout2 = {
  id: 3,
  latitude: 23.096994,
  longitude: 113.324520,
  iconPath: '../../../../images/green_location.png',
}

/**
 * 附近位置最大最小经纬度计算
 * @param   longitude  经度
 * @param   latitude   纬度
 * @param   zoom    地图缩放级别
 * @returns 格式：经度最小值-经度最大值-纬度最小值-纬度最大值
 */
function  inLongitudeLatitude(longitude,latitude,zoom){
  // console.log("MaxMinLongitudeLatitude",longitude,latitude);
  //  console.log(zoom)
  if (!longitude||!latitude||!zoom){
    return null;
  }
  var distince; //范围  距离（千米）
  if(13<=zoom&&zoom<14){
    distince = 3.5
  }else if(14<=zoom&&zoom<15){
    distince = 3
  }else if(15<=zoom&&zoom<16){
    distince = 2
  }else if(16<=zoom&&zoom<17){
    distince = 1
  }else if(17<=zoom&&zoom<18){
    distince = 0.8
  }else if(19<=zoom&&zoom<20){
    distince = 0.5
  }else if(20<=zoom){
    distince = 0.2
  }else{
    distince = 5
  }
  console.log(distince)
  let r = 6371.393;    // 地球半径千米
  let lng = longitude;
  let lat = latitude;
  let dlng = 2 * Math.asin(Math.sin(distince / (2 * r)) / Math.cos(lat * Math.PI / 180));
  dlng = dlng * 180 / Math.PI;// 角度转为弧度
  let dlat = distince / r;
  dlat = dlat * 180 / Math.PI;
  let minlat = lat - dlat;
  let maxlat = lat + dlat;
  let minlng = lng - dlng;
  let maxlng = lng + dlng;
  return  minlat + "*" + maxlat + "*" +minlng + "*"+maxlng+"*"+(distince*1000);
}


Page({
  data: {
    latitude: '',
    longitude: '',
    markers: [],
    customCalloutMarkerIds: [],
    num: 1,
    showLocationInfo:false,
    model_title:'',
    quota_total:'',
    quota_ok_num:'',
    quota_not_ok_num:'',
    isLoadStatistics:false,
    location_info_list:[{
    }]
  },
  onReady: function (e) {
    mapCtx = wx.createMapContext('myMap')
  },
  onLoad:function(e){
    console.log(e)
    if(!e.projectId){
      wx.showToast({
        title: '参数获取失败',
        icon: 'none', // "success", "loading", "none"
        duration: 1500,
        mask: false,
      })
      return
    }else{
      wx.setNavigationBarTitle({
      title: e.projectName+'地图展示'
    })
      wx.showLoading({
        title: '数据加载中',
      })
      projectId = e.projectId;
      this.initMap()
      this.initQuotaInfo();
    }
  },
  initMap(){
    var that = this;
    wx.request({
      // 必需
      url: requestUrl + '/private/largeScreenDisplay/renderDataForMap',
      data: {
        projectId:projectId,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          console.log(res)
          var dataList = res.data.retData
          if(res.data.retData&&res.data.retData.length>1){
            that.setData({
              latitude:dataList[0].latitude,
              longitude:dataList[0].longitude
            })
            for(let i=0; i<dataList.length; i++){
              markers_map.set("'"+i+"'",{
                latitude: dataList[i].latitude,
                longitude: dataList[i].longitude
              })
              if(dataList[i].optionCode=='1'){//达标
                allMarkers.push({
                  id: i,
                  latitude: dataList[i].latitude,
                  longitude: dataList[i].longitude,
                  iconPath: icon_green,
                })
              }else{
                allMarkers.push({
                  id: i,
                  latitude: dataList[i].latitude,
                  longitude: dataList[i].longitude,
                  iconPath: icon_red,
                })
              }
            }
            this.addMarker()
          }else{
            wx.showToast({
              title: '暂无数据',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
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
      },
      complete:(res) => {
        // wx.hideLoading()
      }
    })
  },
  //初始化指标数据
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
          var not_ok_num = res.data.retObj.UnOkNum;
          that.setData({
            quota_total:allNum,
            quota_ok_num:okNum,
            quota_not_ok_num:not_ok_num,
            isLoadStatistics:true
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
      },
      complete:(res) => {
         wx.hideLoading()
      }
    })
  },
  addMarker() {
    const markers = allMarkers
    this.setData({
      markers,
      customCalloutMarkerIds: [2,3,4],
    })
  },
  closeModel:function(){
    var that = this;
    that.setData({
      showLocationInfo:false
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  //地图点击事件
  simtap(e){
    var that = this;
    mapCtx.getScale({
      success:function(res){
        var latAndLngArr = inLongitudeLatitude(e.detail.longitude, e.detail.latitude, res.scale)
        console.log(latAndLngArr)
        if (latAndLngArr == null) {
          wx.showToast({
            title: '获取坐标指标失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
          return
      } else {
          latAndLngArr = latAndLngArr.split('*');
          wx.showLoading({
            title: '数据加载中',
          })
          wx.request({
            // 必需
            url: requestUrl + '/private/largeScreenDisplay/getLocationScoreList',
            data: {
              projectId: projectId,
              minlat: latAndLngArr[0],
              maxlat: latAndLngArr[1],
              minlng: latAndLngArr[2],
              maxlng: latAndLngArr[3]
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: (res) => {
              if (res.data.status=='success') {
                if (res.data.retObj.length > 1) {
                  var arry = new Array();
                  that.setData({
                    location_info_list:res.data.retObj,
                    showLocationInfo:true,
                    model_title:latAndLngArr[4]+'米,附近点位测评情况'
                  })
                }else{
                  wx.showToast({
                    title: '暂无数据',
                    icon: 'none', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                  })
                }
              }else{
                wx.showToast({
                  title: '暂无数据',
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
            },
            complete:(res) => {
              wx.hideLoading()
            }
          })
      }
      },
      fail:function(){
        wx.showToast({
          title: '获取地图数据失败',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    })
  },
  //标注点击事件
  markertap(e) {
    // console.log(markers_map)
    var obj = markers_map.get("'"+e.markerId+"'")
    console.log(obj)
    var that = this;
    mapCtx.getScale({
      success:function(res){
        var latAndLngArr = inLongitudeLatitude(obj.longitude, obj.latitude, res.scale)
        console.log(latAndLngArr)
        if (latAndLngArr == null) {
          wx.showToast({
            title: '获取坐标指标失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
          return
      } else {
          latAndLngArr = latAndLngArr.split('*');
          wx.showLoading({
            title: '数据加载中',
          })
          wx.request({
            // 必需
            url: requestUrl + '/private/largeScreenDisplay/getLocationScoreList',
            data: {
              projectId: projectId,
              minlat: latAndLngArr[0],
              maxlat: latAndLngArr[1],
              minlng: latAndLngArr[2],
              maxlng: latAndLngArr[3]
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: (res) => {
              if (res.data.status=='success') {
                if (res.data.retObj.length > 1) {
                  that.setData({
                    location_info_list:res.data.retObj,
                    showLocationInfo:true,
                    model_title:latAndLngArr[4]+'米,附近点位测评情况'
                  })
                }else{
                  wx.showToast({
                    title: '暂无数据',
                    icon: 'none', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                  })
                }
              }else{
                wx.showToast({
                  title: '暂无数据',
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
            },
            complete:(res) => {
              wx.hideLoading()
            }
          })
      }
      },
      fail:function(){
        wx.showToast({
          title: '获取地图数据失败',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    })
  },
  translateMarker: function () {
    const length = this.data.markers.length
    if (length === 0) return
    const index = Math.floor(Math.random() * length)
    const markers = this.data.markers
    const marker = markers[index]
    marker.latitude = marker.latitude + 0.002
    marker.longitude = marker.longitude + 0.002
    const that = this
    this.mapCtx.translateMarker({
      markerId: marker.id,
      duration: 1000,
      destination: {
        latitude: marker.latitude,
        longitude: marker.longitude
      },
      animationEnd() {
        that.setData({markers})
        console.log('animation end')
      },
      complete(res) {
        console.log('translateMarker', res)
      }
    })
  },
  changeContent() {
    const num = Math.floor(Math.random() * 10)
    this.setData({num})
  }
})
