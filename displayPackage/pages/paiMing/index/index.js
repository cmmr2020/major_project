// const util = require('../../utils/util.js')
const app = getApp();
var requestUrl=app.globalData.requestUrl
Page({
  data: {
    projectId : '',
    projectName : '',
    dept_list: [],
    point_list:[],
    quota_tree_list:[],
    quota_type_list:[],
    //部门多选框选中ids
    dept_select_ids:'',
    //部门多选款事件变化临时选中ids
    dept_temp_ids:[],
    deptTip_msg: '',
    quota_temp_ids:[],
    quotaTip_msg: '',
    point_select_ids:'',
    point_temp_ids:[],
    pointTip_msg: '',
    quotaType_select_ids:'',
    quotaType_temp_ids:[],
    quotaTypeTip_msg: '',
    deptAllselect:false,
    dept_select_flag:false,
  },
  onLoad: function (options) {
    this.data.projectId = options.projectId;
    this.data.projectName = options.projectName
    this.initSearchParam(options.projectId);
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  show_temp_dept(e){
    let that = this;
    that.setData({
      dept_temp_ids : e.detail.value
    })
  },
  show_temp_point(e){
    let that = this;
    that.setData({
      point_temp_ids : e.detail.value
    })
  },
  show_temp_quotaType(e){
    let that = this;
    that.setData({
      quotaType_temp_ids : e.detail.value
    })
  },
  select_dept(e){
    let that = this;
    let idsArr = that.data.dept_temp_ids;
     that.setData({
       dept_select_ids : idsArr,
       modalName: '',
       deptTip_msg:idsArr.length>0?'您已选择'+idsArr.length+'个部门':''
    })
  },
  select_point(e){
    let that = this;
    let idsArr = that.data.point_temp_ids;
     that.setData({
       point_select_ids : idsArr,
       modalName: '',
       pointTip_msg:idsArr.length>0?'您已选择'+idsArr.length+'种点位类型':''
    })
  },
  select_quotaType(e){
    let that = this;
    let idsArr = that.data.quotaType_temp_ids;
     that.setData({
       quotaType_select_ids : idsArr,
       modalName: '',
       quotaType_msg:idsArr.length>0?'您已选择'+idsArr.length+'种指标类型':''
    })
  },
  dept_select_all(e){
    let that = this;
    this.setData({
      deptAllselect : true
    })
  },
  dept_clean_all(){
    let that = this;
    this.setData({
      deptAllselect : false
    })
  },
  initSearchParam:function(projectId){
    let that = this;
    app.wxRequest('GET',
    requestUrl + '/private/largeScreenDisplay/renderSearchParamForWechat',
    {
      projectId: projectId
    },
    app.seesionId,
    (res) =>{
      if (res.data) {
        that.setData({
          dept_list : res.data.DepartmentList,
          point_list: res.data.PointList,
          quota_tree_list: res.data.QuotaVoTree,
          quota_type_list: res.data.quotaTypeList
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
    );
  },
  jump: function(option){
    //console.log(option)
    let that = this;
    let type = option.currentTarget.dataset.type
    if(type == 'dept'){
      wx.navigateTo({
        url: '../deptDataInfo/deptDataInfo?reportType=0&projectId='+that.data.projectId+"&projectName="+that.data.projectName+"&deptIds="+that.getStrs(that.data.dept_select_ids)+"&pointIds="+that.getStrs(that.data.point_select_ids)+"&quotaTypeIds="+that.getStrs(that.data.quotaType_select_ids)
      })
    }else if(type == 'quota'){
      wx.navigateTo({
        url: '../quotaDataInfo/quotaDataInfo?reportType=1&projectId='+that.data.projectId+"&projectName="+that.data.projectName+"&deptIds="+that.getStrs(that.data.dept_select_ids)+"&pointIds="+that.getStrs(that.data.point_select_ids)+"&quotaTypeIds="+that.getStrs(that.data.quotaType_select_ids)
      })
    }else if(type == 'location'){
      wx.navigateTo({
        url: '../deptDataInfo/deptDataInfo?reportType=2&projectId='+that.data.projectId+"&projectName="+that.data.projectName+"&deptIds="+that.getStrs(that.data.dept_select_ids)+"&pointIds="+that.getStrs(that.data.point_select_ids)+"&quotaTypeIds="+that.getStrs(that.data.quotaType_select_ids)
      })
    }else if(type == 'abarbeitung'){
      wx.navigateTo({
        url: '../deptDataInfo/deptDataInfo?reportType=3&projectId='+that.data.projectId+"&projectName="+that.data.projectName+"&deptIds="+that.getStrs(that.data.dept_select_ids)
      })
    }   
  },
  getStrs(arr){
    if(arr.length<1){
      return '';
    }
    var resultStrs = '';
    for(let i=0; i<arr.length; i++){
      resultStrs += arr[i] + ',';
    }
    return resultStrs.substring(0,resultStrs.length-1);
  }
  
});