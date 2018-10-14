//index.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp.js'); 

Page({
  data: {
    isHideLoadMore: false,
    userInfo: {},
    hasUserInfo: false,
    counter: 0,
    all: [],
    tab: [
      {
        name: '不限',
        select: true,
        xuan: ['不限', '独栋', '联排', 'unit公寓', '土地', '农庄', '农场', '商业']
      },
      {
        name: '不限',
        select: false,
        xuan: ['不限', '市中心', '中区双校网', '中区', '北岸', '北岸西湖校网', '北部郊区', '东区', '西区', '南区', '南部郊区', '其他地区']
      },
      {
        name: '不限',
        select: false,
        xuan: ['不限', '20万以内', '20万-50万', '50万-70万', '70万-90万', '90万-130万', '130万-160万', '160万-200万', '200万-300万', '300万-500万', '500万以上']
      }
    ],
    list: []
  },
  onLoad: function (options) {
    this.logIn();

    this.loadGoods();
  },
  onShow: function (options) {
  },
  onShareAppMessage: function () {
    return {
      title: '奇异租房',
      desc: '买房',
      path: '/pages/buy/buy'
    }
  },
  logIn: function () {
    var that = this;
    AV.User.loginWithWeapp().then(user => {
      app.globalData.user = user.toJSON();
    }).catch(console.error);

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: function () {
          wx.showModal({
            title: '用户未授权',
            content: '您点击了拒绝授权，将无法正常使用发布消息以及我的关注的功能体验。可通过点击确定，在设置中重新授权用户权限。',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    wx.getUserInfo({
                      success: res => {
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                          userInfo: res.userInfo,
                          hasUserInfo: true
                        })
                      },
                    });
                  }
                });
              }
            },
            fail: function (res) {
            }
          })
        }
      })
    }
  },
  loadGoods: function () {
    var that = this
    var query = new AV.Query('BuyProperty');
    if (this.data.tab[0].name == '不限') {
    } else {
      query.contains('type', this.data.tab[0].name);
    }
    if (this.data.tab[1].name == '不限') {
    } else {
      query.contains('location', this.data.tab[1].name);
    }
    if (this.data.tab[2].name == '20万以内') {
      query.lessThanOrEqualTo('price', 20);
    }
    if (this.data.tab[2].name == '20万-50万') {
      query.greaterThanOrEqualTo('price', 20);
      query.lessThanOrEqualTo('price', 50);
    }
    if (this.data.tab[2].name == '50万-70万') {
      query.greaterThanOrEqualTo('price', 50);
      query.lessThanOrEqualTo('price', 70);
    }
    if (this.data.tab[2].name == '70万-90万') {
      query.greaterThanOrEqualTo('price', 70);
      query.lessThanOrEqualTo('price', 90);
    }
    if (this.data.tab[2].name == '90万-130万') {
      query.greaterThanOrEqualTo('price', 90);
      query.lessThanOrEqualTo('price', 130);
    }
    if (this.data.tab[2].name == '130万-160万') {
      query.greaterThanOrEqualTo('price', 130);
      query.lessThanOrEqualTo('price', 160);
    }
    if (this.data.tab[2].name == '160万-200万') {
      query.greaterThanOrEqualTo('price', 160);
      query.lessThanOrEqualTo('price', 200);
    }
    if (this.data.tab[2].name == '200万-300万') {
      query.greaterThanOrEqualTo('price', 200);
      query.lessThanOrEqualTo('price', 300);
    }
    if (this.data.tab[2].name == '300万-500万') {
      query.greaterThanOrEqualTo('price', 300);
      query.lessThanOrEqualTo('price', 500);
    }
    if (this.data.tab[2].name == '500万以上') {
      query.greaterThanOrEqualTo('price', 500);
    }
    query.addDescending('createdAt');
    query.find().then(function (goodsObjects) {
      var tmpList = goodsObjects.slice(0, 10);
      that.setData({
        list: tmpList,
        counter: 10,
        all: goodsObjects
      });
    });
  },
  //跳转到租房编辑页面
  edit: function () {
    console.log("跳到edit页面")
    wx.navigateTo({
      url: '../buyedit/buyedit'
    })
  },
  //跳转到详情页面
  more: function (e) {
    console.log("跳到det页面");
    var goods_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../buydet/buydet?id=' + goods_id
    })
  },
  xuan0: function (e) {
    var i = e.detail.value
    var a = this.data.tab[0].xuan[i]
    this.setData({
      'tab[0].name': a
    })
    this.loadGoods();
  },
  xuan1: function (e) {
    var i = e.detail.value
    var a = this.data.tab[1].xuan[i]
    this.setData({
      'tab[1].name': a
    })
    this.loadGoods();
  },
  xuan2: function (e) {
    var i = e.detail.value
    var a = this.data.tab[2].xuan[i]
    this.setData({
      'tab[2].name': a
    })
    this.loadGoods();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.loadGoods();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //加载更多
  onReachBottom: function () {
    console.log('加载更多')
    var arr1 = this.data.list;
    var arr2 = this.data.all.slice(this.data.counter, this.data.counter + 10);
    var tmpList = arr1.concat(arr2);
    var cntr = this.data.counter + 10;
    this.setData({
      list: tmpList,
      counter: cntr,
    })
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
      })
    }, 1000)

  }
})
