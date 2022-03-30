const app = getApp();
var requestUrl=app.globalData.requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dept_report_list:[],
    dept_location_report_list:[],
    showDeptReport:false,
    showDeptLocationInfo:false,
    model_title_dept:'',
    model_title_dept_location:'',
    point_report_list:[],
    point_quota_report_list:[],
    showPointReport:false,
    showPointQuotaInfo:false,
    model_title_point:'',
    model_title_point_quota:'',
    projectId:'',
    quotaTypeIds:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    wx.setNavigationBarTitle({
      title: options.projectName+'统计报表',
    })
    let that = this;
    that.setData({
      projectId : options.projectId,
      quotaTypeIds:options.quotaTypeIds
    })
    that.initReportData(options);
  },
  initReportData(option){
    let that = this;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/private/largeScreenDisplay/renderDataForReportsForWechat',
      {
        projectId: option.projectId,
        type: option.reportType,
        departmentIds: option.deptIds,
        pointIds: option.pointIds,
        quotaType: option.quotaTypeIds
      },
      app.seesionId,
      (res) =>{
        if (res.data.message=='success') {
          console.log(res.data)
          if (res.data.reportVo.length > 1) {
            if(option.reportType==0){
              that.setData({
                dept_report_list:res.data.reportVo,
                showDeptReport:true,
                model_title_dept:'责任部门符合率统计表'
              })
            }else if(option.reportType==1){
              
            }else{
              that.setData({
                point_report_list:res.data.reportVo,
                showPointReport:true,
                model_title_point:'点位符合率统计表'
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
        }else{
          wx.showToast({
            title: '暂无数据',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,
          })
        }

      },
      (err) =>{
        wx.showToast({
          title: '网络错误',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    )
  },
  alertDeptInfo(e){
    let that = this;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/private/largeScreenDisplay/getDepartmentPointDataForReportsWechart',
      {
        projectId: that.data.projectId,
        departmentId: e.currentTarget.dataset.id,
        quotaType: that.data.quotaTypeIds
      },
      app.seesionId,
      (res) =>{
          if (res.data.length > 0) {
            that.setData({
              dept_location_report_list:res.data, 
              showDeptLocationInfo:true,
              model_title_dept_location:e.currentTarget.dataset.name
            })
          }else{
            wx.showToast({
              title: '暂无数据',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
      },
      (err) =>{
        wx.showToast({
          title: '网络错误',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    )
  },
  closeDept(){
    let that = this;
    that.setData({
      showDeptLocationInfo:false
    })
  },
  alertPointInfo(e){
    let that = this;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/private/largeScreenDisplay/getAllQuotaByPointIdWechart',
      {
        projectId: that.data.projectId,
        pointId: e.currentTarget.dataset.id,
        quotaType: that.data.quotaTypeIds
      },
      app.seesionId,
      (res) =>{
        console.log(res)
          if (res.data.data.length > 0) {
            that.setData({
              point_quota_report_list:res.data.data, 
              showPointQuotaInfo:true,
              model_title_point_quota:e.currentTarget.dataset.name
            })
          }else{
            wx.showToast({
              title: '暂无数据',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
      },
      (err) =>{
        wx.showToast({
          title: '网络错误',
          icon: 'none', // "success", "loading", "none"
          duration: 1500,
          mask: false,
        })
      }
    )
  },
  closePoint(){
    let that = this;
    that.setData({
      showPointQuotaInfo:false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})