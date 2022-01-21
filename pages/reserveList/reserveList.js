// pages/reserveList/reserveList.js
let that;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhone: false,
    num: 0,
    overallPrice: 0.00
  },

  bindPlusFn(e) {
    that.addSubtractFn('add', e.currentTarget.dataset.merchantid);
    that.setData({
      start: 'start',
      num: that.data.num + 1
    });
    setTimeout(function () {
      that.setData({
        start: ''
      });
    }, 200)
  },

  bindMinus(e) {
    that.addSubtractFn('', e.currentTarget.dataset.merchantid);
    that.setData({
      num: that.data.num - 1
    })
  },

  addSubtractFn(add, merchantid) {
    let products = that.data.products;
    let overallPrice = 0;
    products.forEach(element => {
      if (element.merchantid === merchantid) {
        if (add) {
          element.itemCount = element.itemCount + 1
        } else {
          element.itemCount = element.itemCount - 1
        }
        overallPrice = (overallPrice + element.factAmount * element.itemCount).toFixed(2);
      }
      that.setData({
        products,
        overallPrice
      })
    });
  },

  async facilityListFn() {
    let {
      data
    } = await (app.http.Near({
      coordinate: `${wx.getStorageSync('loaction').latitude},${wx.getStorageSync('loaction').longitude}`
    }));
    console.log('设备列表', data);
    if (that.data.deviceId) {
      data.forEach(element => {
        element.distance = distance.toFixed();
        if (element.deviceId === that.data.deviceId) {
          that.setData({
            deviceDetail: element
          })
          that.shopListFn(element.deviceId);
        }
      });
    }else{
      data[0].distance = data[0].distance.toFixed();
      that.setData({
        deviceDetail: data[0]
      })
      that.shopListFn(data[23].deviceId);
    }
  },

  async shopListFn(deviceId) {
    let {
      data
    } = await (app.http.Prepare({
      deviceId
    }))
    console.log('商品信息', data);
    data.products.forEach(element => {
      element.itemCount = 0
    });
    that.setData({
      device: data,
      products: data.products
    })
  },

  gotoOrderFn() {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
    })
  },

  getPhoneNumberFn: (e) => {
    console.log(e)
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
    that.facilityListFn();
    wx.getSetting({
      success(res) {
        // 已经授权，可以直接调用
        console.log("授权", res.authSetting);
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isPhone: false
          })
        } else {
          that.setData({
            isPhone: true
          })
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