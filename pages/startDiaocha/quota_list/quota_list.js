//四级、五级指标页面
var app = getApp();
// 引入跳转js
import router from '../../../utils/router.js';
Page({
  data: {
    requestUrl: '', //服务器路径                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    open: false,
    selected: [true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    pointId: '', //点位id
    pointTypeId: '', //点位类型id
    projectId: '',
    list: [],
    //拼装提示
    tips: '',
    // 指标id
    quotaId: '',
    listData: [],
    // 点位
    pointName: "",
    // 四级指标
    quotaName: "",
    // 提示id
    tipsId: null,
    // 设置一个变量判断手风琴点击的是正常点位还是问题分类 0--正常，1-问题分类
    variable: 0,
    //是否需要录音，0-不需要 1-需要
    isRecord: '',
    // 是否切换 1-问题分类查 0-指标查
    qiehuan: 1,
    userIndex: 0, //用户操作的行
    modalName:"viewModal",//默认抽屉打开
    isGrade:'',//是否打分
    fontSize:'',
    fontSize28:'',
    fontSize34:'',
    fontSize30:'',
    fontSize38:'',
    bgColor:'',
  },
    onShow: function() {
    var that = this;
    var variable = that.data.variable;
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // pointDetail页面传递过来的参数
    eventChannel.on('pointDetail', function(data) {
      that.setData({
        pointName: data.pointName,
        pointTypeId: data.pointTypeId,
        pointId: data.pointId,
        projectId:data.projectId,
        requestUrl:data.requestUrl,
        isGrade:data.isGrade,
        bgColor:data.bgColor,
        fontSize:data.fontSize,
        fontSize28:parseInt(data.fontSize)-4,
        fontSize30:parseInt(data.fontSize)-2,
        fontSize34:parseInt(data.fontSize)+2,
        fontSize38:parseInt(data.fontSize)+6,
      })
      // console.log("pointDetail传递参数", data)
      if(variable===0){
        that.getproblemList(data.pointTypeId,data.projectId, data.pointId);
      }else{
        that.getQuotaList(data.pointTypeId,data.pointId,data.projectId);
      }
    })
     if(variable===0){
        that.getproblemList(that.data.pointTypeId,that.data.projectId, that.data.pointId);
      }else{
        that.getQuotaList(that.data.pointTypeId,that.data.pointId,that.data.projectId);
      }
   
  },

  onLoad: function(e) {

  },
  // 获取指标列表
  getQuotaList(pointTypeId, locationId, projectId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var userIndex = that.data.userIndex;//用户操作的行
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/quota/getQuotaListByPointId',
      data: {
        pointId: pointTypeId,
        locationId: locationId,
        projectId: projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        // console.log('指标列表', res.data.retObj)
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          var pointTypeId = that.data.pointTypeId
          // console.log("指标分类userid：",userIndex)
          if(userIndex===0){
              let arr = [];
              let ayy = [];
              for (let i = 0; i < quotaList.length; i++) {
                if (i === 0) {
                  arr.push(quotaList[i].id),
                    ayy.push(quotaList[i].content)
                }
              }
              // 数组转字符得到第一个指标的id
              var arrtest = arr.join();
              var ayytest = ayy.join();
              // console.log("arrtest:",arrtest,"ayytest:",ayytest)
              that.setData({
                list: res.data.retObj,
                quotaName: ayytest
              })
              // 加载第一个指标下的问题
              that.getQuotaDetail(arrtest, pointTypeId);
          }else{
              let testx = [];
              let testy = [];
              for (let j = 0; j < quotaList.length; j++) {
                if (j === userIndex) {
                  testx.push(quotaList[j].id),
                    testy.push(quotaList[j].content)
                }
              }
              // 数组转字符得到第一个指标的id
              var testxx = testx.join();
              var testyy = testy.join();
              // console.log("testxx:",testxx,"testyy:",testyy)
              that.setData({
                list: res.data.retObj,
                quotaName: testyy
              })
              // 加载第一个指标下的问题
              that.getQuotaDetail(testxx, pointTypeId);
          }
        } else {
          wx.showToast({
            title: '获取指标列表失败',
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

  // 获取指标下的问题
  getQuotaDetail(quotaId, pointTypeId) {
    var that = this;
    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var requestUrl = that.data.requestUrl; //服务器路径
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuotaId',
      //  url: 'http://192.168.5.105:8088/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuotaId',
      data: {
        quotaId: quotaId,
        pointId: pointTypeId,
        projectId: projectId,
        locationId: pointId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {

        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          // console.log("指标下的详情111111：", quotaList)

          let arr = [];
          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
            if (quotaList[i].type === 2) {
              arr.push(quotaList[i].content)
            } else {
              // 拼装数据
              ayy.push({
                code: quotaList[i].code,
                content: quotaList[i].content,
                url: quotaList[i].url,
                fqtCode: quotaList[i].fqtCode,
                fqtId: quotaList[i].fqtId,
                grade: quotaList[i].grade,
                id: quotaList[i].id,
                isRecord: quotaList[i].isRecord,
                projectId: quotaList[i].projectId,
                quotaId: quotaList[i].quotaId,
                status: quotaList[i].status,
                finished: quotaList[i].finished,
                isAmount: quotaList[i].isAmount
              })
            }
          }
          that.setData({
            listData: ayy,
            quotaId: quotaId,
            tips: arr
          })
        } else {
          wx.showToast({
            title: '获取点位树失败',
            icon: 'loading',
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
  // 跳转上传页面
  goToUpload: function(e) {
    var that = this;
    var terminalUserId = app.terminalUserId;
    var bgColorUi = wx.getStorageSync('bgColorUi');
    var isGrade = that.data.isGrade;
    // var isRecord = e.currentTarget.dataset.isrecord;//是否需要录音，现在都需要。
    var isAmount = e.currentTarget.dataset.isamount;
    var content = e.currentTarget.dataset.content;
    var questionId = e.currentTarget.dataset.id;
    var code = e.currentTarget.dataset.code;
    var grade = e.currentTarget.dataset.grade; //最大分
    var pointId = that.data.pointId;
    var pointTypeId = that.data.pointTypeId;
    var pointName = that.data.pointName;
    var quotaId = e.currentTarget.dataset.quotaid;
    var projectId = that.data.projectId;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;
    var requestUrl = that.data.requestUrl; 

    //跳转上传页面
    router.navigateTo({
      url: "../task_upload/task_upload",
       success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('quotaList', {
                  terminalUserId: terminalUserId,
                  isGrade: isGrade,
                  isAmount: isAmount,
                  content:content,
                  questionId:questionId,
                  code:code,
                  grade:grade,
                  pointId:pointId,
                  pointTypeId: pointTypeId,
                  pointName:pointName,
                  quotaId:quotaId,
                  projectId:projectId,
                  fontSize:fontSize,
                  bgColor:bgColor,
                  bgColorUi:bgColorUi,
                  requestUrl:requestUrl
                })
              }
    })
  
  },


  // 提示弹框
  showAlert(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url) {
      router.navigateTo({
        url: "../question_tips/question_tips?url=" + url
      })
    } else { //url为空
      this.setData({
        visible: true
      })
    }

  },
  hideAlert(type) {
    this.setData({
      visible: false
    })
  }, 
  // 页面切换
  showModal(e) {
    // console.log("showModal:", e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    var that = this;
    // type 0-点击有效，1-无效
    var userIndex = e.currentTarget.dataset.index;
    // console.log("第几行：", userIndex)
    var type = e.currentTarget.dataset.type;
    var quotaId = e.currentTarget.dataset.quotaid;
    var quotaName = e.currentTarget.dataset.content;
    var pointTypeId = that.data.pointTypeId;
    var variable = e.currentTarget.dataset.variable;
    var projectId = that.data.projectId;
    var locationId = that.data.pointId;
    if (type == 0) {
      this.setData({
        userIndex: userIndex,
        quotaId: quotaId,
        modalName: null,
        quotaName: quotaName
      })
      if (variable == 0) {
        that.getProblemByfenlei(pointTypeId, quotaId, projectId, locationId);
      } else {
        that.getQuotaDetail(quotaId, pointTypeId);
      }
    } else {
      this.setData({
        userIndex: userIndex,
        modalName: null
      })
    }
  },

  // 切换  按问题分类查
  goToSwitch: function(e) {
    var that = this;
    var projectId = that.data.projectId;
    var pointTypeId = that.data.pointTypeId;
    var locationId = that.data.pointId;
    if (that.data.qiehuan == 1) {
      that.setData({
        variable: 1,
        qiehuan: 0,
        userIndex: 0
      })
      // console.log("指标类型查")
      this.getQuotaList(pointTypeId, locationId, projectId);
    } else {
      that.setData({
        variable: 0,
        qiehuan: 1,
        userIndex: 0
      })
      // console.log("问题分类查")
      this.getproblemList(pointTypeId, projectId, locationId);
    }
  },

  //按问题分类查
  getproblemList: function(pointTypeId, projectId, locationId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var userIndex = that.data.userIndex; //用户操作的行
    //从task_upload页面返回当userIndex为0 时赋默认值0
    if (typeof(userIndex)==='undefined') {
      var userIndex=0;
    }
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldQuestionClassify/getFieldQuestionClassifyListByLocationId',
      data: {
        pointId: pointTypeId,
        projectId: projectId,
        locationId: locationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
       // console.log('指标列表数据', res.data.retObj)
        if (res.data.status == 'success') {
          var pointTypeId = that.data.pointTypeId
          if (userIndex === 0) {
            var quotaList = res.data.retObj;
            let arr = [];
            let ayy = [];
            for (let i = 0; i < quotaList.length; i++) {
              if (i === 0) {
                arr.push(quotaList[i].id),
                  ayy.push(quotaList[i].content)
              }
            }
            // 数组转字符得到第一个指标的id
            var arrtest = arr.join();
            var ayytest = ayy.join();
            that.setData({
              list: res.data.retObj,
              quotaName: ayytest
            })
            // 加载第一个指标下的问题
            that.getProblemByfenlei(pointTypeId, arrtest, projectId, locationId);
          } else {
          var quotaList = res.data.retObj;
            let user = [];
            let usery = [];
            for (let j = 0; j < quotaList.length; j++) {
              if (j === userIndex) {
                user.push(quotaList[j].id),
                  usery.push(quotaList[j].content)
              }
            }
            var userIndexId = user.join();
            var userY = usery.join();
            that.setData({
              list: res.data.retObj,
              quotaName: userY
            })
            that.getProblemByfenlei(pointTypeId, userIndexId, projectId, locationId);
          }
        } else {
          wx.showToast({
            title: '获取指标列表失败',
            icon: 'loading',
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

  //  问题分类下的问题列表
  getProblemByfenlei: function(pointTypeId, questionClassifyId, projectId, locationId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuestionClassifyId',
      // url: 'http://192.168.5.105:8088/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuestionClassifyId',
      data: {
        pointId: pointTypeId,
        questionClassifyId: questionClassifyId,
        projectId: projectId,
        locationId: locationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          // console.log("问题分类指标下的详情：", quotaList)
          let arr = [];
          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
            if (quotaList[i].type === 2) {
              arr.push(quotaList[i].content)
            } else {
              // 拼装数据
              ayy.push({
                code: quotaList[i].code,
                content: quotaList[i].content,
                url: quotaList[i].url,
                fqtCode: quotaList[i].fqtCode,
                fqtId: quotaList[i].fqtId,
                grade: quotaList[i].grade,
                id: quotaList[i].id,
                isRecord: quotaList[i].isRecord,
                projectId: quotaList[i].projectId,
                quotaId: quotaList[i].quotaId,
                status: quotaList[i].status,
                finished: quotaList[i].finished,
                isAmount: quotaList[i].isAmount
              })
            }
          }
          // console.log("啥意思啊：",ayy)
          that.setData({
            listData: ayy,
            tips: arr
          })

        } else {
          wx.showToast({
            title: '获取点位树失败',
            icon: 'loading',
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

  changeData: function() {
    var e = {
      pointTypeId: this.data.pointTypeId,
      pointName: this.data.pointName,
      pointId: this.data.pointId
    }
    this.onLoad(e); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },

  changeParentData: function() {
    var that = this;
    var pointName = that.data.pointName;
    var pointId = that.data.pointId;
    var pointTypeId = that.data.pointTypeId;
    var requestUrl = that.data.requestUrl;
    var isGrade = that.data.isGrade;
    var projectId = that.data.projectId;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;

    var firstQuestion = wx.getStorageSync("firstQuestion");
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.setData({ //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
        pointId: pointId,
        pointName: pointName,
        pointTypeId: pointTypeId,
        firstQuestion: firstQuestion,
        requestUrl:requestUrl,
        isGrade:isGrade,
        projectId:projectId,
        fontSize:fontSize,
        bgColor:bgColor
      })
      beforePage.changeData(); //触发父页面中的方法
    }
  },

  onUnload: function() {
    this.changeParentData();
  },


})