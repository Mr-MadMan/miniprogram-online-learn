// pages/detail/detail.js
const app = getApp();
var audioCxt = wx.createInnerAudioContext();
// audioCxt.loop = true;
audioCxt.src = encodeURI('https://jdvodrvfb210d.vod.126.net/mooc-video/nos/mp4/2016/08/04/1004759203_59905aa5b86143498354b6310402e82a_sd.mp4?ak=7909bff134372bffca53cdc2c17adc27a4c38c6336120510aea1ae1790819de8a47acd99039deb7b76ca33abcac8aa5c41891098c790c7da836916de774922c53059f726dc7bb86b92adbc3d5b34b132ca2648aa72fa4c543db7a7b744c61a21ab1751379953e9446561f60f0e4ab9c0');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioAnimation: null,
    //音乐是不是开始
    music_on: true,
    //音乐是不是在播放
    isPlayingMusic: false,
    //显示的时间
    musicTime: '00:00',
    sliderValue: 0,
    imgList: [],
    policy: '',
    accessid: '',
    signature: '',
    callback: '',
    coverUrl: '',
    courseNameC: '',
    userInfo: {},
    stuInfo: {},
    commentValue: '',
    commentList: []
  },

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      stuInfo: app.globalData.stuInfo,
      commentList: app.globalData.commentList
    })
    const courseName = app.globalData.courseName
    wx.request({
      url: 'https://wechat.loswork.iw3c.top/src/json/courseImg.json',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let i = app.globalData.courseId
        if (res.data[courseName]["chapter" + i]) {
          this.setData({
            imgList: res.data[courseName]["chapter" + i],
            coverUrl: app.globalData.courseCover[app.globalData.chapterId],
            courseNameC: app.globalData.coursNameC
          })
        } else {
          wx.showToast({
            title: '未获取到课程信息！',
            duration: 1000,
            icon: 'none'
          })
        }
      },
      fail: () => { },
      complete: () => { }
    })


  },
  previewImage: function (e) {
    var current = e.target.dataset.src;  //获取当前点击的图片对象(及当前图片url)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    //音乐播放结束触发
    audioCxt.onEnded((res) => {
      //修改属性。去除css状态
      this.data.music_on = false;
      this.setData({
        music_on: this.data.music_on
      })
      //重新播放
      audioCxt.seek(0);
      this.setData({
        musicTime: '00:00',
        sliderValue: 0
      })
    }),
      //在播放状态，绑定播放进度更新事件。然后控制进度条和时间显示
      audioCxt.onPlay((res) => {
        audioCxt.onTimeUpdate(this.timeUpdate)
      })
  },

  //播放按钮事件

  playMusic(e) {
    var isPlayingMusic = this.data.isPlayingMusic;
    // console.log(isPlayingMusic);
    if (isPlayingMusic) {
      audioCxt.pause();
      this.setData({
        isPlayingMusic: false,
        music_on: true
      })
      // console.log("pauseBackgroundAudio");
    } else {
      audioCxt.play();
      this.setData({
        isPlayingMusic: true,
        music_on: true
      })
      // console.log(isPlayingMusic);
    }

  },

  //进度条改变后触发事件
  audioChange(e) {
    var length = audioCxt.duration;
    var percent = e.detail.value;
    //用进度条百分比 *　整个音乐长度
    var musicTime = Math.round(length / 100 * percent);
    audioCxt.seek(musicTime);

    //因为在拖动进度条时，去除了时间绑定，所以进度改变后重新绑定
    audioCxt.onTimeUpdate(this.timeUpdate);

    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
  //进度条拖动过程中触发事件
  audioChanging(e) {
    //因为在进度条拖动的时候，还会在timeUpdate里面修改进度条的value，倒置拖动受影响，所以当拖动的时候需要取消绑定
    audioCxt.offTimeUpdate();

    //拖动时修改时间显示
    var length = audioCxt.duration;
    var percent = e.detail.value;
    var musicTime = Math.round(length / 100 * percent);
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },

  //将秒钟转化为mm：ss的时间格式
  musicTimeFormat(time) {
    var second = Math.floor(time % 60);
    if (second < 10) {
      second = '0' + second;
    }
    var minute = Math.floor(time / 60);
    if (minute < 10) {
      minute = '0' + minute;
    }
    return minute + ':' + second;
  },

  //播放的时候，更新进度条和时间显示
  timeUpdate() {
    var time = audioCxt.currentTime;
    var percent = Math.round(time / audioCxt.duration * 100);
    this.setData({
      musicTime: this.musicTimeFormat(time),
      sliderValue: percent
    })
  },
  commentInput: function (e) {
    this.setData({
      //输入框获取内容
      commentValue: e.detail.value
    })
  },
  commentSubmit: function (e) {
    var that = this;
    var time = new Date().toLocaleTimeString();
    var obj = { time: time, name: app.globalData.userInfo.nickName, content: e.target.dataset.click };
    app.globalData.commentList.unshift(obj);
    that.data.commentValue = '';
    that.setData({
      commentList: app.globalData.commentList,
      commentValue: that.data.commentValue
    })
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
    audioCxt.pause();
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