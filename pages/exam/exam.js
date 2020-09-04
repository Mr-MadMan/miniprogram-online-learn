//这里模块暴露需要用到相对路径
const app = getApp();
Page({
  data: {
    titlesList: [],
    index: 0,
    goal: 0,
    bc_default: '#fff',
    bc_right: '#008000',
    bc_wrong: '#FF0000',
    bcA: '',
    bcB: '',
    bcC: '',
    bcD: '',
    showAns: 'true',
    flag: true,
    left: '',
    display: 'none'
  },
  onLoad: function (options) {
    let courseName = app.globalData.courseName
    wx.request({
      url: 'https://wechat.loswork.iw3c.top/src/json/question.json',
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let i = app.globalData.courseId
        this.setData({
          titlesList: res.data[courseName]["chapter" + i]
        })
      },
      fail: () => { },
      complete: () => { }
    })

  },
  btnOpClick: function (e) {
    let that = this;
    let select = e.currentTarget.id;
    let result = that.data.titlesList[that.data.index].answer;
    if (select == result) {
      // 判断是否正确，若正确跳到下一题
      if (that.data.index < that.data.titlesList.length - 1) {
        if (select == 'A') {
          this.setData({ bcA: that.data.bc_right })
        } else if (select == 'B') {
          this.setData({ bcB: that.data.bc_right })
        } else if (select == 'C') {
          this.setData({ bcC: that.data.bc_right })
        } else if (select == 'D') {
          this.setData({ bcD: that.data.bc_right })
        }
        let timer = setTimeout(function () {
          that.nextQuestion()
        }, 1000)
        this.setData({
          goal: that.data.goal + 2
        })
      } else {
        // 做到最后一题时
        if (select == 'A') {
          this.setData({ bcA: that.data.bc_right })
        } else if (select == 'B') {
          this.setData({ bcB: that.data.bc_right })
        } else if (select == 'C') {
          this.setData({ bcC: that.data.bc_right })
        } else if (select == 'D') {
          this.setData({ bcD: that.data.bc_right })
        }
        this.setData({
          goal: that.data.goal + 2
        })
        wx.showToast({
          title: '这已经是最后一题啦！',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      if (select == 'A') {
        this.setData({ bcA: that.data.bc_wrong })
      } else if (select == 'B') {
        this.setData({ bcB: that.data.bc_wrong })
      } else if (select == 'C') {
        this.setData({ bcC: that.data.bc_wrong })
      } else if (select == 'D') {
        this.setData({ bcD: that.data.bc_wrong })
      }
      let timer = setTimeout(function () {
        that.nextQuestion()
      }, 1000)
      if (that.data.index == that.data.titlesList.length - 1) {
        wx.showToast({
          title: '这已经是最后一题啦！',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  nextQuestion: function () {
    let that = this;
    if (that.data.index < that.data.titlesList.length - 1) {
      this.setData({
        index: that.data.index + 1,
        bcA: that.data.bc_default,
        bcB: that.data.bc_default,
        bcC: that.data.bc_default,
        bcD: that.data.bc_default,
        ny: 'true'
      })
    }
  },
  lastQuestion: function () {
    let that = this;
    if (that.data.index > 0) {
      this.setData({
        index: that.data.index - 1,
        bcA: that.data.bc_default,
        bcB: that.data.bc_default,
        bcC: that.data.bc_default,
        bcD: that.data.bc_default,
        ny: 'true'
      })
    }
  },
  showResult: function () {
    let that = this;
    if (that.data.flag) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }
  },


})