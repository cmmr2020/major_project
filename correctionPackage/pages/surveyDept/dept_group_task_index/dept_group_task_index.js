// 引入跳转js
import router from '../../../../utils/router.js';
var app = getApp()
var rectifyFlag = false;
//各tab参数 
var request_dataParam_map = new Map();
Page({
  data: {
    requestUrl: '', //请求路径
    projectId: '', //项目id
    terminalUserId: '', //调查员id
    swiperIndex: 0, //初始化swiper索引
    swiperHeight: 350,
    children_page_data: '',//子页面返回的任务列表参数
    // 问题栏默认值
    // TabCur: null,
    TabCur: '',// 0待整改（未整改/整改不达标继续整改）  1 已整改 2 长期整改 3 整改合格 4 待审核
    // 轮播图数据
    swiperList: [],
    // 问题类型数据
    problemType: [],
    //任务列表数据
    taskList: [],
    //任务列表初始页（默认1）
    pagenum: 1,
    //赋值任务列表总页数（默认1）
    maxPageNum: 1,
    //空内容提示标识
    isNull: '',
    date: '',
    problemType_user: [{
      id: 0,
      name: '待整改'
    }, {
      id: 1,
      name: '已整改'
    }, {
      id: 3,
      name: '长期整改'
    }, {
      id: 2,
      name: '整改合格'
    }],
    //任务列表清楚参数实体
    task_request_dataParam: {

    },
    taskDelayNum: 0,//逾期任务数
    fontSize: '',
    bgColor: '',
    fontSize28: '',
    fontSize26: '',
    fontSize30: '',
    //批量审核任务id集合
    batch_process_taskIdArr: [],
    processType: '',//批量审核类型
    process_auditContent: '',//批量审批意见
    isHeadman: '',//0组员  1组长
    batch_allocating_task_userId: ''//批量分配任务用户id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var requestUrl = app.globalData.requestUrl; //请求路径
    var projectId = options.projectId;
    var terminalUserId = app.terminalUserId; //调查员id
    var fontSize = wx.getStorageSync('fontSize');
    var bgColor = wx.getStorageSync('bgColor');
    that.setData({
      requestUrl: requestUrl,
      projectId: projectId,
      terminalUserId: terminalUserId,
      fontSize: fontSize,
      bgColor: bgColor,
      fontSize30: parseInt(fontSize),
      fontSize26: parseInt(fontSize) - 12,
      fontSize28: parseInt(fontSize) - 7,
      isHeadman: options.isHeadman
    })
    if (options.isHeadman == 1) {
      var tab4 = {
        id: 4,
        name: '待审核'
      }
      var tabArr = that.data.problemType_user
      tabArr.push(tab4)
      //显示审核按钮
      that.setData({
        problemType_user: tabArr
      })
      that.getProjectFieldTaskTips();
    }
    //加载轮播图
    that.getSwiperList();
  },
  //刷新页面
  onShow: function () {
    console.log('页面显示')
    var that = this;
    //console.log(that.data.children_page_data)
    if (that.data.children_page_data) {
      var task_list_param = that.data.children_page_data
      var pageScrollto_id = task_list_param.pageScrollto_id
      var search_param_str = task_list_param.search_param_str
      var TabCur = task_list_param.tabCur
      var pageNum = task_list_param.pagenum
      //var maxPageNum = task_list_param.maxPageNum
      //console.log(search_param_str)   
      if (search_param_str) {
        var search_param = JSON.parse(search_param_str)
        request_dataParam_map.set(TabCur, search_param)
      }
      that.setData({
        taskList: [],
        pagenum: 1,
        maxPageNum: 0, //总页数
        isNull: '',
        TabCur: TabCur
      })
      //加载任务列表
      that.getTaskList(pageNum * 5, pageScrollto_id);
    } else {
      that.setData({
        taskList: [],
        maxPageNum: 0, //总页数
        isNull: '',
        TabCur: 0,
      })
      //加载任务列表
      that.getTaskList();
    }

  },
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  // 跳转轮播图详情
  toswiper: function () {
    var swiperIndex = this.data.swiperIndex;
    // router.navigateTo({
    //   url: "../dept_swiper/dept_swiper?id=" + swiperIndex
    // })
  },
  /**
   * 获取轮播图数据
   */
  getSwiperList() {
    let that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + "/wechat/api/carousel/getCarouselList",
      '',
      app.seesionId,
      (res) => {
        if (res.data.status === "success") {
          that.setData({
            swiperList: res.data.retObj
          })
        }
      },
      (err) => {

      }
    )
  },
  /**
   * 动态改变问题类型的ID，传参加载ID下的任务列表
   */
  tabSelect: function (e) {
    var that = this;
    //  给TabCurf赋值
    if (e.currentTarget.dataset.id != null) {
      that.setData({
        TabCur: e.currentTarget.dataset.id,
        //每次切换问题，清空问题列表
        taskList: [],
        //每次切换问题，给pagenum重新赋值为1
        pagenum: 1
      })
      //传参问题Id获取任务列表
      that.getTaskList();
    }
  },
  /**
   * 获取任务列表数据
   * 第一次默认加载全部，这里只加载一次，后面根据当前问题的ID发送请求
   */
  getTaskList: function (pageSize, pageScrollto_id) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var projectId = that.data.projectId; //项目id
    var TabCur = that.data.TabCur; //整改状态
    //var pagenum = that.data.pagenum;
    var terminalUserId = that.data.terminalUserId;
    if (request_dataParam_map.has(that.data.TabCur)) {
      that.setData({
        task_request_dataParam: request_dataParam_map.get(that.data.TabCur),
      })
    } else {
      that.setData({
        task_request_dataParam: {},
      })
    }
    //当前tab
    if (TabCur >= 0) {
      that.data.task_request_dataParam.projectId = projectId;
      that.data.task_request_dataParam.pageNum = that.data.pagenum;
      if (!pageSize) {
        that.data.task_request_dataParam.pageSize = 5;
      } else {
        that.data.task_request_dataParam.pageSize = pageSize;
      }
      that.data.task_request_dataParam.isHeadman = that.data.isHeadman
      that.data.task_request_dataParam.terminalUserId = terminalUserId;
      if (TabCur == 0) {//待整改（未整改/整改不达标继续整改）
        that.data.task_request_dataParam.result = 9
        that.data.task_request_dataParam.longTask = 0
      } else if (TabCur == 1) {//已整改
        that.data.task_request_dataParam.result = that.data.isHeadman == 1 ? 4 : 3 //如果为组长时 状态为4(上级审核中) 为已整改列表
      } else if (TabCur == 3) {//长期整改
        that.data.task_request_dataParam.result = 2
        that.data.task_request_dataParam.longTask = 1
      } else if (TabCur == 2) {//整改合格
        that.data.task_request_dataParam.result = 0
      } else if (TabCur == 4) {//待审核
        that.data.task_request_dataParam.result = 3
      }
    }
    console.log(that.data.task_request_dataParam)
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      requestUrl + "/mobile/fieldTask/getFieldTaskRectifyListByDeptGroup",
      that.data.task_request_dataParam,
      app.seesionId,
      (res) => {
        var list = res.data.retObj.list;
        console.log(list)
        if (list != 0) {
          for (let i = 0; i < list.length; i++) {
            var obj = list[i]
            if (obj.userName && obj.userName.indexOf('#') != -1) {
              obj.userName = obj.userName.split('#')[1]
            }
          }
          that.setData({
            //1、that.data.taskList  获取当前页面存的taskList数组
            //2、res.data.retObj   获取当前请求得到的taskList数组
            //3、xxx.concat  把新加载的数组追加到当前页面之后
            taskList: that.data.taskList.concat(res.data.retObj.list),
            maxPageNum: res.data.retObj.pageCount, //总页数
            isNull: ''
          })
          //console.log(pageScrollto_id)
          if (pageScrollto_id) {//如果id不为空 则为测评页面返回 定位到跳转之前的位置
            wx.pageScrollTo({
              selector: '#' + pageScrollto_id,//选择器
              offsetTop: -200,//偏移距离，需要和 selector 参数搭配使用，可以滚动到 selector 加偏移距离的位置，单位 px
              duration: 0,//滚动动画的时长，单位 ms
            })
          }

          //console.log("看看这个任务列表：", that.data.taskList)
        } else {
          that.setData({
            isNull: 'true',
            maxPageNum: 1
          })
        }
        that.hideModal();
      },
      (err) => {

      }
    )
  },
  //查询触发方法
  search_fun() {
    this.setData({
      //每次切换问题，清空问题列表
      taskList: [],
      //每次切换问题，给pagenum重新赋值为1
      pagenum: 1
    })
    this.getTaskList()
  },
  //查询任务统计 弹窗提示
  getProjectFieldTaskTips: function () {
    var that = this;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      that.data.requestUrl + "/mobile/fieldTask/getDepartmentTipsByDeptGroup",
      {
        "projectId": that.data.projectId,
      },
      app.seesionId,
      (res) => {
        var data = res.data
        if (data.status = "success") {
          var projectData = data.retObj;
          console.log(projectData)
          var tips = "当前小组中已分配" + projectData.allNum + "条任务，其中有" + projectData.unRectifyNum + "条待整改、" + projectData.rectifiedNum + "条已整改、" + projectData.longTaskNum + "条长期整改、" + projectData.standardNum + "条整改合格、" + projectData.unCheckNum + "条待审核、" + projectData.unStandardNum + "条权属异议。";
          if (projectData.allNum > 0) {
            app.msg(tips)
          }
          that.setData({
            taskDelayNum: projectData.standardPercent
          })
        } else {
          app.alert("加载失败")
        }
      },
      (err) => {

      }
    )
  },
  //上拉函数
  onReachBottom: function () { //触底开始下一页
    var that = this;
    var pagenum = that.data.pagenum + 1; //获取当前页数并+1
    that.setData({
      pagenum: pagenum, //更新当前页数
    })
    if (that.data.maxPageNum >= pagenum) {
      if (that.data.TabCur != null) {
        that.getTaskList(); //重新调用请求获取下一页数据
      }
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })

    } else {
      // 显示加载图标
      wx.showLoading({
        title: '没有更多了',
      })

    }
    // 隐藏加载框
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  showSearchModal(e) {
    var that = this;
    if (request_dataParam_map.has(that.data.TabCur)) {
      that.setData({
        task_request_dataParam: request_dataParam_map.get(that.data.TabCur),
        modalName: e.currentTarget.dataset.target
      })
    } else {
      that.setData({
        task_request_dataParam: {},
        modalName: e.currentTarget.dataset.target
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //日期选项
  DateChange(e) {
    var that = this
    var data_param;
    if (request_dataParam_map.has(that.data.TabCur)) {
      data_param = request_dataParam_map.get(that.data.TabCur)
    } else {
      data_param = {};
    }
    data_param.date = e.detail.value
    request_dataParam_map = request_dataParam_map.set(that.data.TabCur, data_param)
    that.setData({
      task_request_dataParam: request_dataParam_map.get(that.data.TabCur)
    })
  },
  task_code_input(e) {
    var that = this;
    var type = e.currentTarget.dataset.type
    var data_param;
    if (request_dataParam_map.has(that.data.TabCur)) {
      data_param = request_dataParam_map.get(that.data.TabCur)
    } else {
      data_param = {};
    }
    if (type == 'code') {
      data_param.taskCode = e.detail.value
    } else if (type == 'location') {
      data_param.locationName = e.detail.value
    } else if (type == 'question') {
      data_param.question = e.detail.value
    } else if (type == 'point') {
      data_param.pointName = e.detail.value
    }
    request_dataParam_map = request_dataParam_map.set(that.data.TabCur, data_param)
  },
  //长按复制任务编号
  copyCode: function (e) {
    var code = e.currentTarget.dataset.key;
    wx.setClipboardData({
      data: code
    })
  },
  //跳转到整改页面
  goTaskRectify(e) {
    //console.log(e)
    var that = this
    var taskId = e.currentTarget.dataset.taskid;
    var projectId = e.currentTarget.dataset.projectid;
    var pageScrollto_id = e.currentTarget.id;
    //当前页数
    var pagenum = that.data.pagenum
    //最大页数
    var maxPageNum = that.data.maxPageNum
    // 0待整改（未整改/整改不达标继续整改）  1 已整改 2 长期整改 3 整改合格 4 待审核
    var tabCur = that.data.TabCur
    var isHeadman = that.data.isHeadman
    var search_param = request_dataParam_map.get(that.data.TabCur)//undefined
    var search_param_str = ''
    //console.log(search_param)
    if (search_param) {
      search_param_str = JSON.stringify(search_param)
    }
    //当前为 未整改或长期整改时
    if (tabCur == 0 || tabCur == 3) {
      if (rectifyFlag) {
        return;
      }
      rectifyFlag = true;
      //调用全局 请求方法
      app.wxRequest(
        'POST',
        that.data.requestUrl + "/mobile/fieldTask/setRectifyTimeByMoblie",
        { taskId: taskId },
        app.seesionId,
        (res) => {
          var data = res.data
          if (data.status = "success") {
            wx.navigateTo({
              url: '../dept_group_task_detail/dept_group_task_detail?id=' + taskId + '&projectId=' + projectId + '&tabCur=' + tabCur + '&pageScrollto_id=' + pageScrollto_id + '&search_param_str=' + search_param_str + '&pagenum=' + pagenum + '&maxPageNum=' + maxPageNum + '&isHeadman=' + isHeadman,
              events: {
                acceptDataFromOpenedPage: function (data) {
                  that.setData({
                    children_page_data: data
                  })
                },
              }
            })
          } else {
            if (data.message == '服务器错误') {
              app.alert(data.message)
              return;
            }
            app.msg(data.message)
          }
          rectifyFlag = false;
        },
        (err) => {
          app.alert("网络错误")
        }
      )
    } else {
      wx.navigateTo({
        url: '../dept_group_task_detail/dept_group_task_detail?id=' + taskId + '&projectId=' + projectId + '&tabCur=' + tabCur + '&pageScrollto_id=' + pageScrollto_id + '&search_param_str=' + search_param_str + '&pagenum=' + pagenum + '&maxPageNum=' + maxPageNum + '&isHeadman=' + isHeadman,
        events: {
          acceptDataFromOpenedPage: function (data) {
            that.setData({
              children_page_data: data
            })
          },
        }
      })
    }

  },
  //多选框监听方法
  save_taskIds: function (e) {
    this.setData({
      batch_process_taskIdArr: e.detail.value
    })
  },
  //选中任务点击批量审批按钮 弹窗显示审批意见输入框
  show_auditContent_modal(e) {
    var that = this;
    var taskArr = that.data.batch_process_taskIdArr
    if (!taskArr || taskArr.length < 1) {
      app.msg('请先选择任务~')
      return
    } else {
      this.setData({
        processType: e.currentTarget.dataset.type,
        modalName: 'auditContent_modal'
      })
    }
  },
  set_auditContent: function (e) {
    this.setData({
      process_auditContent: e.detail.value,
    })
  },
  //批量审核方法
  batch_process: function (e) {
    //合格 0  0
    //不合格 2  0
    //长期整改  2  1
    var that = this;
    // console.log(that.data.batch_process_taskIdArr)
    // console.log(that.data.process_auditContent)
    // console.log(e.currentTarget.dataset.resulttype)
    // 0批量通过  1批量不通过  2批量长期整改
    var result_type = e.currentTarget.dataset.resulttype
    var taskIds = that.data.batch_process_taskIdArr + ''
    var auditContent = that.data.process_auditContent
    if(!auditContent && result_type !=0 ){
      app.msg('请输入审批意见')
      return
    }
    if (auditContent.length > 500) {
      app.msg('审批意见不能超过500字')
      return
    }
    var param;
    if (result_type == 0) {
      //批量合格
      param = {
        taskIds: taskIds,
        result: 0,
        auditContent: auditContent,
      }
    } else {
      //批量不合格
      param = {
        taskIds: taskIds,
        result: 2,
        auditContent: auditContent,
      }
    }
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      that.data.requestUrl + "/mobile/fieldTask/batchDeptGroupTypeCheckByMobile",
      param,
      app.seesionId,
      (res) => {
        console.log(res)
        var data = res.data
        if (data.status = "success") {
          app.alert("审核成功")
          that.setData({
            modalName: ''
          })
          //刷新列表
          that.search_fun()
        } else {
          app.alert("请求失败")
        }
      },
      (err) => {
        app.alert("网络错误")
      }
    )
    ///fieldTask/batchDeptTypeCheck.json
  },
  //单任务分配 调整单位页面
  open_allocating_task_page: function (e) {
    var that = this;
    var taskId = e.currentTarget.dataset.taskid
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      that.data.requestUrl + "/mobile/fieldTask/findUserListByDepartmentByMoblie",
      { taskId: taskId },
      app.seesionId,
      (res) => {
        //console.log(res)
        var data = res.data
        if (data.status = "success") {
          var selectUser = ''
          var show_userList = [];
          var usersList = data.retObj.userList
          if (usersList) {
            for (let i = 0; i < usersList.length; i++) {
              var user = usersList[i]
              if (user.name.indexOf('#') != -1) {
                user.name = user.name.split('#')[1]
              }
              var show_user = { id: user.id, name: user.name, taskId: taskId }
              show_userList.push(show_user)
              var selectUserId = data.retObj.selectUserId
              if (selectUserId && user.id == selectUserId) {
                selectUser = show_user
              }
            }
            that.setData({
              show_userList: show_userList,
              selectUser: selectUser,
              modalName: 'updateTaskUser',
              update_page_id: e.currentTarget.dataset.pageid
            })
          } else {
            app.alert("暂无数据")
          }
        } else {
          app.alert("请求失败")
        }
      },
      (err) => {
        app.alert("网络错误")
      }
    )
  },
  updateTaskUserChange: function (e) {
    var that = this;
    that.setData({
      selectUser: that.data.show_userList[e.detail.value]
    })
  },
  saveDeptUserTask: function (e) {
    var that = this;
    if (!that.data.selectUser) {
      app.alert('请选择单位~')
      return
    }
    var projectId = that.data.projectId
    var taskId = that.data.selectUser.taskId;
    var userId = that.data.selectUser.id;
    var param = {
      taskId: taskId,
      projectId: projectId,
      userId: userId
    }
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      that.data.requestUrl + "/mobile/fieldTask/saveDeptUserTaskForDeptGroupByMobile",
      param,
      app.seesionId,
      (res) => {
        //console.log(res)
        var data = res.data
        if (data.status = "success") {
          var page = that.data.pagenum
          app.alert("更新成功")
          that.setData({
            modalName: '',
            taskList: [],
            pagenum:1
          })
          that.getTaskList(page* 5, that.data.update_page_id);

        } else {
          app.alert("请求失败")
        }
      },
      (err) => {
        app.alert("网络错误")
      }
    )
  },
  //批量分配情况列表页面
  open_batch_allocating_task_List_page: function (e) {
    var that = this;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      that.data.requestUrl + "/mobile/fieldTask/findDeptGroupUserTaskListByMoblie",
      { projectId: that.data.projectId },
      app.seesionId,
      (res) => {
        var data = res.data
        if (data.status = "success") {
          var usersList = data.retObj
          if (usersList) {
            for (let i = 0; i < usersList.length; i++) {
              var user = usersList[i]
              if (user.userName.indexOf('#') != -1) {
                user.userName = user.userName.split('#')[1]
              }
            }
            that.setData({
              show_batch_userList: usersList,
              bach_task_modalName: 'bach_updateTaskUserList'
            })
          } else {
            app.alert("暂无数据")
          }
        } else {
          app.alert("请求失败")
        }
      },
      (err) => {
        app.alert("网络错误")
      }
    )
  },
  //批量分配页面
  open_batch_allocating_task_page: function (e) {
    var that = this;
    //调用全局 请求方法
    app.wxRequest(
      'GET',
      that.data.requestUrl + "/mobile/fieldTask/findBatchAllocationLocationListByMobile",
      {
        projectId: that.data.projectId,
        userId: e.currentTarget.dataset.userid
      },
      app.seesionId,
      (res) => {
        var data = res.data
        if (data.status = "success") {
          var allList = data.retObj.allList
          var assignedListByUserList = data.retObj.assignedListByUser
          var allocationIds = data.retObj.allocationIds
          var selectLocationIds = '';
          if (allList) {
            for (let i = 0; i < allList.length; i++) {
              var location = allList[i]
              location.allocation = false;
              if(allocationIds && allocationIds.length > 0){
                for (var t=0; t<allocationIds.length; t++){
                    if (location.locationId == allocationIds[t]){
                      location.allocation = true
                    }
                }
            }
              if (assignedListByUserList) {
                for (let t = 0; t < assignedListByUserList.length; t++) {
                  var assigned_location = assignedListByUserList[t]
                  if (assigned_location.locationId == location.locationId) {
                    selectLocationIds += location.locationId + ','
                    location.check = true
                    break;
                  }
                }
              }
              //如果已经变为选中 则跳过当前循环
              if (!location.check) {
                location.check = false;;
              }
            }
            that.setData({
              show_batch_user: allList,
              select_locationIds: selectLocationIds == '' ? '' : selectLocationIds.substring(0, selectLocationIds.length - 1),
              modalName: 'bach_updateTaskUser',
              batch_allocating_task_userId: e.currentTarget.dataset.userid
            })
          } else {
            app.alert("暂无数据")
          }
        } else {
          app.alert("请求失败")
        }
      },
      (err) => {
        app.alert("网络错误")
      }
    )
  },
  //监听分配页面多选框
  set_select_locationIds: function (e) {
    var that = this;
    that.setData({
      select_locationIds: e.detail.value + ''
    })
  },
  updateAllocationLocation: function (e) {
    var that = this;
    var projectId = that.data.projectId
    var select_locationIds = that.data.select_locationIds
    var param = {
      projectId: projectId,
      locationIds: select_locationIds,
      userId: that.data.batch_allocating_task_userId
    }
    //调用全局 请求方法
    app.wxRequest(
      'POST',
      that.data.requestUrl + "/mobile/fieldTask/saveOrUpdateBatchAllocationLocationByUserByMoblie",
      param,
      app.seesionId,
      (res) => {
        //console.log(res)
        var data = res.data
        if (data.status = "success") {
          app.alert("更新成功")
          that.setData({
            modalName: '',
            bach_task_modalName: ''
          })
          that.search_fun()
        } else {
          app.alert("请求失败")
        }
      },
      (err) => {
        app.alert("网络错误")
      }
    )
  },
  bach_hideModal: function () {
    this.setData({
      bach_task_modalName: ''
    })
  }
})