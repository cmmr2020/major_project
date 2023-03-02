const app = getApp();
var requestUrl=app.globalData.requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl:'',
    type:'',
    projectId:'',
    departmentIds:'',
    quotaIds:'',
    pointIds:'',
    pName:'',
    quotaType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    wx.setNavigationBarTitle({
      title: options.projectName+'统计报表',
    })
    let that = this
    that.setData({
      requestUrl:requestUrl,
      type:options.reportType,
      projectId:options.projectId,
      departmentIds:options.deptIds,
      quotaIds:'',
      pointIds:options.pointIds,
      pName:options.projectName,
      quotaType:options.quotaTypeIds
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