// pages/facilityListMap/facilityListMap.js
import {
  kmUnit,
  unfreezeNavigateTo
} from '../../utils/util';
const app = getApp()
let that;

Page({
  data: {
    point: '',
    pointName: '',
    isFlag: false,
    isShow: true,
    equipmentStatusList: [],
    scale: 16,
    city: wx.getStorageSync('province'),
    isSearch: false,
    adcode: wx.getStorageSync('adcode'),
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {},

  scroll(e) {
    // console.log('滚动', e);
    let scrollTop = e.detail.scrollTop;
    let scrollArr = this.data.equipmentList;
    if (scrollTop >= scrollArr[scrollArr.length - 1] - (this.data.viewHeight / 3)) {
      return;
    } else {
      for (let i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          // selectFloorIndex控制筛选块高亮显示
          this.setData({
            selectFloorIndex: 0
          });
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
          this.setData({
            selectFloorIndex: i
          });
        }
      }
    }
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },


  async facilityListFn() {
    try {
      let {
        data
      } = await (app.http.Near({
        coordinate: `${wx.getStorageSync('loaction').latitude},${wx.getStorageSync('loaction').longitude}`,
        // point: that.data.point,
        // pointName: that.data.pointName,
        isAgency: false,
        region: `${that.data.cityValue?that.data.cityValue.value:wx.getStorageSync('adcode')}`,
      }))
      if (data.length > 0) {
        data.forEach(element => {
          element.mid = `m${element.id}`;
          element.distance = kmUnit(Number(element.distance));
          element.longitude = Number(element.coordinate.split(',')[1]);
          element.latitude = Number(element.coordinate.split(',')[0]);
          element.id = Number(element.id);
          element.width = 30;
          element.height = 32;
          element.iconPath = '/assets/img/map.png';
          element.joinCluster = true;
          element.callout = {
            content: element.name,
            display: 'ALWAYS',
            padding: '6px',
            borderRadius: '20px',
            color: '#fff',
            bgColor: '#FFB606'
          }
        });
        that.setData({
          isFlag: false,
          equipmentList: data,
          scale: 16
        })
        if (that.data.isSearch) {
          that.setData({
            longitude: data[0].longitude,
            latitude: data[0].latitude
          })
          that.equipmentFn('', data[0].id);
        }
        that.bindEvent();
        that.deviceStatusFn(data);
      } else {
        that.setData({
          isFlag: true,
          equipmentList: [],
          scale: 9
        })
      }
    } catch (err) {
      that.setData({
        isFlag: true,
        equipmentList: []
      })
    }
  },

  bindEvent() {
    // this.mapCtx.initMarkerCluster({
    //   enableDefaultStyle: true,
    //   zoomOnClick: true,
    //   gridSize: 60,
    //   complete(res) {
    //     console.log('initMarkerCluster', res)
    //   }
    // })
    console.log(that.data.equipmentList);
    this.mapCtx.addMarkers({
      markers: that.data.equipmentList,
      clear: true,
      complete(res) {
        console.log('addMarkers', res)
      }
    })
  },

  markertap(e) {
    console.log('地图点击标记', e);
    let equipmentList = that.data.equipmentList;
    console.log(equipmentList)
    equipmentList.forEach(element => {
      if (e.detail.markerId == element.id) {
        that.setData({
          mid: element.mid
        })
        let elementDataId = element.id;
        that.equipmentFn('', elementDataId);
      }
    });
  },


  equipmentFn(e, elementDataId) {
    console.log(e);
    let equipmentList = that.data.equipmentList;
    equipmentList.forEach(element => {
      if ((elementDataId ? elementDataId : e.currentTarget.dataset.id) === element.id) {
        element.isShow = true;
        element.iconPath = '/assets/img/mapOn.png';
        element.callout.bgColor = '#EF6819';
        this.mapCtx.moveToLocation({
          longitude: element.longitude,
          latitude: element.latitude,
          complete(res) {
            console.log(res)
          }
        })
        console.log(element);
        that.setData({
          deviceId: element.deviceId
        })
      } else {
        element.isShow = false;
        element.iconPath = '/assets/img/map.png';
        element.callout.bgColor = '#FFB606';
      }
    });
    that.setData({
      equipmentList
    })

    this.mapCtx.addMarkers({
      markers: equipmentList,
      clear: true,
      complete(res) {
        console.log(res)
      }
    })
  },

  // 状态
  deviceStatusFn(equipmentList) {
    let equipmentStatusList = [];
    equipmentList.forEach(element => {
      app.http.Status({
          deviceId: element.deviceId
        })
        .then(res => {
          let data = {};
          data.id = element.id;
          data.status = res.data;
          equipmentStatusList = equipmentStatusList.concat(data);
          that.setData({
            equipmentStatusList,
          })
        })
        .catch(err => {

        })
    })
  },

  async cityFn() {
    let result = await (app.http.GetCity());
    console.log('城市列表', result)
    let cityList = [],
      cityListData = [];
    for (let key in result.data) {
      cityListData.push({
        label: result.data[key],
        value: key
      })
      cityList.push(result.data[key])
    }
    that.setData({
      cityList,
      cityListData
    })
  },

  // 城市选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      cityValue: that.data.cityListData[e.detail.value],
      isSearch: true
    })
    that.facilityListFn();
  },

  gotoReserveListFn(e) {
    if (!this.data.deviceId) {
      wx.showToast({
        title: that.data.isFlag ? '附近暂无点位' : '请选择点位后下单',
        icon: 'none',
        duration: 2000
      })
      return
    }
    unfreezeNavigateTo({
      url: 'pages/reserveList/reserveList?deviceId=' + this.data.deviceId
    });
    console.log(this.data.deviceId)
    // wx.navigateTo({
    //   url: '../reserveList/reserveList?deviceId=' + this.data.deviceId
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      statusBarHeight: app.globalData.StatusBar + 'px',
      navigationBarHeight: (app.globalData.StatusBar + 44) + 'px'
    })
    that.facilityListFn();
    that.cityFn();
    that.setData({
      longitude: wx.getStorageSync('loaction').longitude,
      latitude: wx.getStorageSync('loaction').latitude,
      viewHeight: app.globalData.screenHeight
    })
    this.mapCtx = wx.createMapContext('map');
  },


  //导航
  showModal(e) {
    console.log('当前id', e)
    that.data.equipmentList.forEach(element => {
      if (e.currentTarget.dataset.id === element.id) {
        let plugin = requirePlugin('routePlan');
        let key = '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V';
        let referer = '星斗锦绣肠';
        let mode = 'walking';
        let themeColor = '#FFB606';
        let endPoint = JSON.stringify({
          'name': element.name,
          'latitude': element.latitude,
          'longitude': element.longitude
        });
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&mode=' + mode + '&themeColor=' + themeColor
        });
        // this.mapCtx.openMapApp({
        //   longitude: element.longitude,
        //   latitude: element.latitude,
        //   destination: element.name
        // })
      }
    });
  },

  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  gotoAddressSerach(e) {
    console.log(e)
    wx.navigateTo({
      url: './addressSearch/addressSearch?cityCode=' + e.currentTarget.dataset.citycode + '&city=' + e.currentTarget.dataset.city,
    })
  },

  //点击获取更多
  // tapAddList() {
  //   let isAgency = false;
  //   that.facilityListFn(isAgency);
  //   that.setData({
  //     isShow: !that.data.isShow,
  //     equipmentStatusList: []
  //   })
  // },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(function () {
      wx.createSelectorQuery().select('.equipmentList').boundingClientRect(function (rect) {
        console.log(rect)
      }).exec()
    }, 2000)
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
  // onShareAppMessage: function () {

  // }
})