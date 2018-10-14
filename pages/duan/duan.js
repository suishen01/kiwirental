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
        xuan: ['不限', '单间', '整套']
      },
      {
        name: '不限',
        select: false,
        xuan: ['不限', '奥克兰', 'Rotorua', 'Taupo', '奥克兰岛屿', '北岛其他城市', '南岛']
      },
      {
        name: '不限',
        select: false,
        xuan: ['不限', '50以内', '50-100', '100-150', '150-200', '200-300', '300-400', '400以上']
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
      desc: '短租民宿',
      path: '/pages/duan/duan'
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
    var query = new AV.Query('DuanProperty');
    if (this.data.tab[0].name == '不限') {
    } else {
      query.contains('type', this.data.tab[0].name);
    }
    if (this.data.tab[1].name == '不限') {
    } else {
      query.contains('location', this.data.tab[1].name);
    }
    if (this.data.tab[2].name == '50以内') {
      query.lessThanOrEqualTo('price', 50);
    }
    if (this.data.tab[2].name == '50-100') {
      query.greaterThanOrEqualTo('price', 50);
      query.lessThanOrEqualTo('price', 100);
    }
    if (this.data.tab[2].name == '100-150') {
      query.greaterThanOrEqualTo('price', 100);
      query.lessThanOrEqualTo('price', 150);
    }
    if (this.data.tab[2].name == '150-200') {
      query.greaterThanOrEqualTo('price', 150);
      query.lessThanOrEqualTo('price', 200);
    }
    if (this.data.tab[2].name == '200-300') {
      query.greaterThanOrEqualTo('price', 200);
      query.lessThanOrEqualTo('price', 300);
    }
    if (this.data.tab[2].name == '300-400') {
      query.greaterThanOrEqualTo('price', 300);
      query.lessThanOrEqualTo('price', 400);
    }
    if (this.data.tab[2].name == '400以上') {
      query.greaterThanOrEqualTo('price', 400);
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
      url: '../duanedit/duanedit'
    })
  },
  //跳转到详情页面
  more: function (e) {
    console.log("跳到det页面");
    var goods_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../duandet/duandet?id=' + goods_id
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
