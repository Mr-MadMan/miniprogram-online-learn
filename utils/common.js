function rdataAcp( control, params){
  let rdata = { "api": "OAuth", "control": control, "param": params};
  return rdata;
}

function pdataAcp(){
  let CLIENT_ID = 'zkTqG7Sh';
  let pdata = { "CLIENT_ID": CLIENT_ID, "TIMESTR": GetTimeStr(), "DATA": DataEncode(rdata), "SIGN": "" };
}
function GetTimeStr() {
  var tmp = Date.parse(new Date()).toString();
  tmp = tmp.substr(0, 10);
  return tmp;
}
function DataEncode(data) {
  var bdata = JSON.stringify(data);
  bdata = this.globalData.base64.Base64.encode(bdata);
  return bdata;
}

function DataDecode(data) {
  var bdata = this.globalData.base64.Base64.decode(data);
  bdata = JSON.parse(bdata);
  return bdata;
}

function ServerSignCheck(res) {
  var that = this;
  var _sign = that.globalData.CLIENT_ID + res["DATA"] + res["TIMESTR"] + that.globalData.SERVER_KEY;
  _sign = that.globalData.md5(_sign);
  _sign = _sign.toUpperCase();
  if (_sign != res["SIGN"]) {
    console.log("验证签名失败!");
    return false;
  }
  else return true;
}
module.exports = {
  rdataAcp:rdataAcp,
  pdataAcp:pdataAcp
}