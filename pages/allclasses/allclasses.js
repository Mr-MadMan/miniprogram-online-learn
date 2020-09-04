// pages/allclasses/allclasses.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classesList: [{id:0,name:"数据结构",url:''}, {id:1,name:"C语言程序设计",url:''}, {id:2,name:"离散数学",url:''}, {id:3,name:"计算机组成原理",url:'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/zuchengyuanli.jpg'},{id:4,name:"计算机算法设计与分析",url:"https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/algorithm.jpg"}]
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  addClass(e) {
    console.log(e.target.dataset.classid);
    let imgObj = {};
    for (let i = 0; i < this.data.classesList.length; i++) {
      if (e.target.dataset.classid == i) {
        imgObj ={id:i,url:this.data.classesList[i].url}
        app.globalData.courseImg.push(imgObj) 
      }
    }
    console.log(app.globalData.courseImg);
    
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})