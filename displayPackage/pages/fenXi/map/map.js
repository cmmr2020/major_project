var projectId =''; //'ff80808173960d9a01739fc10889583b';
var icon_green = '../../../../images/green_location.png';
var icon_red = '../../../../images/red_location.png';
const app = getApp();
var requestUrl=app.globalData.requestUrl
var mapCtx;
const allMarkers = [];
const allMarkers2 = [];
const markers_map=new Map();
const markers_map2=new Map();

// const customCallout2 = {
//   id: 3,
//   latitude: 23.096994,
//   longitude: 113.324520,
//   iconPath: '../../../../images/green_location.png',
// }

/**
 * 附近位置最大最小经纬度计算
 * @param   longitude  经度
 * @param   latitude   纬度
 * @param   zoom    地图缩放级别
 * @returns 格式：经度最小值-经度最大值-纬度最小值-纬度最大值
 */
function  inLongitudeLatitude(longitude,latitude,zoom){
   console.log("MaxMinLongitudeLatitude",longitude,latitude);
    console.log(zoom)
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
  //console.log(distince)
  let r = 6371.393;    // 地球半径千米
  let lng = Number(longitude);
  let lat = Number(latitude);
  let dlng = 2 * Math.asin(Math.sin(distince / (2 * r)) / Math.cos(lat * Math.PI / 180));
  dlng = dlng * 180 / Math.PI;// 角度转为弧度
  let dlat = distince / r;
  dlat = dlat * 180 / Math.PI;
  console.log(dlat.constructor)
  let minlat = lat - dlat;
  let maxlat = lat + dlat;
  let minlng = lng - dlng;
  let maxlng = lng + dlng;
  return  minlat + "*" + maxlat + "*" +minlng + "*"+maxlng+"*"+(distince*1000);
}


Page({
  data: {
    is_stars:false,
    latitude: '',
    longitude: '',
    latitude2: '',
    longitude2: '',
    markers: [],
    markers2: [],
    customCalloutMarkerIds: [],
    customCalloutMarkerIds2: [],
    num: 1,
    locationNum:0,
    showQuotaInfo:false,
    showLocationInfo:false,
    model_title:'',
    model_title2:'',
    quota_total:'',
    quota_ok_num:'',
    quota_not_ok_num:'',
    isLoadStatistics:false,
    location_info_list:[{
    }],
    quota_info_list:[{
    }],
    map_Type:1
  },
  onReady: function (e) {
    mapCtx = wx.createMapContext('myMap')
  },
  onLoad:function(e){
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
    if(app.data.isStars==1){
      this.setData({
        is_stars : true
      })
    }
      wx.showLoading({
        title: '数据加载中',
      })
      projectId = e.projectId;
      this.initQuotaMap()
      this.initLoactionMap()
      this.initQuotaInfo();
    }
  },
  initQuotaMap(){
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
          //console.log(res)
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
            this.addQuotaMarker()
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
  initLoactionMap(){
    var that = this;
    wx.request({
      // 必需
      url: requestUrl + '/private/largeScreenDisplay/getLocationDataForMap',
      data: {
        projectId:'ff80808178cb8dc80178dfb592f84609',
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          var dataList = res.data.reportVo
          if(res.data.reportVo&&res.data.reportVo.length>1){
            that.setData({
              latitude2:dataList[0].latitude,
              longitude2:dataList[0].longitude,
              locationNum:res.data.reportVo.length
            })
            for(let i=0; i<dataList.length; i++){
              let obj = dataList[i];
              markers_map2.set("'"+i+"'",{'id':obj.id,'name':obj.name});
              if(obj.rate >= 95){
                allMarkers2.push({
                  id: i,
                  latitude: obj.latitude,
                  longitude: obj.longitude,
                  iconPath: '../../../../images/R.png',
                  width:24,
                  height:24
                })
              }else if(obj.rate >= 90 && obj.rate < 95){
                allMarkers2.push({
                  id: i,
                  latitude: obj.latitude,
                  longitude: obj.longitude,
                  iconPath: '../../../../images/P.png',
                  width:24,
                  height:24
                })
              }else if(obj.rate >= 80 && obj.rate < 90){
                allMarkers2.push({
                  id: i,
                  latitude: obj.latitude,
                  longitude: obj.longitude,
                  iconPath: '../../../../images/Y.png',
                  width:24,
                  height:24
                })
              }else if(obj.rate >= 75 && obj.rate < 80){
                allMarkers2.push({
                  id: i,
                  latitude: obj.latitude,
                  longitude: obj.longitude,
                  iconPath: '../../../../images/G.png',
                  width:24,
                  height:24
                })
              }else if(obj.rate < 75){
                allMarkers2.push({
                  id: i,
                  latitude: obj.latitude,
                  longitude: obj.longitude,
                  iconPath: '../../../../images/B.png',
                  width:24,
                  height:24
                })
              }
              
            }
            this.addLocationMarker()
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
  addQuotaMarker() {
    const markers = allMarkers
    this.setData({
      markers:markers,
      //customCalloutMarkerIds: [2,3,4],
    })
  },
  addLocationMarker () {
    const markers = allMarkers2
    this.setData({
      markers2:markers
    })
  },
  closeModel:function(){
    var that = this;
    that.setData({
      showQuotaInfo:false
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  closeModel2:function(){
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
        //console.log(latAndLngArr)
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
                    quota_info_list:res.data.retObj,
                    showQuotaInfo:true,
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
                    quota_info_list:res.data.retObj,
                    showQuotaInfo:true,
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
  markertap2(e) {
    // console.log(markers_map)
    var obj = markers_map2.get("'"+e.markerId+"'")
    console.log(obj)
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      // 必需
      url: requestUrl + '/private/largeScreenDisplay/getLocationQuotaDataForMap',
      data: {
        projectId: 'ff80808178cb8dc80178dfb592f84609',
        locationId:obj.id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log(res)
        if (res.data.status=='success') {
          if (res.data.reportVo.length > 1) {
            that.setData({
              location_info_list:res.data.reportVo,
              showLocationInfo:true,
              model_title2:obj.name
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
  },
  changeMap(){
    let that = this;
    let type = that.data.map_Type;
    console.log(type)
    if(type==1){
      that.setData({
        map_Type:2
      })
      return
    }
    if(type==2){
      that.setData({
        map_Type:1
      })
      return
    }
  }
})
