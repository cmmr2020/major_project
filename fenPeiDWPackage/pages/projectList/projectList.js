//项目列表
const app = getApp();
const group_Map = new Map();
Page({
  data: {
    requestUrl: '', //服务器路径
    colorList: ['green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple','green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple','green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple','green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple'],
    elements: [],
    terminalUserId:'',
    fontSize:'',
    bgColorUi:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var that = this;
    var list = app.groupIdList
    for(let i=0; i<list.length; i++){
      group_Map.set(list[i].projectId,list[i].id)
    }
    var that = this;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    var terminalUserId = app.terminalUserId;
    var fontSize = wx.getStorageSync('fontSize');
    var bgColor = wx.getStorageSync('bgColor');
    var bgColorUi = wx.getStorageSync('bgColorUi');
    that.setData({
      requestUrl: requestUrl,
      terminalUserId:terminalUserId,
       fontSize:fontSize,
       bgColorUi:bgColorUi, 
       bgColor:bgColor
    })
    // console.log(terminalUserId)
    that.getProjectList(terminalUserId);
  },
  getProjectList: function(terminalUserId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var colorList = that.data.colorList;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/distributeLocation/getDistributeLocationProjectList',
      {
        terminalUserId: terminalUserId
      },
      app.seesionId,
      (res) =>{
        // console.log("项目数据", res.data.retObj)
        var arr = [];
        if (res.data.status == 'success') {
          var projectList = res.data.retObj;
          if (typeof(projectList) === "undefined" ) {
              wx.showToast({
                title: '该调查员没有绑定项目',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }else{
            for (var i = 0; i < projectList.length; i++) {
            var color = colorList[i];
            arr.push({
              color: color,
              id: projectList[i].id,
              code: projectList[i].code,
              createBy: projectList[i].createBy,
              createTime: projectList[i].createTime,
              isCheck: projectList[i].isCheck,
              isConsistent: projectList[i].isConsistent,
              isGrade: projectList[i].isGrade,
              isPhoto: projectList[i].isPhoto,
              latitude: projectList[i].latitude,
              longitude: projectList[i].longitude,
              name: projectList[i].name,
              status: projectList[i].status,
              updateBy: projectList[i].updateBy,
              updateTime: projectList[i].updateTime,
              version: projectList[i].version,
              groupId:group_Map.get(projectList[i].id)
            })
          }

          that.setData({
            elements: arr
          })
          // console.log("修改后的项目数据", arr)
            }
         
        } else {
          wx.showToast({
            title: '获取项目列表失败',
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
    //   url: requestUrl + '/wechat/api/distributeLocation/getDistributeLocationProjectList',
    //   data: {
    //     terminalUserId: terminalUserId
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     // console.log("项目数据", res.data.retObj)
    //     var arr = [];
    //     if (res.data.status == 'success') {
    //       var projectList = res.data.retObj;
    //       if (typeof(projectList) === "undefined" ) {
    //           wx.showToast({
    //             title: '该调查员没有绑定项目',
    //             icon: 'none',
    //             duration: 2000,
    //             mask: true
    //           })
    //         }else{
    //            for (var i = 0; i < projectList.length; i++) {
    //         var color = colorList[i];
    //         arr.push({
    //           color: color,
    //           id: projectList[i].id,
    //           code: projectList[i].code,
    //           createBy: projectList[i].createBy,
    //           createTime: projectList[i].createTime,
    //           isCheck: projectList[i].isCheck,
    //           isConsistent: projectList[i].isConsistent,
    //           isGrade: projectList[i].isGrade,
    //           isPhoto: projectList[i].isPhoto,
    //           latitude: projectList[i].latitude,
    //           longitude: projectList[i].longitude,
    //           name: projectList[i].name,
    //           status: projectList[i].status,
    //           updateBy: projectList[i].updateBy,
    //           updateTime: projectList[i].updateTime,
    //           version: projectList[i].version
    //         })
    //       }

    //       that.setData({
    //         elements: arr
    //       })
    //       // console.log("修改后的项目数据", arr)
    //         }
         
    //     } else {
    //       wx.showToast({
    //         title: '获取项目列表失败',
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
  //点击
  goDistribute:function(e){
      console.log(e)
    var that = this;
    var projectId = e.currentTarget.dataset.id;
    var groupId = e.currentTarget.dataset.groupid;
    var terminalUserId = that.data.terminalUserId; 
    var requestUrl = that.data.requestUrl;
    var bgColor = that.data.bgColor;
    var fontSize = that.data.fontSize;
    wx.navigateTo({
      url:"../locationList/locationList?projectId=" + projectId +
        "&requestUrl=" + requestUrl + "&terminalUserId=" + terminalUserId + "&bgColor=" + bgColor
        + "&fontSize=" + fontSize+"&groupId="+ groupId,
     success: function(res) {
      console.log("进去了吗")
              // 通过eventChannel向被打开页面传送数据
              // res.eventChannel.emit('projectList', {
              //   isGrade: isGrade,
              //   projectId: projectId,
              //   requestUrl: requestUrl,
              //   terminalUserId:terminalUserId,
              //   bgColor:bgColor,
              //   fontSize:fontSize
              // })
            }
    })
  },

  changeData: function() {
    // var options = {'id':this.data.id}
    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})