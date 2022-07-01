// pages/facilityListMap/addressSearch/addressSearch.js
let that;
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
    that.setData({
      cityCode: options.cityCode
    })
    that.cityFn();
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