//项目列表页面
const app = getApp();
Page({

  data: {
    requestUrl: '', //服务器路径
    colorList: ['green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple'],
    elements: [],
    terminalUserId:'',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
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


  getProjectList: function (terminalUserId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var colorList = that.data.colorList;

    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/mobile/review/getReviewProjectListByTerminalUserId',
      {
        terminalUserId: terminalUserId
      },
      app.seesionId,
      (res) =>{
        // console.log("项目数据", res.data.retObj)
        var arr = [];
        if (res.data.status == 'success') {
          var projectList = res.data.retObj;
          if (typeof (projectList) === "undefined") {
            wx.showToast({
              title: '该调查员没有绑定项目',
              icon: 'none',
              duration: 3000,
              mask: true
            })
          } else {
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
              latitude: projectList[i].latitude,
              longitude: projectList[i].longitude,
              name: projectList[i].name,
              status: projectList[i].status,
              updateBy: projectList[i].updateBy,
              updateTime: projectList[i].updateTime,
              version: projectList[i].version
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
    //   url: requestUrl + '/mobile/review/getReviewProjectListByTerminalUserId',
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
    //       if (typeof (projectList) === "undefined") {
    //         wx.showToast({
    //           title: '该调查员没有绑定项目',
    //           icon: 'none',
    //           duration: 3000,
    //           mask: true
    //         })
    //       } else {
    //       for (var i = 0; i < projectList.length; i++) {
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
    //       }
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
    go:function(e){
    var projectId = e.currentTarget.dataset.id;
    var isGrade = e.currentTarget.dataset.isgrade;
    // console.log("项目id",projectId)
    wx.setStorageSync("projectId", projectId);
    wx.setStorageSync("isGrade", isGrade);
    wx.navigateTo({
      url:"../fuCha_point_type/fuCha_point_type"
    })
  },
  changeData: function () {

    // var options = {'id':this.data.id}

    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})