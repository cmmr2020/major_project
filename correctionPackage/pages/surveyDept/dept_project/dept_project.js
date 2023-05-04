const app = getApp();
var requestUrl = ""
Page({

  data: {
    requestUrl: '', //服务器路径
    colorList: ['green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple','green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple','green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple','green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple'],
    elements: [],
    fontSize:'',
    bgColorUi:'',
    modalName:'',
    deptGroupBts:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var that = this;
    requestUrl = app.globalData.requestUrl; //服务器路径
    var fontSize = wx.getStorageSync('fontSize');
    var bgColorUi = wx.getStorageSync('bgColorUi');
    that.setData({
      requestUrl: requestUrl,
     fontSize:fontSize,
     bgColorUi:bgColorUi
    })
    var terminalUserId = app.terminalUserId;
    // console.log(terminalUserId)
    that.getProjectList(terminalUserId);
  },


  getProjectList: function(terminalUserId) {
    var that = this;
    var colorList = that.data.colorList;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/mobile/fieldTask/getFieldProjectListByUser',
      {
        terminalUserId: terminalUserId
      },
      app.seesionId,
      (res) =>{
        var arr = [];
        console.log(res)
        if (res.data.status == 'success') {
          var projectList = res.data.retObj;
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
            title: res.data.message,
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
    //   url: requestUrl + '/mobile/fieldTask/getFieldProjectListByUser',
    //   // url: 'http://192.168.15.71:8083/wechat/api/fieldProject/getListByTerminalUserId',
    //   data: {
    //     terminalUserId: terminalUserId
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     var arr = [];
    //     console.log(res)
    //     if (res.data.status == 'success') {
    //       var projectList = res.data.retObj;
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
    //     } else {
    //       wx.showToast({
    //         title: res.data.message,
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
  navigate:function(e){
    var that = this
    var projectId = e.currentTarget.dataset.projectid
    app.wxRequest(
      'GET',
      requestUrl + '/mobile/fieldTask/getGovProByWX',
      {
        projectId: projectId
      },
      app.seesionId,
      (res) =>{
        console.log(res)
        var govPro = res.data.retObj.govPro
        //是否为牵头配合模式
        var isDepartType = govPro.isDepartType
        if(govPro.isTaskGroup){
          var roleList = res.data.retObj.roleList
          var isHeadman = -1; // 是否为组长 1 是  0否
          for(let i=0; i<roleList.length; i++){
            let item = roleList[i]
            if (item.name == '实地整改组长-T'){
                isHeadman = 1
           }
            if (item.name == '实地整改组员-T'){
                isHeadman = 0
            }
          }
          //若未关联组长 组员角色 按原始流程走
          if (isHeadman < 0){
            if (isDepartType == 1) {//牵头配合模式
              wx.navigateTo({
                url: '../dept_type_task_index/dept_type_task_index?projectId='+projectId,
              })
            } else {//普通模式
              wx.navigateTo({
                url: '../dept_index/dept_index?projectId='+projectId,
              })
            }
          }else{
            if(isHeadman == 0){//组员直接跳转
              wx.navigateTo({
                url: '../dept_group_task_index/dept_group_task_index?projectId='+projectId+"&isHeadman="+isHeadman,
              })
              return
            }
            var elementList = res.data.retObj.elementList
            console.log('角色元素:',elementList);
            that.setData({
              modalName:'DialogModal2',
              deptGroupBts:elementList,
              isDepartType:isDepartType,
              projectId:projectId,
              isHeadman:isHeadman
            })
          }
        }else{
          if (isDepartType == 1) {//牵头配合模式
            wx.navigateTo({
              url: '../dept_type_task_index/dept_type_task_index?projectId='+projectId,
            })
          } else {//普通模式
            wx.navigateTo({
              url: '../dept_index/dept_index?projectId='+projectId,
            })
          }
        }
      },
      (err) =>{

      }
    )
  },
  toZGPage:function(e){
    var that = this
    var bt_name = e.currentTarget.dataset.name;
    var isDepartType = that.data.isDepartType;
    var projectId = that.data.projectId;
    var isHeadman = that.data.isHeadman
    if(bt_name == '单位模式'){
      if (isDepartType == 1) {//牵头配合模式
        wx.navigateTo({
          url: '../dept_type_task_index/dept_type_task_index?projectId='+projectId,
        })
      } else {//普通模式
        wx.navigateTo({
          url: '../dept_index/dept_index?projectId='+projectId,
        })
      }
    }else{
      wx.navigateTo({
        url: '../dept_group_task_index/dept_group_task_index?projectId='+projectId+"&isHeadman="+isHeadman,
      })
    }
    that.setData({
      modalName:'',
    })
  },
  changeData: function() {
    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },
  alert:function(msg){
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1000,
      mask: true
    })
  },
  hideModal:function(){
    this.setData({
      modalName:'',
      deptGroupBts:[]
    })
  }
})