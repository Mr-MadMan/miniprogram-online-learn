const app = getApp();
const common = require('../../utils/common.js');
Page({
  
  data: {
    userInfo: '',
    scanResult: '',
    stuInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShow:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(app.globalData.userInfo);
    
    if (app.globalData.userInfo || wx.getStorageSync('stuid').length!=0||wx.getStorageSync('realname').length!=0) {
      this.setData({
        userInfo: app.globalData.userInfo,
        stuInfo: {stuid:wx.getStorageSync('stuid'),realname:wx.getStorageSync('realname')},
        isShow: wx.getStorageSync('isShow')
      })
    }
  },
  onShow: function() {
    // 页面出现在前台时执行
    console.log(app.globalData.callbackData);
    
    if (wx.getStorageSync('stuid').length!=0||wx.getStorageSync('realname').length!=0) {
      this.setData({
        stuInfo: {stuid:wx.getStorageSync('stuid'),realname:wx.getStorageSync('realname')},
        isShow:wx.getStorageSync('isShow')
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getUserInfo(){
    let that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            //用户授权成功后，调用login
            success: res => {
              console.log(res.userInfo);
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                isShow:true
              })
              wx.setStorageSync('isShow', that.data.isShow)
            }
          })
          // that.queryCheck();
        } else {
          //用户没有授权
          //改变hide值，显示授权页面
          that.setData({
            isShow: false
          })
          wx.setStorageSync('isShow', that.data.isShow)
        }
      }
    })
  },
  bindTapView: function(e) {
    let that = this;
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo) {
      //若用户按了授权按钮
      that.getUserInfo();
      app.loginLogPost();
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: 'warning',
        content: '您点击了拒绝授权',
        showCancel: true,
        confirmText: '返回授权',
        success: res => {
          //用户无授权成功，无需改变isHide值
          if (res.confirm) {
            console.log('用户点击"返回授权"');
          }
        }
      })
    }
  },
  queryCheck() {
    let rdata = common.rdataAcp("QueryOpenid", {
      "openid": wx.getStorageSync('openId')
    });
    app.ruquestApi(rdata, app.callbackFun);
  },
  infoEdit: function (e) {
    wx.navigateTo({
      url: '../personEdit/personEdit'
    })
  },
  scan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: (res) => {
        console.log(res.result)
        let qrType = res.result.substr(res.result.length-39,'7')
        if (qrType == 'QR_SIGN') {
          wx.showToast({
            title: '签到成功！',
            duration: 1000,
            icon: 'none'
          })          
        }else{
            var scanR = res.result.substr(res.result.length - 32, '32');
            that.setData({
              scanResult: scanR
            })
            that.asyncLogin(scanR);
        }
      },
      fail: res => {
        wx.showToast({
          title: 'fail',
          icon: 'none',
          duration: 1000
        })
      }
    })

  },
  asyncLogin(param) {
    let rdata = {
      "api": "OAuth",
      "control": "WechatLogin",
      "param": {
        "oauth": param,
        "openid": wx.getStorageSync('openId')
      }
    };
    app.ruquestApi(rdata);
  },
  signFeedback: function () {
    let that = this;
    let data = { "api": "Sign", "control": "SignActionClientPost", "param": { "openid": wx.getStorageSync('openId') } };
    let post = { "CLIENT_ID": app.globalData.CLIENT_ID, "TIMESTR": app.GetTimeStr(), "DATA": app.DataEncode(data), "SIGN": "" };
    post["SIGN"] = app.globalData.md5(app.globalData.CLIENT_ID + post["DATA"] + post["TIMESTR"] + app.globalData.CLIENT_KEY).toUpperCase();
    wx.request({
      url: 'https://api.wechat.loswork.iw3c.top/',
      data: post,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (app.ServerSignCheck(res.data)) {
          var _rdata = app.DataDecode(res.data["DATA"]);
        }
        console.log(_rdata);
        if (_rdata.code != '0' || _rdata.list.length == 0) {
          wx.showToast({
            title: '暂无签到事件',
            icon: 'none',
            duration: 1500,
          })
        }
        that.setData({
          signList: _rdata.list
        })
      },
      fail: () => { },
      complete: () => { }
    })
  },

})