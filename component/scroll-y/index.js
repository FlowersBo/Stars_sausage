function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    var thisArg = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(thisArg, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
/*函数防抖*/
function debounce(fn, interval) {
  var timer;  
  var gapTime = interval || 200;//间隔时间，如果interval不传，则默认200ms
  return function() {
    clearTimeout(timer);
    var thisArg = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      console.log(args)
      fn.call(thisArg,args);
    }, gapTime);
  };
}

Component({
  options: {
    multipleSlots: true, // 在组建定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    listLength: {
      type: Number,
      value: 0
    },
    pull: {
      type: Object,
      value: {}
    },
    push: {
      type: Object,
      value: {}
    },
    scrollTopNum: {
      type: Number
    }
  },
  /**组件所在页面的生命周期声明对象 */
  pageLifetimes: {
    show() { // 页面被展示
      this.setData({
        pull: this.properties.pull,
        push: this.properties.push,
      })
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    pull: {},
    push: {},
    slideStart: [],
    moveTime: 0,
  },


  /**自定义方法 */
  methods: {

    ready: function (scrollTopNum) {
      console.log(scrollTopNum);
      this.setData({
        scrollTopNum: scrollTopNum
      })
    },

    /**开始滑动 */
    touchstart(e) {
      /**记录开始滑动的时间 */
      this.setData({
        slideStart: e.touches[0]
      })
    },

    // 获取滚动条当前位置
    scrolltoupper: debounce(function (res) {
      // this.triggerEvent('scrollTopFn', {
      //   scrollTop: res[0].detail.scrollTop
      // })
    }),


    // scrolltoupper: function (e) {
    //   let scrollTop = e.detail.scrollTop;
    //   this.triggerEvent('scrollTopFn', {
    //     scrollTop: scrollTop
    //   })
    // },


    /**滑动 */
    touchmove(e) {
      let moveTime = new Date().getTime(); // 当前时间
      if (moveTime - this.data.moveTime <= 2000) {
        return
      } else {
        this.setData({
          moveTime: moveTime
        })
      }
      let slideStart = this.data.slideStart;
      let slideMove = e.touches[0];
      let startX = slideStart.pageX;
      let startY = slideStart.pageY;
      let moveEndX = slideMove.pageX;
      let moveEndY = slideMove.pageY;
      let X = moveEndX - startX;
      let Y = moveEndY - startY;
      if (Math.abs(Y) > Math.abs(X) && Y > 0) { // 从上向下滑
        console.log("top 2 bottom");
        this.pullRefresh()
      } else if (Math.abs(Y) > Math.abs(X) && Y < 0) { // 从下向上滑
        console.log("bottom 2 top");
        this.loadMore()
      }
    },
    /**下拉刷新 */
    pullRefresh(e) {
      this.triggerEvent('refresh', {
        refresh: true
      }) // 将refresh通过参数的形式传递给父组件
    },
    /**上拉加载更多 */
    loadMore(e) {
      this.triggerEvent('toload', {
        toload: true
      }) // 将toload通过参数的形式传递给父组件
    }
  }
})