//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardCur: 0,
    imgList: [{ id: 0,  url: 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/shujujiegou.jpg' }, { id: 1,  url: 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/Lisanmath.jpg' }, { id: 2,  url: 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/C.jpg' }],
    courseImg: []
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        courseImg:app.globalData.courseImg
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    if (app.globalData.userInfo) {
      this.setData({
        courseImg:app.globalData.courseImg
      })
    }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //跳转
  jupmToDetail: function (e) {
    app.globalData.chapterId = e.target.dataset.chapterid
    app.globalData.navType = e.target.dataset.navtype
    console.log(app.globalData.navType)
    wx.navigateTo({
      url: '../courseChapter/courseChapter'
    })
  }
})
