  // pages/orderDetail/orderDetail.js
  let that;
  import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
  import {
    kmUnit
  } from '../../utils/util';
  import {
    getDate
  } from '../../utils/util';
  let dayjs = require('dayjs')
  const app = getApp();

  Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      that = this;
      this.mask = this.selectComponent('#mask');
      let bol = dayjs().isBefore(dayjs('2022-07-18'));
      console.log(bol)
      console.log(options.orderId)
      that.setData({
        orderId: options.orderId
      })

    },

    refundFn: function (e) {
      console.log(e)
      let btnId = e.currentTarget.dataset.id;
      let isAll = false;
      if (btnId == 0) {
        isAll = false
      } else {
        isAll = true
      }
      app.http.RefundShow({
          isAll,
          orderId: that.data.orderId
        })
        .then(res => {
          console.log('弹窗', res)
          that.setData({
            btnId,
            isAll,
            refundDetail: res.data
          })
          this.mask.util('open');
        })
    },

    statusNumberFn: e => {
      console.log(e)
      let btnStatus = e.detail.status;
      if (btnStatus == 0) {
        let isAll = that.data.isAll;
        if (that.data.btnId == 0) {
          isAll = false
        }
        app.http.Refund({
            orderId: that.data.orderId,
            isAll
          })
          .then(res => {
            console.log('退款成功', res);
            that.orderDetailFn(that.data.orderId);
          })
          .catch(err => {

          })
      }
    },

    // 跳转导航
    gotoNavigation() {
      // setTimeout(function () {
      app.sliderightupshow(this, 'slide_up1', 80, -180, 1);
      // }.bind(this), 1);

      setTimeout(function () {
        // wx.openLocation({
        //   latitude: Number(that.data.order.pointCoordinate[0]), //维度
        //   longitude: Number(that.data.order.pointCoordinate[1]), //经度
        //   name: that.data.order.pointName, //目的地定位名称
        //   scale: 18, //缩放比例
        //   address: that.data.order.address //导航详细地址
        // })
        let key = '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V'; //使用在腾讯位置服务申请的key
        let referer = '星斗锦绣肠'; //调用插件的app的名称
        let endPoint = JSON.stringify({ //终点
          'name': that.data.pointName,
          'latitude': Number(that.data.order.pointCoordinate[0]),
          'longitude': Number(that.data.order.pointCoordinate[1])
        });
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        });
      }, 100)
    },

    async orderDetailFn(orderId) {
      let {
        data
      } = await (app.http.Detail({
        orderId,
        coordinate: `${wx.getStorageSync('loaction').latitude},${wx.getStorageSync('loaction').longitude}`
      }));
      // let overallPrice = 0,
      //   price = 0;
      // data.detail.forEach(element => {
      //   price += Number(element.price);
      // });
      // overallPrice = price.toFixed(2)
      // data.order.orderdate = getDate(data.order.orderdate);
      // if (data.order.shipDate) {
      //   data.order.shipDate = getDate(data.order.shipDate);
      // }
      console.log('订单详情', data);
      wx.hideLoading()
      wx.hideNavigationBarLoading() //在标题栏中隐藏加载
      wx.stopPullDownRefresh()
      data.distance = kmUnit(Number(data.distance));
      data.pointCoordinate = data.pointCoordinate.split(",");
      that.setData({
        // overallPrice,
        order: data,
        commodityImg: data.detail[0].pictureUrl,
        pointName: data.pointName,
      })
    },

    cancelOrderFn(e) {
      let orderstatus = e.currentTarget.dataset.orderstatus;
      Dialog.confirm({
        title: '取消订单',
        message: `${orderstatus==='W'?'当前烤肠已经烤制，是否确认取消当前订单?':'您确认取消当前订单吗?'}`,
        theme: 'round-button',
      }).then(() => {
        app.http.Cancel(
            that.data.orderId
          )
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              wx.showToast({
                title: '取消成功',
                icon: 'none',
                duration: 1000
              })
              that.orderDetailFn(that.data.orderId);
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
      }).catch(err => {
        console.log(err)
      });
    },

    makePhoneFn() {
      wx.makePhoneCall({
        phoneNumber: '4008800975',
        fail(err) {

        }
      })
    },

    gotoEvaluateFn() {
      wx.navigateTo({
        url: '../evaluate/evaluate?orderId=' + that.data.orderId + '&commodityImg=' + that.data.commodityImg + '&pointName=' + that.data.pointName,
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
      that.orderDetailFn(that.data.orderId);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      setTimeout(function () {
        app.sliderightupshow(this, 'slide_up1', 0, 0, 1);
      }.bind(this), 101);
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
      that.orderDetailFn(that.data.orderId);
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
      let scene = "1559467227550318592%2C0";
      return {
        title: '我在购买烤肠，帮忙点击下哦！抢购优惠券，分享还能再得优惠券~',
        path: `/pages/coupon/coupon?scene=${scene}`,
        imageUrl: 'http://file.xinghuitrip.com/mp/user-share.png'
      }
    }
  })