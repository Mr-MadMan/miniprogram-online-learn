const TOKEN = 'token';
var common = require('/utils/common.js');
App({
  // 配置需要用到的外部方法
  func: {
    req1: common.method1
  },
  globalData: {
    token: '',
    openId: '',
    userInfo: {},
    CLIENT_ID: 'zkTqG7Sh',
    CLIENT_KEY: 'hYQjendf94fwU2CPJIDO6ywKCpk1zSGB',
    SERVER_KEY: 'JN97kOrAcLB3kN5stWF8Ry1AQo0KEC9V',
    courseCover: ["https://edu-image.nosdn.127.net/8A2FD753FE609F6F62064E95F74432E6.jpg?imageView&thumbnail=426y240&quality=100", "https://edu-image.nosdn.127.net/A065FC17D39ACEB56C1A94FAF6A3F543.png?imageView&thumbnail=426y240&quality=100", "https://edu-image.nosdn.127.net/F308633278694316BDBD61A1D74E8532.png?imageView&thumbnail=510y288&quality=100"],
    md5: require("/utils/md5.js"),
    base64: require("/utils/base64.js"),
    callbackData: {},
    signid: '',
    stuInfo:{},
    chapterId: 0,
    courseId: 0,
    courseName: '',
    coursNameC: '',
    chosenType: '',
    navType: '',
    commentList: [{avatarUrl:'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/ee.jpg', time: "18:00:00", name: "ll2017025122", content: "讲得好啊" }, {avatarUrl:'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/ff.jpg', time: "18:22:33", name: "lys2017025123", content: "很棒！" }, {avatarUrl:'https://imageview.oss-cn-shanghai.aliyuncs.com/image/swiper_img/gg.jpg', time: "18:33:44", name: "szh2017025124", content: "点赞！" }],
    courseImg: [{id:0,url:'/img/timg(2).jpg'}, {id:1,url:'/img/Ccover.jpg'}, {id:2,url:'/img/timg(1).jpg'}],
    isShow:wx.getStorageSync('isShow')
  },
  onError: function (err) {
    console.log(err)

  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    //从缓存中取出token
    const token = wx.getStorageSync(TOKEN)
    //判断token是否有值
    if (token && token.length !== 0) {
      //已经有token，验证过期
      this.check_token(token)
    } else {
      this.login()
    }
  },
  check_token(token) {
    console.log("执行了验证token操作" + "token为" + token);
      wx.getUserInfo({
        success: (res) => {
          this.globalData.userInfo = res.userInfo
        }
      });
    this.loginLogPost();
    this.queryCheck()
  },
  queryCheck() {
    let rdata = common.rdataAcp("QueryOpenid", {
      "openid": wx.getStorageSync('openId')
    });
    this.ruquestApi(rdata, this.callbackFun);
  },
  login() {
    let that = this;
    console.log("执行了登陆操作");
    wx.login({
      success: (res) => {
        //1.获取code
        let rdata = common.rdataAcp("Code2Session", { "code": res.code });
        console.log(rdata)
        let pdata = { "CLIENT_ID": that.globalData.CLIENT_ID, "TIMESTR": that.GetTimeStr(), "DATA": that.DataEncode(rdata), "SIGN": "" };
        pdata["SIGN"] = that.globalData.md5(that.globalData.CLIENT_ID + pdata["DATA"] + pdata["TIMESTR"] + that.globalData.CLIENT_KEY).toUpperCase();
        //将code发送给服务器
        wx.request({
          url: 'https://api.wechat.loswork.iw3c.top/',
          method: 'POST',
          data: pdata,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            // 取出token
            res = res.data;
            if (that.ServerSignCheck(res)) {
              var _rdata = that.DataDecode(res["DATA"]);
            }
            console.log(_rdata);
            //将token和openId保存在globalData中
            that.globalData.token = _rdata.session_key;
            that.globalData.openId = _rdata.openid;

            //本地存储
            wx.setStorageSync('openId', _rdata.openid);
            wx.setStorageSync(TOKEN, _rdata.session_key)
          },
          fail: (err) => {
            console.log(err);
          }
        })
      }
    })
  },
  GetTimeStr() {
    var tmp = Date.parse(new Date()).toString();
    tmp = tmp.substr(0, 10);
    return tmp;
  },
  DataEncode(data) {
    var bdata = JSON.stringify(data);
    bdata = this.globalData.base64.Base64.encode(bdata);
    return bdata;
  },

  DataDecode(data) {
    var bdata = this.globalData.base64.Base64.decode(data);
    bdata = JSON.parse(bdata);
    return bdata;
  },

  ServerSignCheck(res) {
    var that = this;
    var _sign = that.globalData.CLIENT_ID + res["DATA"] + res["TIMESTR"] + that.globalData.SERVER_KEY;
    _sign = that.globalData.md5(_sign);
    _sign = _sign.toUpperCase();
    if (_sign != res["SIGN"]) {
      console.log("验证签名失败!");
      return false;
    }
    else return true;
  },
  ruquestApi(rdata, callback) {
    var that = this;
    let pdata = { "CLIENT_ID": that.globalData.CLIENT_ID, "TIMESTR": that.GetTimeStr(), "DATA": that.DataEncode(rdata), "SIGN": "" };
    pdata["SIGN"] = that.globalData.md5(that.globalData.CLIENT_ID + pdata["DATA"] + pdata["TIMESTR"] + that.globalData.CLIENT_KEY).toUpperCase();
    wx.request({
      url: 'https://api.wechat.loswork.iw3c.top/',
      method: 'POST',
      data: pdata,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (that.ServerSignCheck(res.data)) {
          var _rdata = that.DataDecode(res.data["DATA"]);
        }
        callback && callback(_rdata);
        console.log(_rdata);
        if (_rdata.code != '0') {
          wx.showToast({
            title: '登陆请求失败',
            icon: 'none',
            duration: 1500,
            mask: false,
          })
        }
        that.globalData.stuInfo = _rdata.UserInfo;
        
        if (_rdata.UserInfo) {
          wx.setStorageSync('realname', _rdata.UserInfo.realname)
          wx.setStorageSync('stuid', _rdata.UserInfo.stuid)
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: 'fail',
          icon: 'none',
          duration: 1000
        })
      },
    })
  },
  // 回调函数接收request后的数据
  callbackFun(res) {
    this.globalData.callbackData = res;
  },
  loginLogPost() {
    let rdata = { "api": "OAuth", "control": "LoginLogPost", "param": { "openid": wx.getStorageSync('openId'), "type": "wechat" } };
    this.ruquestApi(rdata);
  },
})
