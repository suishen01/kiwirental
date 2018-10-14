//index.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp.js')

Page({
  data: {
    select1:true,
    select2: false,
    showdet: true,
    list: [],
    rents: [],
    buys: [],
    duans: []
  },
  onShow: function (options) {
    this.select1();
  },
  select1:function(){
    var that = this;
    this.setData({
      rents: [],
      buys: [],
      duans: []
    })
    this.loadLikes();
    this.setData({
      'select1': true,
      'select2':false
    })
  },
  select2: function () {
    var that = this;
    this.setData({
      rents: [],
      buys: [],
      duans: []
    })
    this.loadPosts();
    this.setData({
      'select2': true,
      'select1': false
    })
  },
  //跳转到详情页面
  more: function (e) {
    console.log("跳到det页面");
    var goods_id = e.currentTarget.id;
    if (goods_id.slice(0,2) == 'zu') {
      goods_id = goods_id.slice(2);
      wx.navigateTo({
        url: '../det/det?id=' + goods_id
      })
    } else if (goods_id.slice(0, 2) == 'bu') {
      goods_id = goods_id.slice(2);
      wx.navigateTo({
        url: '../buydet/buydet?id=' + goods_id
      })
    } else if (goods_id.slice(0,2) == 'du') {
      goods_id = goods_id.slice(2);
      console.log(goods_id)
      wx.navigateTo({
        url: '../duandet/duandet?id=' + goods_id
      })
    }
    
  },
  loadLikes: function () {
    var that = this
    var query = new AV.Query('_User');
    query.equalTo('authData', AV.User.current().attributes.authData);
    query.find().then(function (goodsObject) {
      var data = goodsObject[0];
      var likes = data.attributes.likeRentals;
      var likebuys = data.attributes.likeBuys;
      var likeduans = data.attributes.likeDuans;
      for (var i = 0; i < likes.length;i++) {
        var pquery = new AV.Query('Property');
        pquery.equalTo('objectId', likes[i]);
        pquery.find().then(function (pgoodsObject) {
          var av = pgoodsObject[0];
          var tmpjson = {};
          if (av.attributes.unres == 0) {
            tmpjson = {
              tu: '../../assets/images/tu1.jpg',
              lititt: av.attributes.titt,
              tip: [av.attributes.zujin, av.attributes.location],
              objectId: av.id
            }
          } else {
            tmpjson = {
              num: av.attributes.unres,
              tu: '../../assets/images/tu1.jpg',
              lititt: av.attributes.titt,
              tip: [av.attributes.zujin, av.attributes.location],
              objectId: av.id
            }
          }
          
          var tmp = that.data.rents;
          tmp[tmp.length] = tmpjson;
          that.setData({
            rents: tmp
          })
        });
      }

      for (var i = 0; i < likebuys.length; i++) {
        var pquery = new AV.Query('BuyProperty');
        pquery.equalTo('objectId', likebuys[i]);
        pquery.find().then(function (pgoodsObject) {
          var av = pgoodsObject[0];
          var tmpjson = {};
          if (av.attributes.unres == 0) {
            tmpjson = {
              tu: '../../assets/images/tu1.jpg',
              lititt: av.attributes.titt,
              tip: [av.attributes.zujin, av.attributes.location],
              objectId: av.id
            }
          } else {
            tmpjson = {
              num: av.attributes.unres,
              tu: '../../assets/images/tu1.jpg',
              lititt: av.attributes.titt,
              tip: [av.attributes.zujin, av.attributes.location],
              objectId: av.id
            }
          }

          var tmp = that.data.buys;
          tmp[tmp.length] = tmpjson;
          that.setData({
            buys: tmp
          })
        });
      }

      for (var i = 0; i < likeduans.length; i++) {
        var pquery = new AV.Query('DuanProperty');
        pquery.equalTo('objectId', likeduans[i]);
        pquery.find().then(function (pgoodsObject) {
          var av = pgoodsObject[0];
          var tmpjson = {};
          if (av.attributes.unres == 0) {
            tmpjson = {
              tu: '../../assets/images/tu1.jpg',
              lititt: av.attributes.titt,
              tip: [av.attributes.zujin, av.attributes.location],
              objectId: av.id
            }
          } else {
            tmpjson = {
              num: av.attributes.unres,
              tu: '../../assets/images/tu1.jpg',
              lititt: av.attributes.titt,
              tip: [av.attributes.zujin, av.attributes.location],
              objectId: av.id
            }
          }

          var tmp = that.data.duans;
          tmp[tmp.length] = tmpjson;
          that.setData({
            duans: tmp
          })
        });
      }
    }).catch(console.error);
  },
  loadPosts: function () {
    var that = this;
    var query = new AV.Query('Property');
    query.equalTo('owner', AV.User.current().attributes.authData.lc_weapp.openid);
    query.find().then(function (goodsObject) {
      var tmplist = [];
      for (var i = 0; i < goodsObject.length; i++) {
        var tmpjson = {
          tu: '../../assets/images/tu1.jpg',
          lititt: goodsObject[i].attributes.titt,
          tip: [goodsObject[i].attributes.zujin, goodsObject[i].attributes.location],
          objectId: goodsObject[i].id
        }
        tmplist[i] = tmpjson;
      }
      that.setData({
        rents: tmplist
      })
    }).catch(console.error);

    var bquery = new AV.Query('BuyProperty');
    bquery.equalTo('owner', AV.User.current().attributes.authData.lc_weapp.openid);
    bquery.find().then(function (goodsObject) {
      var tmplist = [];
      for (var i = 0; i < goodsObject.length; i++) {
        var tmpjson = {
          tu: '../../assets/images/tu1.jpg',
          lititt: goodsObject[i].attributes.titt,
          tip: [goodsObject[i].attributes.zujin, goodsObject[i].attributes.location],
          objectId: goodsObject[i].id
        }
        tmplist[i] = tmpjson;
      }
      that.setData({
        buys: tmplist
      })
    }).catch(console.error);

    var dquery = new AV.Query('DuanProperty');
    dquery.equalTo('owner', AV.User.current().attributes.authData.lc_weapp.openid);
    dquery.find().then(function (goodsObject) {
      var tmplist = [];
      for (var i = 0; i < goodsObject.length; i++) {
        var tmpjson = {
          tu: '../../assets/images/tu1.jpg',
          lititt: goodsObject[i].attributes.titt,
          tip: [goodsObject[i].attributes.zujin, goodsObject[i].attributes.location],
          objectId: goodsObject[i].id
        }
        tmplist[i] = tmpjson;
      }
      that.setData({
        duans: tmplist
      })
    }).catch(console.error);
  }, 
  delet: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          if (that.data.select1) {
            that.deletLikes(e);
          } else if (that.data.select2) {
            that.deletPosts(e);
          }
          console.log(e)
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deletLikes: function (e) {

    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    var database = '';
    var goods_type = '';
    if (id.slice(0, 2) == 'zu') {
      id = id.slice(2);
      database = 'Property';
      goods_type = 'likeRentals';
    } else if (id.slice(0, 2) == 'bu') {
      id = id.slice(2);
      database = 'BuyProperty';
      goods_type = 'likeBuys';
    } else if (id.slice(0, 2) == 'du') {
      id = id.slice(2);
      database = 'DuanProperty';
      goods_type = 'likeDuans';
    }

    var query = new AV.Query(database);
    query.equalTo('objectId', id);
    var userQ = new AV.Query('_User');
    userQ.equalTo('authData', AV.User.current().attributes.authData);
    userQ.find().then(function (goodsObject) {
      var av = goodsObject[0];
      av.remove(goods_type, id);
      av.save().then(function (av) {
      }, function (error) {
        // 异常处理
        console.error(error);
      });
    }).catch(console.error);

    query.find().then(function (goodsObject) {
      var urls = null;
      var av = goodsObject[0];
      console.log(av);
      av.increment("like", -1);
      av.save().then(function (av) {
        that.select1();
      })
    });
  },
  deletPosts: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    var database = '';
    if (id.slice(0, 2) == 'zu') {
      id = id.slice(2);
      database = 'Property';
    } else if (id.slice(0, 2) == 'bu') {
      id = id.slice(2);
      database = 'BuyProperty';
    } else if (id.slice(0, 2) == 'du') {
      id = id.slice(2);
      database = 'DuanProperty';
    }

    var query = new AV.Query(database);
    query.equalTo('objectId', id);
    query.find().then(function (goodsObject) {
      var av = goodsObject[0];
      console.log(av);
      av.destroy().then(function (av) {
        that.select2()
      })
    });
  },
  edit: function (e) {
    var id = e.currentTarget.id;
    if (id.slice(0, 2) == 'zu') {
      id = id.slice(2);
      wx.navigateTo({
        url: '../zuedit/zuedit?id=' + id
      })
    } else if (id.slice(0, 2) == 'bu') {
      id = id.slice(2);
      wx.navigateTo({
        url: '../buyedit/buyedit?id=' + id
      })
    } else if (id.slice(0, 2) == 'du') {
      id = id.slice(2);
      wx.navigateTo({
        url: '../duanedit/duanedit?id=' + id
      })
    }
  }
})
