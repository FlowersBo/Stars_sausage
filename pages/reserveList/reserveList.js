// pages/reserveList/reserveList.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let qqmap;
let that;
import {
  kmUnit,
  unfreezeNavigateTo
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
    mpOpenId: ''
  },

  numBtn(e) {
    if (e.detail === "plus") {
      Dialog.confirm({
        title: '提示',
        message: '已超出当前最大预订库存，请稍后再试！',
        theme: 'round-button',
        showCancelButton: false,
        confirmButtonText: '取消'
      })
    }
  },

  bindPlusFn(e) {
    that.addSubtractFn('add', e.currentTarget.dataset.id, e.currentTarget.dataset.channel);
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
    that.addSubtractFn('', e.currentTarget.dataset.id, e.currentTarget.dataset.channel);
    that.setData({
      num: that.data.num - 1
    })
  },

  addSubtractFn(add, id, channel) {
    let products = that.data.products;
    console.log(channel);
    let overallPrice = 0;
    let price = 0,
      count = 0;
    let storeA = that.data.storeA,
      storeB = that.data.storeB,
      totalLimit = that.data.totalLimit;
    products.forEach(element => {
      if (element.id === id && element.channel === channel) {
        if (add) {
          console.log(element.productCount + 1, element.store[0])
          element.productCount = element.productCount + 1;
          if (Number(element.store[3]) > 0 && element.productCount > Number(element.store[3]) && element.productCount < Number(element.store[3]) + 2) {
            wx.showToast({
              title: '超出烤好数量，将需等待',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          element.productCount = element.productCount - 1
        }
      }
      price += Number((element.factAmount * element.productCount));
      count += Number((element.productCount))
    });
    console.log('累加', count)
    console.log('总数', totalLimit)
    products.forEach(element => {
      if (count >= totalLimit) {
        element.isPlus = true;
      } else {
        element.isPlus = false;
        if (element.store[1])
          element.isPlus = true;
        else
          element.isPlus = false;
      }
    });
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
      coordinate: that.data.mpOpenId ? '' : (wx.getStorageSync('loaction').latitude + ',' + wx.getStorageSync('loaction').longitude),
      isAgency: true,
      deviceId: that.data.deviceId ? that.data.deviceId : ''
    }));
    console.log('设备列表', data);
    // if (that.data.deviceId) {
    //   data[0].distance = kmUnit(Number(data[0].distance));
    //   that.setData({
    //     deviceDetail: data[0]
    //   })
    //   // data.forEach(element => {
    //   //   element.distance = kmUnit(Number(element.distance));
    //   //   if (element.deviceId === that.data.deviceId) {
    //   //     that.setData({
    //   //       deviceDetail: element,
    //   //       distance: element.distance,
    //   //     })
    //   //     if (that.data.mpOpenId) {
    //   //       const loaction = {};
    //   //       loaction.latitude = Number(element.coordinate.split(",")[0]);
    //   //       loaction.longitude = Number(element.coordinate.split(",")[1]);
    //   //       wx.setStorageSync('loaction', loaction);
    //   //     }
    //   //     that.shopListFn(element.deviceId);
    //   //   }
    //   // });
    // } else {
    //   if (data[0].distance) {
    //     data[0].distance = kmUnit(Number(data[0].distance));
    //   }
    //   that.setData({
    //     deviceDetail: data[0],
    //     deviceId: data[0].deviceId
    //   })
    // }
    if (data.length <= 0) {
      that.setData({
        isShow: true
      })
      return
    }
    data[0].distance = kmUnit(Number(data[0].distance));
    that.setData({
      isShow: false,
      deviceDetail: data[0],
      distance: data[0].distance,
      deviceId: data[0].deviceId
    })
    that.shopListFn(data[0].deviceId);
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
    let aIceStatus = data.aIceStatus,
      bIceStatus = data.bIceStatus,
      aHasRoast = data.aHasRoast,
      bHasRoast = data.bHasRoast;
    // Object.values(form)//将form对象转化数组，返回值是form值的数组
    [
      [data.storeA, aIceStatus, {
        storeA: data.storeA
      }, aHasRoast],
      [data.storeB, bIceStatus, {
        storeB: data.storeB
      }, bHasRoast]
    ].forEach((element, key) => {
      for (var p in element[2]) {
        data.products.forEach((el, k) => {
          if (el.channel === p.substr(p.length - 1, 1)) {
            el.store = element
          }
        });
      }
    });
    console.log('返回新list', data.products)
    data.products.forEach(element => {
      if (data.totalLimit <= 0) {
        element.isPlus = true;
      } else {
        element.isPlus = false;
        if (element.store[1]) {
          element.isPlus = true;
        } else {
          element.isPlus = false;
        }
      }
    });
    that.setData({
      device: data,
      deviceStatus: data.deviceStatus,
      inMaintenance: data.inMaintenance,
      products: data.products,
      storeA: data.storeA,
      storeB: data.storeB,
      totalLimit: data.totalLimit,
      overallPrice: 0,
      num: 0
    })

    if (data.deviceStatus && data.inMaintenance) {
      setTimeout(function () {
        wx.showToast({
          title: '很抱歉，当前设备正在维护中，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      }, 500)
      return
    }
    if (!data.deviceStatus) {
      setTimeout(function () {
        wx.showToast({
          title: '很抱歉，当前设备暂不可预订，您可切换点位购买',
          icon: 'none',
          duration: 3000
        })
      }, 500)
    }
  },

  gotoPlaceOrderFn() {
    if (!that.data.deviceStatus || (that.data.deviceStatus && that.data.inMaintenance)) {
      wx.showToast({
        title: '当前设备不可购买',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.overallPrice > 0) {
      Dialog.confirm({
        title: '提示',
        message: `确定取餐地点为${that.data.deviceDetail.address}吗？`,
        theme: 'round-button',
      }).then(() => {
        that.createOrderFn();
      }).catch(() => {})
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
                Dialog.confirm({
                  title: '提示',
                  message: `确定取餐地点为${that.data.deviceDetail.address}吗？`,
                  theme: 'round-button',
                }).then(() => {
                  that.createOrderFn();
                }).catch(() => {})
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
      itemBeans[key].stock = element.channel;
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
      unfreezeNavigateTo({
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
    if (!wx.getStorageSync('isLoaction')) {
      that.getSelfLocation();
      return
    }
    // if (that.data.pageRoute) {
    unfreezeNavigateTo({
      url: 'pages/facilityListMap/facilityListMap'
    });
    // wx.navigateTo({
    //   url: '/pages/facilityListMap/facilityListMap',
    // })
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this;
    qqmap = new QQMapWX({
      key: '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V'
    })
    let mpOpenId = options.mpOpenId;
    if (!mpOpenId) {
      mpOpenId = '';
    }
    that.setData({
      mpOpenId
    })
    if (options.deviceId) {
      that.setData({
        deviceId: options.deviceId
      })
    }
    // that.facilityListFn();
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

    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    // if (prevPage.route == 'pages/facilityList/facilityList') {
    //   that.setData({
    //     pageRoute: ''
    //   })
    // } else {
    //   that.setData({
    //     pageRoute: prevPage.route
    //   })
    // }
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
    that.authFn(that.data.mpOpenId);
    that.getSelfLocation();
  },

  //获取位置
  getSelfLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        const loaction = {};
        loaction.latitude = res.latitude;
        loaction.longitude = res.longitude;
        // loaction.latitude = 39.95837890625;
        // loaction.longitude = 116.49010823567708;
        wx.setStorageSync('loaction', loaction);
        that.getUserLocation(loaction.latitude, loaction.longitude);
      },
      fail: function (res) {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation']) {
              Dialog.confirm({
                title: '位置信息授权',
                message: '您需要授权位置信息获取附近点位',
                theme: 'round-button',
                confirmButtonOpenType: 'openSetting'
              }).then(() => {
                wx.setStorageSync('isLoaction', true);
              }).catch(() => {
                wx.setStorageSync('isLoaction', false);
              });
            }
          }
        })
      }
    });
  },

  // 获取用户当前位置
  getUserLocation(latitude, longitude) {
    qqmap.reverseGeocoder({ //逆地址解析（经纬度 ==> 坐标位置）
      location: {
        latitude,
        longitude
      },
      success(res) {
        console.log(res);
        let adcode = res.result.ad_info.adcode;
        // adcode = adcode.slice(0,4)
        wx.setStorageSync('adcode', adcode);
        wx.setStorageSync('province', res.result.ad_info.province);
        that.facilityListFn();
      }
    })
  },

  authFn(mpOpenId = '') {
    console.log('传参', mpOpenId)
    wx.login({
      success: res => {
        app.http.Auth({
            code: res.code,
            mpOpenId
          })
          .then(res => {
            wx.setStorageSync('customerId', res.data.id);
            wx.setStorageSync('phoneNumber', res.data.phone);
          })
      }
    })
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
  // onShareAppMessage: function () {

  // }
})