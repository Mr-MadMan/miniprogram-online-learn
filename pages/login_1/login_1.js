//获取应用实例
const app = getApp()
var common = require('../../utils/common.js');
Page({
  data: {
    userInfo: {},
    isHide: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function() {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            //用户授权成功后，调用login
            success: res => {
              app.globalData.userInfo = res.userInfo
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
          that.queryCheck();
        } else {
          //用户没有授权
          //改变hide值，显示授权页面
          that.setData({
            isHide: true
          })
        }
      }
    })
  },
  queryCheck() {
    let rdata = common.rdataAcp("QueryOpenid", {
      "openid": wx.getStorageSync('openId')
    });
    app.ruquestApi(rdata, app.callbackFun);
  },


  bindTapView: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo) {
      //若用户按了授权按钮
      // app.loginLogPost();
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: 'warning',
        content: '您点击了拒绝授权，无法进入该小程序，请授权后再进入！',
        showCancel: false,
        confirmText: '返回授权',
        success: res => {
          //用户无授权成功，无需改变isHide值
          if (res.confirm) {
            console.log('用户点击"返回授权"');
          }
        }
      })
    }
  }
})