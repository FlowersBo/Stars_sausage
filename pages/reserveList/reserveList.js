// pages/reserveList/reserveList.js
let that;
import {
  kmUnit
} from '../../utils/util';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhone: true,
    num: 0,
    overallPrice: 0,
    isPlus: false
  },

  bindPlusFn(e) {
    that.addSubtractFn('add', e.currentTarget.dataset.id);
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
    that.addSubtractFn('', e.currentTarget.dataset.id);
    that.setData({
      num: that.data.num - 1
    })
  },

  addSubtractFn(add, id) {
    let products = that.data.products;
    let overallPrice = 0;
    let price = 0,
      count = 0;
    let storeA = that.data.storeA,
      storeB = that.data.storeB,
      totalLimit = that.data.totalLimit;
    products.forEach(element => {
      if (element.id === id) {
        if (add) {
          element.productCount = element.productCount + 1
        } else {
          element.productCount = element.productCount - 1
        }
      }
      price += Number((element.factAmount * element.productCount));
      count += Number((element.productCount))
    });
    console.log('累加',count)
    console.log('总数', totalLimit)
    if (count >= totalLimit) {
      that.setData({
        isPlus: true
      })
    } else {
      that.setData({
        isPlus: false
      })
    }
    overallPrice = price.toFixed(2)
    that.setData({
      products,
      overallPrice
    })
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
        element.distance = kmUnit(Number(element.distance));
        if (element.deviceId === that.data.deviceId) {
          that.setData({
            deviceDetail: element,
            distance: element.distance,
          })
          that.shopListFn(element.deviceId);
        }
      });
    } else {
      if (data[0].distance) {
        data[0].distance = data[0].distance.toFixed();
      }
      that.setData({
        deviceDetail: data[0],
        deviceId: data[0].deviceId,
        distance: data[0].distance,
      })
      that.shopListFn(data[0].deviceId);
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
      element.productCount = 0;
    });

    [data.storeA, data.storeB].forEach((element, key) => {
      data.products.forEach((el, k) => {
        if (key === k) {
          el.store = element
        }
      });
    });
    if (data.totalLimit <= 0) {
      that.setData({
        isPlus: true
      })
    } else {
      that.setData({
        isPlus: false
      })
    }
    that.setData({
      device: data,
      deviceStatus: data.deviceStatus,
      products: data.products,
      storeA: data.storeA,
      storeB: data.storeB,
      totalLimit: data.totalLimit,
    })
  },

  gotoPlaceOrderFn() {
    if (!that.data.deviceStatus) {
      wx.showToast({
        title: '当前设备不可购买',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.overallPrice > 0) {
      that.createOrderFn();
    } else {
      wx.showToast({
        title: '请选择商品后下单',
        icon: 'none',
        duration: 2000
      })
    }
  },

  getPhoneNumberFn: (e) => {
    if (e.detail.encryptedData) {
      try {
        if (wx.getStorageSync('customerId')) {
          app.http.getPhone({
              customerId: wx.getStorageSync('customerId'),
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
            })
            .then(res => {
              wx.setStorageSync('phoneNumber', res.data.phoneNumber);
              that.setData({
                isPhone: false
              })
              if (that.data.overallPrice > 0) {
                that.createOrderFn();
              } else {
                wx.showToast({
                  title: '请选择商品后下单',
                  icon: 'none',
                  duration: 2000
                })
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
          wx.showToast({
            title: '获取手机号失败',
            icon: 'none',
            duration: 2000
          })
          console.log('获取用户手机号失败！');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您点击了拒绝授权，将无法正常使用小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '重新授权'
      })
    }
  },

  async createOrderFn() {
    let products = that.data.products;
    let itemBeans = [];
    products.forEach((element, key) => {
      itemBeans[key] = {};
      itemBeans[key].productCount = element.productCount;
      itemBeans[key].name = element.productname;
      itemBeans[key].price = element.price;
      itemBeans[key].productId = element.id;
      itemBeans[key].sausageStatus = '';
      itemBeans[key].stock = '';
      itemBeans[key].userStatus = '';
    })
    console.log('商品', itemBeans);
    let {
      data
    } = await (app.http.createOrder({
      deviceId: that.data.deviceId,
      customerId: wx.getStorageSync('customerId'),
      itemBeans: itemBeans
    }));
    console.log('订单号', data)
    if (data) {
      wx.navigateTo({
        url: '/pages/placeOrder/placeOrder?orderId=' + data + '&distance=' + that.data.distance,
      })
    } else {
      wx.showToast({
        title: '创建订单失败',
        icon: 'error',
        duration: 2000
      })
    }
  },

  gotoFacilityList() {
    if (that.data.pageRoute) {
      wx.navigateTo({
        url: '../facilityList/facilityList',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.deviceId) {
      that.setData({
        deviceId: options.deviceId
      })
    }
    that.facilityListFn();
    wx.getSetting({
      success(res) {
        // 已经授权，可以直接调用
        console.log("授权", res.authSetting);
        if (wx.getStorageSync('phoneNumber')) {
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

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage.route == 'pages/facilityList/facilityList') {
      that.setData({
        pageRoute: ''
      })
    } else {
      that.setData({
        pageRoute: prevPage.route
      })
    }
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