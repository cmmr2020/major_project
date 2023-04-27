//资源上传页面
//腾讯地图js
const QQMapWX = require('../../../../libs/qqmap-wx-jssdk.min.js');
//倒计时js
const util = require('../../../../utils/util_time.js');
//同步js 
import regeneratorRuntime, { async } from '../../../../libs/regenerator-runtime/runtime.js';
let qqmapsdk;
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
var media_map;//资源对象集合 key= 操作提示id  value 为资源对象 {url,adds,desc}
Page({
  data: {
    requestUrl: '', //服务器路径
    //地图变量
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    // key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    key: 'ZI6BZ-MS2WF-ODSJP-NHDBT-TPBNH-KLB4G', //腾讯地图后台配置
    tipsId: null,
    idModelShow: '1',
    isShow: 1,
    modalHidden: true,
    isshow_modalInput:true,
    ishide_scroll:false,
    log: {},
    terminalUserId: '', //调查员id
    projectId: '', //项目id
    dabiaoOption: '', //达标按钮的id
    Nowdata: '', //点击选项的当前时间
    modalName: null,
    fontSize: '',
    fontSize28: '',
    fontSize30: '',
    bgColor: '',
    bgColorUi: '',
    disabled: false,
    modalName: '',//复制图片 模糊层
    isPhoto: '',
    imgsrc: '', //水印用
    canvas: null,//水印用
    canvasWidth: 0,//组件宽
    canvasHeight: 0,//组件高
    ctx: null,//水印用
    projectWaterMark: {},//水印属性同实体
    isWaterMark: 0,//是否添加水印
    logo_img_objec: null,//水印图片对象
    logo_img_info: null,//水印图片对象信息
    isOptionOn: 1,//是否隐藏答案选择框   0不显示  1显示
    selectPhoto_type_arr: [], //选取照片类型 ['camera','album'] 相机/相册
    showMediaList: new Array(), //展示图片用的数组集合
    location_list: [],//点位列表
    location_size: 0,//点位数量  用来控制切换按钮是否显示
    show_location_id: '',//当前显示的点位id  控制tag标签显示
    location_info: '',//点位信息
    location_operationTips_list: [],//点位操作提示list
    operationTips_resource_num_list: [],//每个操作提示的资源数量集合 与页面index对应
    unfinsh_location_num: 0,//未完成的点位数量  用于点位提交之后 判定页面动作
    myscroll:'',//视图组件
    is_submiting:0,//0 否  1是
    current_res_desc:'',//当前显示的资源描述
    current_res_id:'',//当前显示的资源描述
    current_res_index:'',//当前显示的资源描述
    current_res_tipid:'',//当前显示的资源描述
  },
  // 在页面初次渲染完成生命周期获取操作canvas的上下文对象
  onReady() {
    var that = this;
    if (that.data.isWaterMark == 1) {
      const query = wx.createSelectorQuery().in(this)
      query.select('#mycanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log(res)
          if (!res[0].node) {
            query.select('#mycanvas')
              .fields({ node: true, size: true })
              .exec((res2) => {
                res = res2;
              })
          }
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          this.setData({ canvas, ctx })
          if (that.data.projectWaterMark.isLogo == 1) {// 将图片绘制到canvas上
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
                  wx.getImageInfo({ src: res.tempFilePath }).then((res) => {
                    that.data.logo_img_info = res;
                  })
                }
              }
            })
          }
        })
    }
  },
  // 添加水印方法 (传入图片地址)
  addWatermark(tempFilePath, address) {
    var that = this;
    var watermark = that.data.projectWaterMark;
    return new Promise(async (resolve, reject) => {
      // 获取图片信息
      const imgInfo = await wx.getImageInfo({ src: tempFilePath })
      that.setData({
        canvasHeight: imgInfo.height,
        canvasWidth: imgInfo.width
      })
      // 1 竖拍  0横拍  用于设置水印文字大小
      var img_orientation = imgInfo.width / imgInfo.height > 1 ? 0 : 1
      const point_name = that.data.pointName;
      const pointType_name = that.data.pointTypeName;
      const time = watermark.timeFormat.length > 15 ? util.getNowTime() : util.getNowTime2();
      const address = that.data.address;
      const desc = watermark.watermarkText;
      const font_color = watermark.fontColor
      var logoImg = watermark.watermarkLogoUrl;
      if (!font_color) {
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
      if (watermark.isPointTypeName == 1) {
        textList.push('点位类型：' + pointType_name)
        textList.push('点位名称：' + point_name)
      }
      if (watermark.isTime == 1) {
        textList.push('时       间：' + time)
      }
      if (watermark.isAddress == 1) {
        textList.push('地      点：' + address)
      }
      if (watermark.isTxt == 1) {
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
        if (watermark.isLogo == 1) {
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
          if (imgBili < visibleBili) {
            let newW = (imgH / visibleH) * visibleW
            const bili = newW / visibleW
            visibleX = Math.abs(imgW - newW) / 2 / bili
            visibleY = 0
            visibleW = imgW * visibleH / imgH;
          } else {
            visibleX = 0
            let newH = (imgW * visibleH) / visibleW
            const bili = newH / visibleH
            visibleY = Math.abs(imgH - newH) / 2 / bili
            visibleH = visibleW * imgH / imgW
          }
          that.data.ctx.drawImage(that.data.logo_img_objec, visibleX, visibleY, visibleW, visibleH, imgX, imgY, imgW, imgH)

          //drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          //that.data.ctx.drawImage(that.data.logo_img_objec,1000,1000,1000,1000, 0, 0, imgInfo.width, imgInfo.height)
          //that.data.ctx.drawImage(that.data.logo_img_objec, 0, 0, imgInfo.width*0.3, imgInfo.height*0.3)
        }
        // 设置文字字号及字体 // 0 横拍  1竖拍  用于设置水印文字大小
        var line_spacing; //行间距  图片 高的乘数  
        if (img_orientation == 0) {
          line_spacing = 0.08
          that.data.ctx.font = imgInfo.width * 0.04 + 'px sans-serif'
        } else {
          line_spacing = 0.04
          that.data.ctx.font = imgInfo.width * 0.04 + 'px sans-serif'
        }
        // 设置画笔颜色
        that.data.ctx.fillStyle = font_color;
        //设置透明度
        that.data.ctx.globalAlpha = watermark.alpha / 10
        // 填入文字  文本,绘制文本的左上角 x 坐标位置,绘制文本的左上角 y 坐标位置,需要绘制的最大宽度，可选
        //从下到上 每次高度 减少 imgInfo.height * 0.08(减少值)
        var count = 0
        for (var i = textList.length; i >= 1; i--) {
          that.data.ctx.fillText(textList[i - 1], imgInfo.width * 0.01, imgInfo.height * (0.99 - count * line_spacing), imgInfo.width * 0.9)
          count++
        }
        // this.data.ctx.fillText('3.品名: 巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡', imgInfo.width*0.05, imgInfo.height*0.9,imgInfo.width*0.9)
        // this.data.ctx.fillText('2.单价: 20元', imgInfo.width*0.05, imgInfo.height*0.82,imgInfo.width*0.9)
        // this.data.ctx.fillText('1.品名: 巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡', imgInfo.width*0.05, imgInfo.height*0.74,imgInfo.width*0.9)
        //console.log(that.data.ctx.drawImage)
        // 将canvas转为为图片
        // wx.canvasToTempFilePath({
        //   canvas: that.data.canvas,
        //   //canvasId:'mycanvas',
        //   width:imgInfo.width,
        //   height:imgInfo.height,
        //   destWidth:imgInfo.width * app.data.pixelRatio,
        //   destHeight:imgInfo.height * app.data.pixelRatio,
        //   fileType:'jpg',
        //   quality:1,
        //   success: (res) => {
        //     wx.getImageInfo({ src: res.tempFilePath }).then((res) => {
        //       console.log('加完水印的')
        //       console.log(res)
        //      })
        //     resolve(res.tempFilePath)
        //     //return res.tempFilePath
        //     //this.setData({ imgsrc: res.tempFilePath})
        //     wx.hideLoading();
        //   },
        // })
        var str = that.data.canvas.toDataURL('jpg', 1);
        str = str.slice(str.indexOf(',') + 1).trim()
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
            if (res.errMsg == 'writeFile:ok') {
              resolve(codeimg)
            }
          }
        });
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    var scrollView
    wx.createSelectorQuery()
    .select('#myscroll')
    .node()
    .exec((res) => {
      scrollView = res[0].node;
      //scrollView.scrollTo(0)
      //scrollView.scrollEnabled = false;
      that.setData({
          myscroll:scrollView
      })
    })
    that.setData({
      projectId: options.projectId,
      surveyorId: options.terminalUserId,
      requestUrl: options.requestUrl,
      bgColor: options.bgColor,
      fontSize: options.fontSize,
      fontSize30: parseInt(options.fontSize) - 2,
    })
    qqmapsdk = new QQMapWX({
      key: that.data.key
    });
    that.currentLocation();
    that.setData({
      projectWaterMark: app.projectWaterMark_map.get(options.projectId),
      isWaterMark: app.projectWaterMark_map.get(options.projectId).isWatermark
    })
    that.getOperationTipsLocationList(options.projectId, options.terminalUserId, 1);
  },
  goTop:function(){
    this.data.myscroll.scrollTo(0)
  },
  /**
   ***********************************问题描述和问题选项**************************************
   */
  /**
   * type 是否查询第一个点位下的数据  0 否  1 是
   */
  getOperationTipsLocationList: function (projectId, surveyorId, type) {
    var that = this;
    var requestUrl = that.data.requestUrl
    that.setData({//情况展示集合数据
      showMediaList: [],
      location_list: []
    })
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/FieldOperationTips/getFieldOperationTipsLocationList',
      {
        terminalUserId: surveyorId,
        projectId: projectId
      },
      app.seesionId,
      (res) => {
        console.log('点位列表')
        console.log(res)
        if (res.data.status == 'success') {
          if (res.data.retObj) {
            if (type == 1) {
              that.getOperationTipsLocationInfoList(projectId, surveyorId, res.data.retObj[0].id)
            }
            that.setData({
              location_list: res.data.retObj,
              location_size: res.data.retObj.length,
              show_location_id: res.data.retObj[0].id,
              unfinsh_location_num: res.data.retObj.length
            })
          }else{
            that.setData({
              unfinsh_location_num:0
            })
            //从项目列表进入
            if(type == 1){
              wx.showModal({
                title: '提示',
                content: '您的账号未关联任何实地测评点位。',
                showCancel: false,
                confirmText: '知道了',
                success(res) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            }
          }
        }
      },
      (err) => {

      }
    )
  },
  getOperationTipsLocationInfoList: function (projectId, surveyorId, locationId) {
    media_map = new Map();
    var that = this;
    var requestUrl = that.data.requestUrl
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + '/wechat/FieldOperationTips/getLocationFieldOperationTipsList',
      {
        terminalUserId: surveyorId,
        projectId: projectId,
        locationId: locationId
      },
      app.seesionId,
      async (res) => {
        console.log('点位信息')
        console.log(res)
        if (res.data.status == 'success') {
          //释放资源  删除添加水印的临时文件
          app.removeLocalFile(app.globalData.waterMark_file_base_path)
          if (res.data.retObj) {
            var operationTips_list = res.data.retObj.fieldOperationTipsListVo
            var operationTips_resource_num_list = [];
            for (let i = 0; i < operationTips_list.length; i++) {
              var resouceList = operationTips_list[i].fieldOperationTipsAnswerVo.fieldOperationTipsResourcesList
              if (resouceList && resouceList.length > 0) {
                //记录当前操作提示已有的资源数量
                operationTips_resource_num_list.push(resouceList.length)
                var tipId = operationTips_list[i].fieldOperationTips.id
                for (let j = 0; j < resouceList.length; j++) {
                  wx.showLoading({
                    title: '正在加载：' + (i + 1) + '-' + (j + 1),
                    mask: true
                  });
                  var resouce = resouceList[j]
                  await that.downlodaResource(resouceList[j].url.replaceAll('http:','https:'), resouce, tipId).then((res) => {
                  })
                }
              } else {
                operationTips_resource_num_list.push(0)
              }
            }
            //console.log(operationTips_resource_num_list)
            that.setData({
              location_info: res.data.retObj.fieldLocation,
              location_operationTips_list: res.data.retObj.fieldOperationTipsListVo,
              operationTips_resource_num_list: operationTips_resource_num_list
            })
            wx.hideLoading()
          }
        }
      },
      (err) => {

      }
    )
  },
  //切换点位
  selectOperationTipsLocationInfoList: function (e) {
    var that = this;
    var locationId = e.currentTarget.dataset.locationid;
    that.setData({
      show_location_id: locationId,
      modalName: null,
      showMediaList: [],
      ishide_scroll:false
    })
    that.getOperationTipsLocationInfoList(that.data.projectId, that.data.surveyorId, locationId)
  },
  /**
   ***********************************下载资源**************************************
   */
  downlodaResource: function (filePath, resouce, tipId) {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            var mediaObj;
            var description = resouce.description;
            var resourceRemark = resouce.resourceRemark
            if (typeof (resouce.description) == 'undefined' || resouce.description == 'undefined' || resouce.description == '') {
              description = '';
            }
            if (typeof (resouce.resourceRemark) == 'undefined' || resouce.resourceRemark == 'undefined' || resouce.resourceRemark == '') {
              resourceRemark = '';
            }
            if (resouce.type == 2) {
              mediaObj = { id: resouce.id, url: res.tempFilePath, desc: description, resourceRemark: resourceRemark, adds: resouce.address, type: resouce.type, resourceStatus: resouce.resourceStatus, poster: res.tempFilePath };
            } else {
              mediaObj = { id: resouce.id, url: res.tempFilePath, desc: description, resourceRemark: resourceRemark, adds: resouce.address, type: resouce.type, resourceStatus: resouce.resourceStatus };
            }
            //console.log(mediaObj)
            //var mediaObj = {id:'',url:res.tempFilePath, desc:'', adds:address,type:res_type,poster:res.thumbTempFilePath};
            that.handMediaList(mediaObj, tipId)
            resolve(res.tempFilePath)
          }
        }
      })
    })
  },
  /**
   ***********************************地图**************************************
   */
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是cover-image指定的位置
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.setData({
        address: "正在获取地址..."
      })
      this.mapCtx = wx.createMapContext("maps");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          //console.log(res)
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          this.getAddress(res.longitude, res.latitude);
        }
      })
    }
  },
  getAddress: function (lng, lat) {
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

  /**
   ***********************************录音**************************************
   */
  //提示
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },

  goSetting() {
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },
  /**
   ***********************************倒计时**************************************
   */
  updateTimer: function () {
    var that = this;
    let log = that.data.log
    let now = Date.now()
    let remainingTime = Math.round((now - log.endTime) / 1000)
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    if (remainingTime > 58) {
      wx.setKeepScreenOn({
        keepScreenOn: false
      })
      that.stopTimer()
      recorderManager.stop();
      that.data.isRecord = false;
      that.setData({
        buttonTxt: '开始录音'
      });
      return
    } else {
      let remainTimeText = M + ":" + S;
      let remainTime = S;
      that.setData({
        remainTimeText: remainTimeText,
        remainTime: remainTime
      })
    }
  },
  stopTimer: function () {
    this.timer && clearInterval(this.timer)
    this.setData({
      isRuning: false,
      remainTimeText: '00:00',
    })
  },
  startTimer: function (e) {
    let that = this;
    let isRuning = that.data.isRuning
    let startTime = Date.now()
    if (!isRuning) {
      that.timer = setInterval((function () {
        that.updateTimer()
      }).bind(that), 1000)
    } else {
      that.stopTimer()
    }
    that.setData({
      isRuning: !isRuning,
      remainTimeText: '00:00',
    })
    that.data.log = {
      endTime: startTime
    }
    that.saveLog(that.data.log)
  },
  saveLog: function (log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  },
  /**
   **********************************资源描述框**************************************
   */
  //弹出模态框
  showDescModel: function(e) {
    var that = this;
    //console.log(e)
    var desc = e.currentTarget.dataset.info;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var tipid = e.currentTarget.dataset.tipid;
    if(id==''||index < 0||tipid==''){
      wx.showModal({
        title: '提示',
        content: '参数错误!请截图,并联系管理员。{id:'+id+',index:'+index+',tipid:'+tipid+'}',
        showCancel: false,
      })
      return
    }
    that.setData({
      isshow_modalInput: false,
      current_res_desc:desc,//当前显示的资源描述
      current_res_id:id,//当前显示的资源描述
      current_res_index:index,//当前显示的资源描述
      current_res_tipid:tipid,//当前显示的资源描述
    })
  },
    //取消
  cancel: function() {
    var that = this;
    that.setData({
      isshow_modalInput: true,
      current_res_desc:'',//当前显示的资源描述
      current_res_id:'',//当前显示的资源描述
      current_res_index:'',//当前显示的资源描述
      current_res_tipid:'',//当前显示的资源描述
    })
  },
  //模态框 当键盘输入时
  desc_input: function(e) {
    var that = this;
    that.setData({
      current_res_desc:e.detail.value,//当前显示的资源描述
    })
  },

  sub_desc() {
    let that = this;
    var resId = that.data.current_res_id
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      that.data.requestUrl + '/wechat/FieldOperationTips/updateFieldOperationTipsResource',
      {
        terminalUserId: that.data.surveyorId,
        desc: that.data.current_res_desc,
        resourceId: resId
      },
      app.seesionId,
      (res) => {
        if (res.data.status == 'success') {
          var tip_img_id = that.data.current_res_tipid
          var img_obj_index = that.data.current_res_index
          var imgObjList = media_map.get(tip_img_id)
          if (imgObjList.length > 0) {
            var img_obj = imgObjList[img_obj_index]
            img_obj.desc = that.data.current_res_desc
            media_map.set(tip_img_id, imgObjList)
            that.setData({
              showMediaList: Array.from(media_map)
            })
          }
          that.setData({
            isshow_modalInput: true,
            current_res_desc:'',//当前显示的资源描述
            current_res_id:'',//当前显示的资源描述
            current_res_index:'',//当前显示的资源描述
            current_res_tipid:'',//当前显示的资源描述
          })
        } else {
          that.tip('操作失败')
        }
      })
  },
  /**
   ***********************************模态框**************************************
   */
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      ishide_scroll:true
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      ishide_scroll:false
    })
  },
  showInfo(e){
    var type = e.currentTarget.dataset.type
    var msg = "";
    var title = ""
    if(type == "1"){// 1 点位名称 
      msg = this.data.location_info.name
      title = "点位名称"
    }else{// 2 定位信息
      msg = this.data.address
      title = "定位信息"
    }
    if(msg){
      wx.showModal({
        title: title,
        content: msg,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },
  async ChooseImage(e) {
    var that = this;
    //console.log(that.data.isWaterMark)
    // console.log(that.data.projectWaterMark)
    // console.log("之前的定位：",that.data.address);
    //所有资源保存的集合
    //操作提示id
    var tipsId = e.currentTarget.dataset.tipid
    var res_type = e.currentTarget.dataset.type
    var locationId = e.currentTarget.dataset.locationid
    var operationTipsIndex = e.currentTarget.dataset.operationtipsindex;
    //如果存在答案id 则新增资源,不创建答案
    var answerId = typeof (e.currentTarget.dataset.answerid) == 'undefined' ? '' : e.currentTarget.dataset.answerid;
    //console.log(answerId)
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'],//that.data.selectPhoto_type_arr, //album从相册选择 camera//相机
      success: (res) => {
        that.currentLocation();
        var address = that.data.address;
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
        // imagAddressList.push({
        //   address: address,
        //   latitude: latitude,
        //   longitude: longitude
        // });
        var img_list = res.tempFilePaths; //数组
        if (that.data.isWaterMark == '1') {
          this.addWatermarkByArr(img_list, address).then((res) => {
            //img = res
            var mediaObj = { id: '', url: res[0], desc: '', adds: address, type: res_type };
            that.uploadResource(answerId, locationId, tipsId, img_list[0], res_type, mediaObj, operationTipsIndex)
          })
        } else {
          var mediaObj = { id: '', url: img_list[0], desc: '', adds: address, type: res_type };
          that.uploadResource(answerId, locationId, tipsId, img_list[0], res_type, mediaObj, operationTipsIndex)
        }
      }
    });
  },
  addWatermarkByArr(imgArr, address) {
    return new Promise(async (resolve, reject) => {
      wx.showLoading({
        title: '添加水印中'
      });
      for (let i = 0; i < imgArr.length; i++) {
        await this.addWatermark(imgArr[i], address).then((res) => {
          imgArr[i] = res
        })
      }
      console.log(imgArr)
      resolve(imgArr);
      wx.hideLoading();
    })
  },
  chooseVideo(e) {
    //console.log(e)
    let that = this;
    var tipsId = e.currentTarget.dataset.tipid
    var res_type = e.currentTarget.dataset.type
    var locationId = e.currentTarget.dataset.locationid;
    var operationTipsIndex = e.currentTarget.dataset.operationtipsindex;
    //如果存在答案id 则新增资源,不创建答案
    var answerId = typeof (e.currentTarget.dataset.answerid) == 'undefined' ? '' : e.currentTarget.dataset.answerid;
    //console.log(answerId)
    //因为上传视频返回的数据类型与图片不一样  需要建缩略图的url放到数组中
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        //console.log(res)
        that.currentLocation();
        var address = that.data.address;
        // console.log("之后的定位：",address);
        // console.log("视频的大小：", size / 1024 / 1024 + "M")
        //初始化当前选择图片的集合对象
        var mediaObj = { id: '', url: res.tempFilePath, desc: '', adds: address, type: res_type, poster: res.thumbTempFilePath };
        that.uploadResource(answerId, locationId, tipsId, res.tempFilePath, res_type, mediaObj, operationTipsIndex)
      }
    })
  },
  handMediaList(mediaObj, tipsId) {
    var that = this;
    var mediaList = new Array();
    mediaList.push(mediaObj)
    //判断全局map中是否已保存当前操作提示的图片资源
    if (!media_map.has(tipsId)) {
      media_map.set(tipsId, mediaList)
    } else {
      var old_mediaList = media_map.get(tipsId)
      var new_mediaList = old_mediaList.concat(mediaList)
      media_map.set(tipsId, new_mediaList)
    }
    that.setData({
      showMediaList: Array.from(media_map)
    })
    //console.log(that.data.showMediaList)
  },
  ViewImageForreport(e) {
    // var index = e.currentTarget.dataset.index;
    wx.previewMedia({
      sources: [{ url: e.currentTarget.dataset.url, type: 'image' }],
    })
    // wx.previewImage({
    //   urls: this.data.imgList,
    //   current: e.currentTarget.dataset.url
    // });
  },
  ViewVideoForreport(e) {
    // wx.previewMedia({
    //   sources: [{url:e.currentTarget.dataset.url,type:'video'}],
    // })
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.url);
    this.VideoContext.requestFullScreen(0);
  },

  start(e) {
    let fullScreen = e.detail.fullScreen;
    if (!fullScreen) {
      this.VideoContext.pause();
    } else {
      this.VideoContext.play();
    }
  },
  delResource(e) {
    console.log(e)
    var that = this;
    var tipId = e.currentTarget.dataset.tipid;
    var index = e.currentTarget.dataset.index;
    var resId = e.currentTarget.dataset.id;
    var operationTipsIndex = e.currentTarget.dataset.operationtipsindex;
    console.log(operationTipsIndex)
    wx.showModal({
      content: '确定要删除这条图片/视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          //调用全局 请求方法
          app.wxRequest(
            'POST',
            that.data.requestUrl + '/wechat/FieldOperationTips/deleteResourceByFieldOperationTips',
            {
              id: resId
            },
            app.seesionId,
            (res) => {
              if (res.data.status == 'success') {
                var mediaList = media_map.get(tipId)
                if (mediaList.length > 0) {
                  //splice中第一个参数是删除的起始索引(从0算起),在此是数组第二个参数是删除元素的个数。
                  mediaList.splice(index, 1)
                  media_map.set(tipId, mediaList)
                  var operationTips_resource_num_list = that.data.operationTips_resource_num_list;
                  operationTips_resource_num_list[operationTipsIndex] = operationTips_resource_num_list[operationTipsIndex] - 1
                  that.setData({
                    showMediaList: Array.from(media_map),
                    operationTips_resource_num_list: operationTips_resource_num_list
                  })
                  //console.log(that.data.operationTips_resource_num_list)
                }
              } else {
                that.tip('操作失败')
              }
            })

        }
      }
    })
  },
  textareaAInput(e) {
    this.data.desc = e.detail.value;
  },

  //提交点位按钮
  submit: async function () {
    var that = this;
    //校验当前点位下  各操作提示照片数量是否达标
    //操作提示集合
    var location_operationTips_list = that.data.location_operationTips_list
    //各操作提示下拍摄的资源数量  通过下标对应
    var operationTips_resource_num_list = that.data.operationTips_resource_num_list
    //console.log(location_operationTips_list)
    //console.log(operationTips_resource_num_list)
    var msg = '';
    for (let i = 0; i < location_operationTips_list.length; i++) {
      var resourceNum = location_operationTips_list[i].fieldOperationTips.resourceNum
      if (operationTips_resource_num_list[i] < resourceNum) {
        //如果有操作要求未拍摄满 集中提示
        if (!msg) {
          msg += '操作提示： 序号 ' + (i + 1) + '、'
        } else {
          msg += '序号 ' + (i + 1) + '、'
        }
      }
    }
    if (msg) {
      msg = msg.substring(0, msg.length - 1)
      msg += ',等项,资源拍摄数量未达标。请检查、补拍后再重新提交。 谢谢！（不合格的资源，不计算在要求的数量中哦。）'
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }
    that.setData({
      is_submiting:1
    })
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      that.data.requestUrl + '/wechat/FieldOperationTips/updateCheckStatusByFieldOperationTips',
      {
        terminalUserId: that.data.surveyorId,
        projectId: that.data.projectId,
        locationId: that.data.show_location_id
      },
      app.seesionId,
       (res) => {
        if (res.data.status == 'success') {
          var num = that.data.unfinsh_location_num - 1;
          //console.log('未完成的点位数量:'+num)
          //刷新点位列表
          that.getOperationTipsLocationList(that.data.projectId, that.data.surveyorId, 0)
          //释放资源  删除添加水印的临时文件
          app.removeLocalFile(app.globalData.waterMark_file_base_path)
          if (num > 0) {
            wx.showModal({
              title: '提示',
              content: '点位提交成功，请您继续测评其它未完成的点位。',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  //打开点位抽屉
                  that.setData({
                    modalName: 'viewModal',
                    ishide_scroll:true
                  })
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '您已完成全部点位，辛苦了~',
              showCancel: false,
              confirmText: '知道了',
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        } else {
          //console.log(res.data)
          if(res.data.message){
            that.tip(res.data.message)
          }else{
            that.tip('点位提交失败，请重试')
          }
        }
        that.setData({
          is_submiting:0
        })
      })
  },
  //上传资源 拍摄完即时上传 每次只上传一份资源
  uploadResource: function (answerId, locationId, fieldOperationTipsId, filePath, type, mediaObj, operationTipsIndex) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var terminalUserId = that.data.terminalUserId;
    var projectId = that.data.projectId;
    wx.uploadFile({
      url: requestUrl + '/wechat/FieldOperationTips/uploadByFieldOperationTips',
      filePath: filePath,
      name: terminalUserId + fieldOperationTipsId,
      formData: {
        'key': terminalUserId + fieldOperationTipsId,
        'type': type,
        'projectId': projectId,
        'locationId': locationId,
        'fieldOperationTipsId': fieldOperationTipsId,
      },
      success(res) {
        if (res.statusCode == 200) {
          var result = JSON.parse(res.data)
          //console.log(result)
          if (result.status == 'success') {
            var operationTips_resource_num_list = that.data.operationTips_resource_num_list;
            operationTips_resource_num_list[operationTipsIndex] = operationTips_resource_num_list[operationTipsIndex] + 1
            that.setData({
              operationTips_resource_num_list: operationTips_resource_num_list
            })
            if (answerId) {
              that.addAnswerResource(answerId, fieldOperationTipsId, type, result.url, result.delUrl, mediaObj)
            } else {
              that.uploadAnswerTrue(locationId, fieldOperationTipsId, type, result.url, result.delUrl, mediaObj)
            }
          }
        }
        // wx.showToast({
        //   title: '视频资源上传失败',
        //   icon: 'none',
        //   duration: 1000,
        //   mask: true,
        //   address: address,
        //   latitude: latitude,
        //   longitude: longitude
        // })
      },
      //请求失败
      fail: function (err) {
      },
      complete: () => {

      }

    })
  },
  // 资源上传成功，上传答案
  uploadAnswerTrue: function (locationId, fieldOperationTipsId, type, url, delUrl, mediaObj) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    // console.log("要上传的资源集合：", resourceList)
    // 调查员id
    var surveyorId = that.data.surveyorId;
    //经纬度
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    // 项目id
    var projectId = that.data.projectId;
    //地址
    var address = that.data.address;
    if (address === "正在获取地址...") {
      var address = '';
    }
    //点击选项的当前时间
    var answerTime = that.data.Nowdata;
    if (answerTime == '') {
      var answerTime = util.getNowTime();
    }
    var fieldAnswer = {
      surveyorId: surveyorId,
      locationId: locationId,
      operationTipsId: fieldOperationTipsId,
      longitude: longitude,
      latitude: latitude,
      projectId: projectId,
      address: address,
      answerTime: answerTime,
    };
    var resource = {
      operationTipsAnswerId: fieldOperationTipsId,
      url: 'https://' + url,
      delUrl: 'https://' + delUrl,
      type: type,
      status: 1,
      description: '',
      longitude: longitude,
      latitude: latitude,
      address: address,
    };
    //console.log("要上传的答案集合：", fieldAnswer)
    var firstQuestion = wx.getStorageSync("firstFieldOperationTips");
    // console.log("上传问题得firstQuestion", firstQuestion)
    if (!firstQuestion) {
      var beginTime = util.getNowTime();
      wx.setStorageSync("firstFieldOperationTips", 1);
    } else {
      var beginTime = '';
    }
    // console.log("问题时间：", answerTime),
    //   console.log("点位开始时间：", beginTime)
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      requestUrl + '/wechat/FieldOperationTips/saveFieldOperationTipsAnswer',
      {
        beginTime: beginTime,
        fieldAnswerStr: JSON.stringify(fieldAnswer),
        resourceStr: JSON.stringify(resource)
      },
      app.seesionId,
      (res) => {
        console.log(res)
        if (res.data.status == 'success') {
          mediaObj.id = res.data.retObj.resouceId
          mediaObj.delUrl = delUrl
          that.handMediaList(mediaObj, fieldOperationTipsId)
        } else {
          wx.showToast({
            title: '资源上传失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }

      },
      (err) => {
        wx.showToast({
          title: '资源上传失败',
          icon: 'none',
          duration: 1000,
          mask: true
        })

      }
    )
  },
  // 已有答案,增加资源
  addAnswerResource: function (answerId, fieldOperationTipsId, type, url, delUrl, mediaObj) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    // console.log("要上传的资源集合：", resourceList)
    //经纬度
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    //地址
    var address = that.data.address;
    if (address === "正在获取地址...") {
      var address = '';
    }
    var resource = {
      operationTipsAnswerId: fieldOperationTipsId,
      url: 'https://' + url,
      delUrl: 'https://' + delUrl,
      type: type,
      status: 1,
      description: '',
      longitude: longitude,
      latitude: latitude,
      address: address,
    };
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      requestUrl + '/wechat/FieldOperationTips/saveFieldOperationTipsResourceByAdd',
      {
        answerId: answerId,
        surveyorId: that.data.surveyorId,
        resourceStr: JSON.stringify(resource)
      },
      app.seesionId,
      (res) => {
        //console.log(res)
        if (res.data.status == 'success') {
          mediaObj.id = res.data.retObj.id
          mediaObj.delUrl = res.data.retObj.delUrl
          that.handMediaList(mediaObj, fieldOperationTipsId)
        } else {
          wx.showToast({
            title: '资源上传失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }

      },
      (err) => {
        wx.showToast({
          title: '资源上传失败',
          icon: 'none',
          duration: 1000,
          mask: true
        })

      }
    )
  },
})