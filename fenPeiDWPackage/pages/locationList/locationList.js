// 点位类型页面
const app = getApp();
var requestUrl = app.globalData.requestUrl;
var surveyorId;
var projectId;
Page({
  data: {
    requestUrl: '', //服务器路径
    projectId: '',
    surveyorId: '', //调查员id
    open: false,
    selected: [true, true, true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [],
    fontSize:'',
    fontSize30:'',
    bgColor:'', 
    modalName:'',
    locationIds:[],
    terminalUserList:[],
    terminalUser_location_id:'',
    groupId:''
  },
  onLoad: function(e) {
    var that = this;
    
    //console.log(e)
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // projectList页面传递过来的参数
    //var isGrade = e.isGrade;
    projectId = e.projectId;
    surveyorId = e.terminalUserId;
    var bgColor = e.bgColor;
    var fontSize = e.fontSize;
    that.setData({
      // isGrade: isGrade,
      projectId: projectId,
      surveyorId: surveyorId,
      requestUrl: requestUrl,
      bgColor: bgColor,
      fontSize: fontSize,
      fontSize30: parseInt(fontSize) - 2,
      groupId:e.groupId
    })
    that.getLocationList(surveyorId, projectId, requestUrl,'');
  },
  onShow : function(){

  },
  search(e){
    //console.log(e)
    let locationName = e.detail.value
     let that = this;
     that.getLocationList(surveyorId, projectId, requestUrl,locationName)
  },
  hideModal(e) {
    // if(e.currentTarget.dataset.target == "RadioModal"){
    //   this.setData({
    //     terminalUser_location_id:'',
    //     modalName: null
    //   })
    // }else{
      this.setData({
        modalName: null
      })
    //}
    
  },
  getLocationList:function(terminalUserId, projectId,requestUrl,locationName) {
    var that = this;
    that.data.locationIds=[],
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    // var requestUrl = that.data.requestUrl; //服务器路径
    //console.log("requestUrl:",requestUrl);
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/distributeLocation/findGroupLocationList',
      {
        groupId: that.data.groupId,
        projectId: projectId,
        locationName:locationName
      },
      app.seesionId,
      (res) =>{
        wx.hideLoading();
        if (res.data.status ==="success") {
          var resList = res.data.retObj;
          //console.log("有没有点位：",resList)
           if (typeof(resList) === "undefined" ) {
              wx.showToast({
                title: '该调查员没有分配点位',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }else{
              // for(let i=0; i<resList.length; i++){
              //   let locationList =resList[i].locationList
              //   for(let j=0; j<locationList.length; j++){
              //     if(that.data.locationIds.indexOf(locationList[j].id)>=0){
              //       locationList[j].status="true"
              //     }
              //   }
              // }
              that.setData({
                list: resList
              })
          }
        } else {
          wx.showModal({
              title: '提示',
              content: "获取点位列表失败",
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

  distribution :function(e) {
    let that = this;
    if(that.data.locationIds.length<1){
      wx.showToast({
        title: '请先选择需要分配的点位',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/distributeLocation/findTerminalUserList',
      {
        groupId: that.data.groupId,
      },
      app.seesionId,
      (res) =>{
        if (res.data.status ==="success") {
          //console.log(res.data.retObj)
          that.setData({
            terminalUserList : res.data.retObj,
            modalName: e.currentTarget.dataset.target
          })
        }
      },
      (err) =>{

      }
    )
  },
  radioChange(e){
    let that = this;
    that.data.terminalUser_location_id = e.detail.value
  },
  checkboxChange(e){
    let that = this;
    that.data.locationIds = e.detail.value 
  },
  bindLocationForTerminalUser(){
    let that = this;
    let userId = that.data.terminalUser_location_id
    if(!userId){
      wx.showToast({
        title: '请选择调查员',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    //console.log(JSON.stringify(that.data.locationIds))
  //  调用全局 请求方法
    app.wxRequest(
      'POST',
      requestUrl + '/wechat/api/distributeLocation/saveOrUpdateSurveyorLocation',
      {
        projectId : projectId,
        locationIds : JSON.stringify(that.data.locationIds),
        surveyorId : userId,
        terminalUserId:surveyorId,
        groupId:that.data.groupId
      },
      app.seesionId,
      (res) =>{
        that.hideModal()
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 2000,
          mask: true,
          success:function(res){
            that.getLocationList(surveyorId, projectId, requestUrl,'');
          }
        })
      },
      (err) =>{
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    )

    //console.log('分配的调查员id:'+userId)
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