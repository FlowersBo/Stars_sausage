// pages/evaluate/evaluate.js
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */  data: {
    starNum: 5,
    fieldVal: '',
    message: '',
    fileList: [],
  },

  onChange(event) {
    this.setData({
      starNum: event.detail,
    });
    console.log('星数', event.detail)
  },

  fieldFn(e) {
    console.log(e.detail.value)
    this.setData({
      fieldVal: e.detail.value,
    });
  },

  afterRead(event) {
    console.log(event)
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: `${app.http.baseUrl}/reserve/common/upload`, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = that.data;
        fileList.push({ ...file, url: JSON.parse(res.data) });
        console.log(file) 
        console.log(fileList)
        that.setData({ fileList });
      },
    });
  },

  readPhoto(event){
    console.log(event)
  },

  deletePhoto(event){
    console.log(event)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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