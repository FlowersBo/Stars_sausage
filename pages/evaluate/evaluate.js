// pages/evaluate/evaluate.js
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starNum: 5,
    fieldVal: '',
    fieldVal: '',
    fileList: [],
    isShow: false
  },

  onChange(event) {
    this.setData({
      starNum: event.detail,
    });
  },

  fieldFn(e) {
    this.setData({
      fieldVal: e.detail,
    });
  },

  afterRead(event) {
    that.setData({
      isShow: true
    })
    let i = 0;
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    file.forEach(element => {
      wx.uploadFile({
        url: `${app.http.baseUrl}/reserve/common/upload`,
        filePath: element.url,
        name: 'file',
        formData: {
          user: 'test'
        },
        success(res) {
          i++;
          const {
            fileList = []
          } = that.data;
          fileList.push({
            ...element,
            url: JSON.parse(res.data).data
          });
          console.log(file)
          console.log(fileList)
          that.setData({
            fileList
          })
          if (i >= file.length) {
            that.setData({
              isShow: false
            })
          }
        },
      });
    });

  },

  readPhoto(event) {},

  deletePhoto(event) {
    let fileList = that.data.fileList;
    fileList.splice(event.detail.index, 1);
    that.setData({
      fileList
    })
    // fileList.forEach((element,key) => {
    //   if(element.url===event.detail.file.url){
    //     fileList.splice(key,1);
    //     that.setData({
    //       fileList
    //     })
    //     return false
    //   }
    // });
  },

  submitFrom() {
    let pic = [],
      fileList = that.data.fileList;
    fileList.forEach(element => {
      pic.push(element.url)
    });
    console.log(pic)
    app.http.Suggest({
        orderId: that.data.orderId,
        grade: that.data.starNum,
        content: that.data.fieldVal,
        pic
      })
      .then(res => {
        if (res.code == 200) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      orderId: options.orderId,
      commodityImg: options.commodityImg,
      pointName: options.pointName
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