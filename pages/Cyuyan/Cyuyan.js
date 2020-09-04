// pages/Cyuyan/Cyuyan.js
const app = getApp();
var audioCxt = wx.createInnerAudioContext();
audioCxt.src = encodeURI('https://jdvodrvfb210d.vod.126.net/mooc-video/nos/mp4/2014/05/16/395001_sd.mp4?ak=7909bff134372bffca53cdc2c17adc27a4c38c6336120510aea1ae1790819de8444660b96660e6738273a63889ff48c3b79a18f2c8330752bb0f54836aae69693059f726dc7bb86b92adbc3d5b34b1326cc2e9f89481b0bd35add86c071b1330');
Page({
  data: {
    audioAnimation: null,
    //音乐是不是开始
    music_on: true,
    //音乐是不是在播放
    isPlayingMusic: false,
    //显示的时间
    musicTime: '00:00',
    sliderValue: 0,
    imglist: ['https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_00.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_01.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_02.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_03.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_04.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_05.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_06.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_07.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_08.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_09.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_10.png', 'https://imageview.oss-cn-shanghai.aliyuncs.com/image/CImage/Chapter1/%E7%AC%AC%E4%B8%80%E7%AB%A03%20%E7%AC%AC%E4%B8%80%E4%B8%AAC%E7%A8%8B%E5%BA%8F_11.png'],
    policy: '',
    accessid: '',
    signature: '',
    callback: '',
    userInfo: {},
    commentValue: '',
    commentList: [{ time: "18:00:00", name: "mm", content: "你好帅" }, { time: "18:22:33", name: "gg", content: "你超丑" }, { time: "18:33:44", name: "bb", content: "你很美" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imglist // 需要预览的图片http链接列表  
    })
  },
  playMusic: function (e) {
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
  audioChange: function (e) {
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
  audioChanging: function (e) {
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
  musicTimeFormat: function (time) {
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
  timeUpdate: function () {
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
    this.data.commentList.unshift(obj);
    that.data.commentValue = '';
    that.setData({
      commentList: that.data.commentList,
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