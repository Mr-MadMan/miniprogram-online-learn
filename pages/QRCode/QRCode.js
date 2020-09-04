const app = getApp();
const common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    signList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: wx.getStorageSync('openId')
    })
    this.signListGet();
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

  },
  signListGet: function () {
    let that = this;
    let data = { "api": "Sign", "control": "SignActionClientList", "param": { "openid": that.data.openid } };
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
    });

  },
  signChosen: function (e) {
    app.globalData.signid = e.currentTarget.dataset.signid;
    wx.navigateTo({
      url: '../QRImg/QRImg',
      success: (res) => {

      },
      fail: () => {
        wx.showToast({
          title: '跳转失败',
          icon: 'warn',
          duration: 1500,
        });

      },
      complete: () => { }
    });

  }
})