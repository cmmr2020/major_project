// startDiaochaPackage/pages/startDiaocha/door_head_photo/door_head_photo.js
//获取应用实例
const app = getApp()
var requestUrl = app.globalData.requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //后台资源数量
    realDoorHeadLength:0,
    reportlength:0,
    fontSize:'',
    fontSize28:parseInt(wx.getStorageSync('fontSize'))-4,
    bgColor:wx.getStorageSync('bgColor'),
    bgColorUi:wx.getStorageSync('bgColorUi'),
    imgMapList:[],
    locationId:'',
    projectId:'',
    terminalUserId:''
  },

  ChooseImage(e) {
    var that = this;
    var index = that.data.imgMapList.length
    // console.log("之前的定位：",that.data.address);
    wx.chooseImage({
      count: 5, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera','album'], //album从相册选择 camera//相机
      mediaType:['image'],
      success: (res) => {
        var img = res.tempFilePaths; //数组
        //选取的资源 id属性为' '
        for(let i=0; i<img.length; i++){
          let imgInfo = {'index':index+i,'img_url':img[i],'img_desc':'','id':''}
          that.data.imgMapList.push(imgInfo)
        }
        that.setData({
          imgMapList:that.data.imgMapList
        })
        //console.log(that.data.imgMapList)
      }
    });
  },
  DelImg(e) {
    //console.log(e)
    var that = this;
    wx.showModal({
      content: '确定要删除这条图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          let objIndex =  e.currentTarget.dataset.index
          let list = that.data.imgMapList;
          let door_head_id = e.currentTarget.dataset.id
          //删除资源
          if(door_head_id != ''){
            //调用全局 请求方法
            app.wxRequest(
              'GET',
              requestUrl + '/wechat/api/fieldResource/deleteDoorHead',
              {
                'id':door_head_id
              },
              app.seesionId,
              (res) =>{
                //console.log(res)
                that.data.realDoorHeadLength = that.data.realDoorHeadLength-1
                if (res.data.status == 'success') {
                  that.data.imgMapList.splice(objIndex,1);
                    for(let i=0 ; i<list.length; i++){
                      list[i].index = i
                    }
                    that.data.imgMapList = list
                    that.setData({
                      imgMapList : that.data.imgMapList
                    })
                    wx.showToast({
                      title: '操作成功',
                      icon: 'none',
                      duration: 1000,
                      mask: true
                    })
                }else{
                  wx.showToast({
                    title: '操作失败',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                }
              },
              (err) =>{

              }
            )
          }else{
            //页面删除
            that.data.imgMapList.splice(objIndex,1);
            for(let i=0 ; i<list.length; i++){
              list[i].index = i
            }
            that.data.imgMapList = list
            that.setData({
              imgMapList : that.data.imgMapList
            })
            wx.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }
      }
    })
  },
   saveDesc: function(e){
    //console.log(e)
    let that = this;
    let objIndex =  e.currentTarget.dataset.index
    let mapLists = that.data.imgMapList
    if(mapLists.length>0){
      for(let i=0; i<mapLists.length; i++){
        let map = mapLists[i];
        // console.log(map)
          if(map.index === objIndex){
            map.img_desc = e.detail.value
            that.data.imgMapList[objIndex] = map;
            that.setData({
              imgMapList:that.data.imgMapList
           })
          //  console.log(that.data.imgMapList)
        }
      }
    }

  },
  ViewImageForreport(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    wx.previewMedia({
      sources : [{
        url : e.currentTarget.dataset.url,
        type : 'image'
      }]
    })
    // wx.previewImage({
    //   urls: this.data.imgList,
    //   current: e.currentTarget.dataset.url
    // });
  },
  //提交按钮
  submit: async function() {
    var that = this;
    var uploadLists = that.data.imgMapList;
    //为拍摄资源 不允许提交
    if(uploadLists.length<1){
      wx.showToast({
        title: '请拍摄举报图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
      // console.log("length:", length, "descLength:", descLength)

    for (var i = 0; i < uploadLists.length; i++) {
      if(uploadLists[i].id != ''){
        //修改图片描述
        await that.updateDoorHeadDesc(uploadLists[i],i+1,uploadLists.length).then((res) => {
        })
      }else{
        //上传举报图片
        await that.uploadImage(uploadLists[i],i+1,uploadLists.length).then((res) => {
        })
      }    
    }
    wx.showToast({
      title: '提交成功',
      icon: 'none',
      duration: 3000,
      mask: true,
      success : function(){
        wx.hideLoading();
        wx.navigateBack();
      }
    })
    
    // 清空资源列表
    // that.setData({
    //   imgMapList: []
    // })
  },
    updateDoorHeadDesc(fileInfo,i,length){
      var that = this;
      wx.showLoading({
        title: '正在上传 '+i+'/'+length,
        mask: true
      })
      return new Promise((resolve, reject) => {
        //调用全局 请求方法
        app.wxRequest(
          'GET',
          requestUrl + '/wechat/api/fieldResource/updateDoorHeadDesc',
          {
            'projectId': that.data.projectId,
            'locationId': that.data.locationId,
            'terminalUserId': that.data.terminalUserId,
            'desc': fileInfo.img_desc,
            'id':fileInfo.id
          },
          app.seesionId,
          (res) =>{
            console.log(res)
            if (res.data.status == 'success') {
              resolve(res.data)
            }else{
              wx.showToast({
                title: '数据更新失败',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          },
          (err) =>{

          }
        )
      })  
    }
  ,
    //举报图片集合
    uploadImage: function(fileInfo,i,length) {
      var that = this;
      wx.showLoading({
        title: '正在上传 '+i+'/'+length,
        mask: true
      })
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: requestUrl + '/wechat/api/fieldResource/uploadByDoorHead',
          // url: 'http://192.168.5.105:8088/wechat/api/fieldResource/upload',
          filePath: fileInfo.img_url,
          name: 'door_head_img' + fileInfo.index + that.data.terminalUserId,
          formData: {
            'key': 'door_head_img' + fileInfo.index + that.data.terminalUserId,
            'projectId': that.data.projectId,
            'locationId': that.data.locationId,
            'terminalUserId': that.data.terminalUserId,
            'desc': fileInfo.img_desc,
          },
          success(res) {
            //console.log("后台返回的图片数据：", res)
            that.data.realDoorHeadLength = that.data.realDoorHeadLength+1
            var data = JSON.parse(res.data);
            if (data.status == 'success') {
              resolve(res.data)
            } else {
              wx.showToast({
                title: '门头照图片上传失败',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          },
          //请求失败
          fail: function(err) {
            wx.showToast({
              title: '门头照图片上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          },
        }) 
     })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    //console.log(app.terminalUserId)
    this.setData({
      locationId : options.locationId,
      projectId : options.projectId,
      terminalUserId : app.terminalUserId
    })
    wx.setNavigationBarTitle({
      title: options.locationName,
    })
    this.initDoorHeadPage()
  },
  initDoorHeadPage(){
    let that = this
    //console.log(that.data.terminalUserId)
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/api/fieldLocation/findDoorHeadInfo',
      {
        locationId: that.data.locationId,
        projectId: that.data.projectId,
        terminalUserId: that.data.terminalUserId
      },
      app.seesionId,
      (res) =>{
        console.log(res)
        if (res.data.status == 'success') {
          let resList = res.data.retObj
          for(let i=0; i<resList.length; i++){
            let res = resList[i]
            //上传过的资源含有 id属性
            let imgInfo = {'index':i,'img_url':res.url,'img_desc':res.description,'id':res.id}
            that.data.imgMapList.push(imgInfo)
          }
          that.data.realDoorHeadLength = resList.length
          that.setData({
            imgMapList: that.data.imgMapList,
          })

        } else {

        }

      },
      (err) =>{

      }
    )
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
  onUnload: function() {
    let that = this
    var pages = getCurrentPages(); //当前页面栈
    //console.log(that.data.realDoorHeadLength)
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
       beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
        isHaveDoorHead: that.data.realDoorHeadLength<1?0:1
       })
   }
  }
})