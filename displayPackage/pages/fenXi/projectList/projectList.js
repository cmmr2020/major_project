const app = getApp();
var type = ''; //请求项目列表类型  0大屏  1地图
Page({

  data: {
    requestUrl: '', //服务器路径
    colorList: ['green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple'],
    elements: [],
    govId:'',
    projectType:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    type = option.type;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    this.setData({
      requestUrl: requestUrl,
      projectType:type
    })
    var that = this;
    var terminalUserId = app.terminalUserId;
    // console.log(terminalUserId)
    that.getProjectList(terminalUserId);
  },


  getProjectList: function (terminalUserId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var colorList = that.data.colorList;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/getFieldProjectListForMapOrDisplayByUser',
      // url: 'http://192.168.15.71:8083/wechat/api/fieldProject/getListByTerminalUserId',
      data: {
        terminalUserId: terminalUserId,
        type: type
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        var arr = [];
        if (res.data.status == 'success') {
          var projectList = res.data.retObj;
          that.setData({
            govId:res.data.message
          })
          console.log(projectList)
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
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })

  },
  changeData: function () {

    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})