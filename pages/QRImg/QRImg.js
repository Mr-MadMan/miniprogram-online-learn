const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QrImgGet();
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
  QrImgGet: function () {
    var QRurl = "https://wechat.loswork.iw3c.top/login/scan403.html?qrtype=" + "QR_SIGN" + app.globalData.signid;
    QRurl = encodeURIComponent(QRurl);
    // 生成二维码链接
    var QRimgsrc = "https://api.wechat.loswork.iw3c.top/?api=Qrcode&type=url&str=" + QRurl;
    this.setData({
      imgUrl: QRimgsrc
    })
  }
})