// startDiaochaPackage/pages/startDiaocha/door_head_photo/door_head_photo.js
//腾讯地图js
const QQMapWX = require('../../../../libs/qqmap-wx-jssdk.min.js');
//倒计时js
const util = require('../../../../utils/util_time.js');
//获取应用实例
const app = getApp()
var requestUrl = app.globalData.requestUrl
let qqmapsdk;
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
    terminalUserId:'',
    key: 'ZI6BZ-MS2WF-ODSJP-NHDBT-TPBNH-KLB4G', //腾讯地图后台配置
    address:'',
    imgsrc: '', //水印用
    canvas: null,//水印用
    ctx: null,//水印用
    projectWaterMark: {},//水印属性同实体
    isWaterMark:null,//是否添加水印
    logo_img_objec:null,//水印图片对象
    logo_img_info:null,//水印图片对象信息
    selectPhoto_type_arr:[] //选取照片类型 ['camera','album'] 相机/相册
  },
  addWatermarkByArr(imgArr,address){
    return new Promise( async (resolve, reject) => {
      wx.showLoading({
        title:'添加水印中'
      });
      for(let i=0; i<imgArr.length; i++){
        await this.addWatermark(imgArr[i],address).then((res) => {
          imgArr[i] = res
        })
      }
      resolve(imgArr);
      wx.hideLoading();
    })
  },
      // 添加水印方法 (传入图片地址)
      addWatermark(tempFilePath,address) {
        console.log('进入主方法')
        var that = this;
        var watermark = that.data.projectWaterMark;
        return new Promise( async (resolve, reject) => {
            // 获取图片信息
            const imgInfo = await wx.getImageInfo({ src: tempFilePath })
            that.setData({
              canvasHeight : imgInfo.height,
              canvasWidth : imgInfo.width
            })
            //0 横拍  1竖拍  用于设置水印文字大小
            var img_orientation = imgInfo.width/imgInfo.height > 1 ? 0 : 1
            const point_name = that.data.pointName;
            const pointType_name = that.data.pointTypeName;
            const time = watermark.timeFormat.length > 15? util.getNowTime() : util.getNowTime2();
            const address = that.data.address;
            const desc = watermark.watermarkText;
            const font_color = watermark.fontColor
            var logoImg = watermark.watermarkLogoUrl;
            if(!font_color){
              font_color = 'bule'
            }
            // console.log(pointType_name)
            // console.log(point_name)
            // console.log(util.getNowTime())
            // console.log(util.getNowTime2())
            // console.log(address)
            // console.log(desc)
            // console.log(logoImg)
            var textList = [];
            if(watermark.isPointTypeName == 1){
              textList.push('点位类型：' + pointType_name)
              textList.push('点位名称：' + point_name)
            }
            if(watermark.isTime == 1){
              textList.push('时       间：' + time)
            }
            if(watermark.isAddress == 1){
              textList.push('地      点：' + address)
            }
            if(watermark.isTxt == 1){
              textList.push('描      述：' + desc)
            }
            // 设置canvas宽高
            that.data.canvas.width = imgInfo.width
            that.data.canvas.height = imgInfo.height
            // 创建一个图片对象
            const image = that.data.canvas.createImage();
            image.src = tempFilePath;
            image.onload = () => {
              that.data.ctx.drawImage(image, 0, 0, imgInfo.width, imgInfo.height)
              if(watermark.isLogo == 1){
                let imgW = imgInfo.width * 0.1 //图片在画布上的宽度
                let imgH = imgInfo.height * 0.1 //图片在画布上的高度
                let imgX = imgInfo.width - imgW; //图片在画布上的y轴坐标
                let imgY = imgInfo.height - imgH //图片在画布上的y轴坐标
                let visibleW = that.data.logo_img_info.width//截取的图片的宽度
                let visibleH = that.data.logo_img_info.height//截取的图片的高度
                let visibleX = null // 所截取的图片的x轴坐标
                let visibleY = null // 所截取的图片的y轴坐标
                let imgBili = imgW / imgH
                let visibleBili = visibleW / visibleH;
                if(imgBili < visibleBili){
                  let newW = (imgH / visibleH) * visibleW
                  const bili = newW / visibleW
                  visibleX = Math.abs(imgW - newW) / 2 / bili
                  visibleY = 0
                  visibleW = imgW * visibleH / imgH;
                }else{
                  visibleX = 0
                  let newH = (imgW * visibleH) / visibleW
                  const bili = newH / visibleH
                  visibleY = Math.abs(imgH - newH) /2 / bili
                  visibleH = visibleW * imgH / imgW
                }
                that.data.ctx.drawImage(that.data.logo_img_objec,visibleX,visibleY,visibleW,visibleH, imgX, imgY, imgW, imgH)
                //drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                //that.data.ctx.drawImage(that.data.logo_img_objec,1000,1000,1000,1000, 0, 0, imgInfo.width, imgInfo.height)
                //that.data.ctx.drawImage(that.data.logo_img_objec, 0, 0, imgInfo.width*0.3, imgInfo.height*0.3)
              }
              // 设置文字字号及字体 // 0 横拍  1竖拍  用于设置水印文字大小
              var line_spacing; //行间距  图片 高的乘数  
              if(img_orientation == 0){
                line_spacing = 0.08
                that.data.ctx.font = imgInfo.width*0.04 +'px sans-serif'
              }else{
                line_spacing = 0.04
                that.data.ctx.font = imgInfo.width*0.04 +'px sans-serif'
              }
              // 设置画笔颜色
              that.data.ctx.fillStyle = font_color;
              //设置透明度
              that.data.ctx.globalAlpha = watermark.alpha/10
              // 填入文字  文本,绘制文本的左上角 x 坐标位置,绘制文本的左上角 y 坐标位置,需要绘制的最大宽度，可选
              //从下到上 每次高度 减少 imgInfo.height * 0.08(减少值)
              var count = 0
              for(var i = textList.length; i>=1 ; i--){
                that.data.ctx.fillText(textList[i-1], imgInfo.width*0.01, imgInfo.height*(0.99 - count*line_spacing),imgInfo.width*0.9)
                count++
              }
              // this.data.ctx.fillText('3.品名: 巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡', imgInfo.width*0.05, imgInfo.height*0.9,imgInfo.width*0.9)
              // this.data.ctx.fillText('2.单价: 20元', imgInfo.width*0.05, imgInfo.height*0.82,imgInfo.width*0.9)
              // this.data.ctx.fillText('1.品名: 巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡', imgInfo.width*0.05, imgInfo.height*0.74,imgInfo.width*0.9)
              //console.log(that.data.ctx.drawImage)
              // 将canvas转为为图片
              // wx.canvasToTempFilePath({
              //   canvas: that.data.canvas,
              //   quality:1,
              //   success: (res) => {
              //    console.log('转换完成')
              //    wx.getImageInfo({
              //         src:res.tempFilePath,
              //         success: (res) => {
              //           console.log(res)  
              //         }
              //       })
              //     resolve(res.tempFilePath)
              //   },
              //   fail:(res) =>{
              //   console.log(res)
              //   }
              // })
              var str = that.data.canvas.toDataURL('png',1);
              str = str.slice(str.indexOf(',')+1).trim()
              /*code是指图片base64格式数据*/
              //声明文件系统
              const fs = wx.getFileSystemManager();
              //随机定义路径名称
              var times = new Date().getTime();
              var codeimg = app.globalData.waterMark_file_base_path + times + '.png';
              //将base64图片写入
              fs.writeFile({
                filePath: codeimg,
                data: str,
                encoding: 'base64', 
                success: (res) => {
                  //写入成功了的话，新的图片路径就能用了
                  if(res.errMsg == 'writeFile:ok'){
                    resolve(codeimg)
                  }
                },
                fail: (res) =>{
                }
              });
            }
        })
      },
  async ChooseImage(e) {
    var that = this;
    var index = that.data.imgMapList.length
    //console.log("之前的定位：",that.data.address);
     wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: that.data.selectPhoto_type_arr, //album从相册选择 camera//相机 ['camera','album']
      success: (res) => {
        var img = res.tempFilePaths; //数组
        if(that.data.isWaterMark == '1'){
          that.addWatermarkByArr(img,that.data.address).then((res) => {
            img = res
            //选取的资源 id属性为' '
            for(let i=0; i<img.length; i++){
              let imgInfo = {'index':index+i,'img_url':img[i],'img_desc':'','id':''}
              that.data.imgMapList.push(imgInfo)
            }
            that.setData({
              imgMapList:that.data.imgMapList
            })
          })
        }else{
          //选取的资源 id属性为' '
          for(let i=0; i<img.length; i++){
            let imgInfo = {'index':index+i,'img_url':img[i],'img_desc':'','id':''}
            that.data.imgMapList.push(imgInfo)
          }
          that.setData({
            imgMapList:that.data.imgMapList
          })
        }
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
    //console.log(e)
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
        //释放资源  删除添加水印的临时文件
        app.removeLocalFile(app.globalData.waterMark_file_base_path)
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
    var that = this;
    //console.log(app.terminalUserId)
    this.setData({
      locationId : options.locationId,
      projectId : options.projectId,
      terminalUserId : app.terminalUserId,
      pointName:options.locationName,
      pointTypeName:options.pointTypeName,
      projectWaterMark:app.projectWaterMark_map.get(options.projectId),
      isWaterMark:app.projectWaterMark_map.get(options.projectId).isWatermark,
      //选取照片类型 ['camera','album'] 相机/相册
      ////是否允许选取相册图片 0 不允许 1 允许
      selectPhoto_type_arr:app.project_isSelectPhoto_map.get(options.projectId) == 0? ['camera'] : ['camera','album']
    })
    wx.setNavigationBarTitle({
      title: options.locationName,
    })
    qqmapsdk = new QQMapWX({
      key: that.data.key
    });
    that.currentLocation();
    that.initDoorHeadPage()
  },
  onReady: function(){
    var that = this;
    if(that.data.isWaterMark == 1){
      const query = wx.createSelectorQuery().in(this)
      query.select('#Canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          this.setData({ canvas, ctx })
          if(that.data.projectWaterMark.isLogo == 1){// 将图片绘制到canvas上
            wx.downloadFile({
              url: 'https://' + that.data.projectWaterMark.watermarkLogoUrl,
              success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                  // 创建Logo图片对象
                  const image2 = that.data.canvas.createImage();
                  image2.src = res.tempFilePath;
                  image2.onload = () => {
                    that.data.logo_img_objec = image2;
                  }
                  wx.getImageInfo({ src: res.tempFilePath}).then((res) => {
                    that.data.logo_img_info = res;
                  })
                }
              }
            })
          }
        })
    }
  },
  currentLocation() {
    //当前位置
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
      }
    })
  },
  getAddress: function(lng, lat) {
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        // console.log(res)
        // console.log(res.result.formatted_addresses.recommend)
        this.setData({
          address: res.result.formatted_addresses.recommend //res.result.address
        })
      },
      fail: (res) => {
        this.setData({
          address: "获取位置信息失败（可继续调查）"
        })
      }
    })
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