const chapterList = require("../../utils/chapter.js");
const app = getApp();
Page({
  data: {
    chapterList: [],
    type: ''
  },

  onLoad: function (options) {
    for (const key in chapterList) {
      if (app.globalData.chapterId == chapterList[key].id && app.globalData.navType == 'course') {
        if (chapterList[key].chapter.length!=0) {
          this.setData({
            type: app.globalData.navType,
            chapterList: chapterList[key].chapter
          })
          app.globalData.courseName = chapterList[key].courseName
          app.globalData.coursNameC = chapterList[key].chinese
        }else{
          wx.showToast({
            title: '未获取到章节信息！',
            duration: 1000,
            icon:'none'
          })
        }
      }
      else if(app.globalData.chapterId == chapterList[key].id && app.globalData.navType == 'exam') {
        if (chapterList[key].examChapter.length!=0) {
          this.setData({
            type: app.globalData.navType,
            chapterList: chapterList[key].examChapter
          })
          app.globalData.courseName = chapterList[key].courseName
        }else{
          wx.showToast({
            title: '未获取到章节信息！',
            duration: 1000,
            icon:'none'
          })
        }
      }
    }
  },
  courseNav(e) {
    console.log('选择的课程章节id: ' + e.target.dataset.courseid);
    app.globalData.courseId = e.target.dataset.courseid + 1
    // 判断章节选择时判断跳转到题库还是播放
    if (app.globalData.navType == 'course') {
      wx.navigateTo({
        url: '../detail/detail'
      })
    } else {
      wx.navigateTo({
        url: '../exam/exam'
      })
    }

  }

})