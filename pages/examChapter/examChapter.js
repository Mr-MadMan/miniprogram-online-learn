const app = getApp();
const chapterList = require("../../utils/chapter.js");
Page({
  data: {
    courseList: []
  },
  onLoad: function (options) {
    var arr = []
    for (const k in chapterList) {
      arr.push(chapterList[k].chinese)
    }
    this.setData({
      courseList: arr
    })
  },
  examNav(e) {
    app.globalData.chapterId = e.target.dataset.chapterid
    app.globalData.navType = e.target.dataset.navtype
    console.log(app.globalData.navType)
    wx.navigateTo({
      url: '../courseChapter/courseChapter'
    })
  }
})