// pages/reserveList/reserveList.js
let that;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  bindPlusFn(e) {
    console.log('加', e);
    that.addSubtractFn();
    that.setData({
      start: 'start'
    });
    setTimeout(function () {
      that.setData({
        start: ''
      });
    }, 200)
  },

  bindMinus(e) {
    console.log('减', e);
    that.addSubtractFn();
  },

  addSubtractFn() {
    // this.cartWwing();
  },

  async shopListFn() {
    let {
      data
    } = await (app.http.Prepare({
      deviceId: '1346017173243428864'
    }))
    console.log('商品信息', data);
    that.setData({
      device: data
    })
  },


  getPhoneNumberFn: (e) => {
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    if (e.detail.encryptedData) {
      try {
        if (wx.getStorageSync('open_id')) {
          console.log("iv", iv, '\n', "encryptedData", encryptedData)
          // 获取登录用户信息
          const data = {
            encryptedData: encryptedData,
            iv: iv,
            customer_id: customerId,
            specifications,
          }

          app.http.getPhone({})
            .then(res => {
              console.log("授权返回参数", res);
              if (res.data.code == "0") {
                wx.navigateTo({
                  url: '/pages/orderDetail/orderDetail',
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
                wx.hideLoading();
              }
            })
            .catch(rej => {
              console.log(rej)
              wx.showToast({
                title: rej.error,
                icon: 'none',
                duration: 2000
              })
            })
        } else {
          console.log('获取用户手机号失败！');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      //用户按了取消按钮
      wx.showModal({
        title: '提示',
        content: '您点击了拒绝授权，将无法正常使用小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '重新授权'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.shopListFn();
    wx.getSetting({
      success(res) {
        // 已经授权，可以直接调用
        console.log("已授权", res.authSetting);
        if (res.authSetting['scope.userInfo']) {

        }
      }
    })
  },

  cartWwing: function () {
    var animation = wx.createAnimation({
      duration: 100, //动画持续时间
      timingFunction: 'ease-in', //动画以低速开始
    })
    animation.translateX(6).rotate(21).step()
    animation.translateX(-6).rotate(-21).step()
    animation.translateX(0).rotate(0).step()
    this.setData({
      ani: animation.export()
    })

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