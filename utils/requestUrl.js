const app = getApp();
const FN = require('./public');
const Request = (url, data, method) => {
  return new Promise((resolve, reject) => {
    FN.Loading(1);
    wx.request({
      url: url || '',
      data: data || {},
      method,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      timeout: 20000,
      success(res) {
        console.log(res)
        FN.LoadingOff();
        if (res.statusCode === 200) {
          if (res.data.status === "200") {
            resolve(res.data);
          } else {
            FN.Toast(res.data.message);
          };
        }else if(res.statusCode === 404){
          FN.Toast('请求错误');
        } else {
          FN.Toast(res.errMsg);
        };
      },
      fail(res) {
        FN.Toast("网络开小差了");
        reject(res);
      }
    })
  })
};

module.exports = {
  Request
};