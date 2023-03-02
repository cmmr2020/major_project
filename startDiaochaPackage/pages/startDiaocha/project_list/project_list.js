//项目列表
const app = getApp();
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
    //console.log(app.terminalUserId)
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldProject/getListByTerminalUserId',
      {
        terminalUserId: terminalUserId
      },
      app.seesionId,
      (res) =>{
        //console.log("项目数据", res.data.retObj)
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
              isFieldArchive:projectList[i].isFieldArchive,
              isOptionOn:projectList[i].isOptionOn, //是否隐藏答案选择框   0不显示  1显示
              isSelectPhoto:projectList[i].isSelectPhoto, //是否允许选取相册图片 0 不允许 1 允许
              isOperationTips:projectList[i].isOperationTips//是否为实地2.0
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
    //   url: requestUrl + '/wechat/api/fieldProject/getListByTerminalUserId',
    //   data: {
    //     terminalUserId: terminalUserId
    //   },
    //   header: {
    //     'Content-Type': 'application/json',
    //     'cookie':app.seesionId
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
    go:function(e){
    //console.log(e)
    var that = this;
    var projectId = e.currentTarget.dataset.id;
    var terminalUserId = that.data.terminalUserId; 
    var isGrade = e.currentTarget.dataset.isgrade;
    var isFieldArchive = e.currentTarget.dataset.isfieldarchive;
    var isOptionOn = e.currentTarget.dataset.isoptionon;
    var isSelectPhoto = e.currentTarget.dataset.isselectphoto;
    var isOperationTips = e.currentTarget.dataset.isoperationtips; //是否为实地2.0
    app.data.isPhoto = e.currentTarget.dataset.isphoto;
     //console.log(app.data.isPhoto)
    that.validTime(projectId,terminalUserId,isGrade,isFieldArchive,isOptionOn,isSelectPhoto,isOperationTips);
  },

  validTime:function(projectId,terminalUserId,isGrade,isFieldArchive,isOptionOn,isSelectPhoto,isOperationTips){
    var that = this;
    var requestUrl = that.data.requestUrl;
    var bgColor = that.data.bgColor;
    var fontSize = that.data.fontSize;
    app.wxRequest(
      'POST',
       requestUrl + '/wechat/api/fieldProject/validTime',
      {
        surveyorId: terminalUserId,
        projectId: projectId
      },
      app.seesionId,
      (res) =>{
        if (res.data.httpStatusCode===200) {
          var message =  res.data.message.substring(0,3);
          // console.log("来了",message)
          if (message==="001"|| message==="002"|| message==="004" || message==="006") {
            ////是否隐藏答案选择框   0不显示  1显示  //默认显示 1
            app.project_isOptionOn_map.set(projectId,isOptionOn == '0'? 0 : 1)
            //是否允许选取相册图片 0 不允许 1 允许 //默认不允许 0
            app.project_isSelectPhoto_map.set(projectId,isSelectPhoto == '1'? 1 : 0)
            if(isOperationTips == 1){//如果为实地2.0 跳转到专属页面
              if(typeof(app.projectWaterMark_map.get(projectId)) == 'undefined'){
               that.getProjectWaterMark(projectId,requestUrl,terminalUserId,bgColor,fontSize)
              }else{
                wx.navigateTo({
                  url:"../field_operation_tips/field_operation_tips?projectId=" + projectId +
                    "&requestUrl=" + requestUrl + "&terminalUserId=" + terminalUserId + "&bgColor=" + bgColor
                    + "&fontSize=" + fontSize
                })
              }
            }else{
              wx.navigateTo({
                url:"../point_type/point_type?isGrade=" + isGrade + "&projectId=" + projectId +
                  "&requestUrl=" + requestUrl + "&terminalUserId=" + terminalUserId + "&bgColor=" + bgColor
                  + "&fontSize=" + fontSize + "&isFieldArchive=" + isFieldArchive
              })
            }
          }else{
           wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel:false,
              confirmColor:"#0081ff",
              success (res) {
              }
            })
          }
        }else{
          wx.showToast({
            title: '获取项目信息失败',
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
    //   url: requestUrl + '/wechat/api/fieldProject/validTime',
    //   method: "POST",
    //   data: {
    //     surveyorId: terminalUserId,
    //     projectId: projectId
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: (res) => {
    //     if (res.data.httpStatusCode===200) {
    //       var message =  res.data.message.substring(0,3);
    //       // console.log("来了",message)
    //       if (message==="001"|| message==="002"|| message==="004" || message==="006") {
    //         wx.navigateTo({
    //           url:"../point_type/point_type?isGrade=" + isGrade + "&projectId=" + projectId +
    //             "&requestUrl=" + requestUrl + "&terminalUserId=" + terminalUserId + "&bgColor=" + bgColor
    //             + "&fontSize=" + fontSize,
    //          success: function(res) {
    //           console.log("进去了吗")
    //                   // 通过eventChannel向被打开页面传送数据
    //                   // res.eventChannel.emit('projectList', {
    //                   //   isGrade: isGrade,
    //                   //   projectId: projectId,
    //                   //   requestUrl: requestUrl,
    //                   //   terminalUserId:terminalUserId,
    //                   //   bgColor:bgColor,
    //                   //   fontSize:fontSize
    //                   // })
    //                 }
    //         })

    //       }else{
    //        wx.showModal({
    //           title: '提示',
    //           content: res.data.message,
    //           showCancel:false,
    //           confirmColor:"#0081ff",
    //           success (res) {
    //           }
    //         })
    //       }
    //     }else{
    //       wx.showToast({
    //         title: '获取项目信息失败',
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
  getProjectWaterMark:function(projectId,requestUrl,terminalUserId,bgColor,fontSize) {
    var that = this;
    // wx.showLoading({
    //   title: '数据加载中',
    //   mask: true
    // })
    // var requestUrl = that.data.requestUrl; //服务器路径
    //console.log("requestUrl:",requestUrl);
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldProject/getProjectWaterMarkById',
      {
        projectId: projectId
      },
      app.seesionId,
      (res) =>{
        wx.hideLoading();
        if (res.data.status ==="success") {
          var waterMark = res.data.retObj
          var waterMarkObj = {};
          // console.log(waterMark)
          //若没有实体  则设置成水印未开启
          if(typeof(waterMark) == 'undefined'){
            waterMarkObj.isWatermark = 0
          }else{
            //如果有实体则 设置实体
            waterMarkObj = waterMark
          }
          app.projectWaterMark_map.set(projectId,waterMarkObj)
          wx.navigateTo({
            url:"../field_operation_tips/field_operation_tips?projectId=" + projectId +
              "&requestUrl=" + requestUrl + "&terminalUserId=" + terminalUserId + "&bgColor=" + bgColor
              + "&fontSize=" + fontSize
          })
          // console.log(waterMarkObj)
          // console.log(app.projectWaterMark_map.get(projectId))
        } else {
          wx.showModal({
              title: '提示',
              content: "获取项目水印设置信息失败",
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
  },
  changeData: function() {
    // var options = {'id':this.data.id}
    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})