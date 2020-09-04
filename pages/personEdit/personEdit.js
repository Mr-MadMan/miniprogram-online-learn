const app = getApp();
Page({

  data: {
    userInfo: {},
    sex: '',
    name: '',
    school: '',
    xuehao: 0,
    email: '',
    id: '',
    classId: '',
    checked: '',
    submitCheck: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      name: wx.getStorageSync('name'),
      classId: wx.getStorageSync('classId'),
      sex: wx.getStorageSync('sex'),
      xuehao: wx.getStorageSync('xuehao'),
      school: wx.getStorageSync('school'),
      email: wx.getStorageSync('email'),
    });
    if (wx.getStorageSync('openId') && wx.getStorageSync('name')) {
      this.setData({
        submitCheck: false
      })
    }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 封装函数
  submitRequest(dataObject, pdata) {
    var that = this;
    if (dataObject.name && dataObject.xuehao.length == 10 && dataObject.email && dataObject.school && dataObject.sex && dataObject.classId.length == 8) {
      wx.setStorageSync('name', dataObject.name);
      wx.setStorageSync('sex', dataObject.sex);
      wx.setStorageSync('classId', dataObject.classId);
      wx.setStorageSync('xuehao', dataObject.xuehao);
      wx.setStorageSync('school', dataObject.school);
      wx.setStorageSync('email', dataObject.email);
      wx.request({
        url: 'https://api.wechat.loswork.iw3c.top/',
        data: pdata,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (app.ServerSignCheck(res.data)) {
            var _rdata = app.DataDecode(res.data["DATA"]);
          }
          console.log(_rdata);

        }
      })
      that.setData({
        submitCheck: false
      })
    } else {
      wx.showToast({
        title: '请填入正确值！',
        icon: 'none',
        duration: 1500
      })
    }
  },

  radiochange: function (e) {
    console.log(e.detail.value);
    this.setData({
      sex: e.detail.value
    })
  },
  idchange: function (e) {
    console.log(e.detail.value);
    this.setData({
      id: e.detail.value
    })
  },

  formSubmit: function (e) {
    var that = this;
    var dataObject = e.detail.value;
    console.log(dataObject);
    
    let rdata = { "api": "OAuth", "control": "InsertOpenid", "param": { "openid": wx.getStorageSync('openId'), "nickname": "", "realname": dataObject.name, "stuid": dataObject.xuehao, "classid": dataObject.classId, "sex": dataObject.sex, "headimg": "", "photoimg": "", "email": dataObject.email, "school": dataObject.school, "tel": "", "qq": "" } };
    let pdata = { "CLIENT_ID": app.globalData.CLIENT_ID, "TIMESTR": app.GetTimeStr(), "DATA": app.DataEncode(rdata), "SIGN": "" };
    pdata["SIGN"] = app.globalData.md5(app.globalData.CLIENT_ID + pdata["DATA"] + pdata["TIMESTR"] + app.globalData.CLIENT_KEY).toUpperCase();
    if (that.data.submitCheck) {
      that.submitRequest(dataObject, pdata);
      wx.showToast({
        title: '添加成功！',
      })
    } else {
      rdata["control"] = "UpdateOpenid";
      pdata = { "CLIENT_ID": app.globalData.CLIENT_ID, "TIMESTR": app.GetTimeStr(), "DATA": app.DataEncode(rdata), "SIGN": "" };
      pdata["SIGN"] = app.globalData.md5(app.globalData.CLIENT_ID + pdata["DATA"] + pdata["TIMESTR"] + app.globalData.CLIENT_KEY).toUpperCase();
      that.submitRequest(dataObject, pdata);
      wx.showToast({
        title: '修改成功！',
      })
    }
    wx.setStorageSync('realname', dataObject.name) 
    wx.setStorageSync('stuid', dataObject.xuehao) 
  }
})