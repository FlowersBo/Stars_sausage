// pages/orderList/orderList.js
let app = getApp();
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: [0, app.globalData.StatusBar + 44, app.globalData.StatusBar + 44 + 250, app.globalData.StatusBar + 44 + 400],
    pull: {
      isLoading: false,
      loading: '../../assets/img/pull_refresh.gif',
      pullText: '正在刷新'
    },
    push: {
      isLoading: false,
      loading: '../../assets/img/pull_refresh.gif',
      pullText: ''
    },
    orderList: [],
    pageNum: 1,
    pageSize: 20,
    isFlag: false
  },

  onScorll(event) {
    // console.log(event)
    // console.log(this.selectComponent("#tip").scrolltoupper()); 
    var theScreenHeight = wx.getSystemInfoSync().windowHeight;
    var scale = (theScreenHeight / event.detail.scrollHeight) * 0.3;
    // this.top[0] = -event.detail.scrollTop * (100/90) * scale;
    let top = this.data.top;
    top[1] = (-event.detail.scrollTop * (150 / 90) * scale) + app.globalData.StatusBar + 44;
    top[2] = (-event.detail.scrollTop * (200 / 90) * scale * 2.5) + app.globalData.StatusBar + 44 + 250;
    top[3] = (-event.detail.scrollTop * (250 / 90) * scale * 4) + app.globalData.StatusBar + 44 + 400;
    this.setData({
      top
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let navigationBarHeight = (app.globalData.StatusBar + 88) + 'px';
    console.log(navigationBarHeight);
    that.setData({
      navigationBarHeight
    })
  },

  async orderListFn(pageNum = 1) {
    let {
      data
    } = await (app.http.OrderList({
      customerId: wx.getStorageSync('customerId'),
      pageNum,
      pageSize: that.data.pageSize
    }))
    let orderList = data.list;
    orderList = that.data.orderList.concat(orderList);
    console.log(orderList);
    that.setData({
      orderList,
      total: data.total
    })
    if (orderList.length >= 20) {
      that.setData({
        'push.pullText': '- 上拉加载更多 -',
      })
    } else {
      that.setData({
        'push.pullText': '',
      })
    }
    if (orderList.length <= 0) {
      that.setData({
        isFlag: true
      })
    } else {
      that.setData({
        isFlag: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec();
    // 获取配置参数
    wx.getSystemInfo({
      success(res) {
        let isIpx = res;
        console.log('配置参数', isIpx);
        that.setData({
          isIpx
        })
        // 获取屏幕的大小
        let windowHeight = wx.getSystemInfoSync().windowHeight;
        let windowWidth = wx.getSystemInfoSync().windowWidth;
        console.log(windowWidth, windowHeight);

        wx.createSelectorQuery().selectAll('.custom').boundingClientRect(function (rect) {
          // console.log('配置参数'.rect);
          let customHeight = rect[0].height;
          that.setData({
            customHeight
          })
        }).exec()
        let btnTop = isIpx ? windowHeight - 134 : windowHeight - 100;
        let btnLeft = windowWidth - 45;
        that.setData({
          windowHeight,
          windowWidth,
          btnLeft,
          btnTop
        })
      }
    })
  },

  gotoOrderDetailFn(e) {
    console.log(e)
    let orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId=' + orderId,
    })
  },

  bindnavFn(e) {
    let btn = e.currentTarget.dataset.btn,
      orderId = e.currentTarget.dataset.orderid;
    if (btn === '0') {
      app.http.Recreate(
          orderId
        )
        .then(res => {
          wx.navigateTo({
            url: '../placeOrder/placeOrder?orderId=' + orderId,
          })
        })
        .catch(err => {

        })
    } else {
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId=' + orderId,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 1
    })
    that.setData({
      pageNum: 1,
      orderList: []
    })
    that.orderListFn();
  },


  refresh(e) {
    that.setData({
      pageNum: 1,
      orderList: []
    })
    if (that.data.orderList.length <= 0) {
      that.setData({
        'push.pullText': '',
        'pull.isLoading': true,
        'pull.loading': '../../assets/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
      })
      that.orderListFn();
      setTimeout(() => {
        that.setData({
          'pull.loading': '../../assets/img/finish.png',
          'pull.pullText': '刷新完成',
          'pull.isLoading': false
        })
      }, 1000)
    }
  },


  toload() {
    let pageNum = that.data.pageNum;
    let total = that.data.total;
    if (that.data.orderList.length < total) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../assets/img/pull_refresh.gif',
      })
      pageNum++;
      pageNum = String(pageNum);
      console.log(pageNum)
      that.orderListFn(pageNum);
      setTimeout(() => {
        that.setData({
          pageNum: pageNum,
          'push.isLoading': false,
          'push.pullText': '- 上拉加载更多 -',
          'push.loading': '../../assets/img/finish.png',
        })
      }, 1500)
    } else if (that.data.orderList.length > 0 && (pageNum * that.data.pageSize) > total) {
      that.setData({
        'push.isLoading': false,
        'push.pullText': '- 我也是有底线的 -'
      })
    }
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