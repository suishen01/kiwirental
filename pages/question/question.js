//index.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp.js'); 

Page({
  data: {
    database: '',
    cmtdatabase: '',
    id: '',
    quest: '',
    answer: '',
    resd:'0',
    res:'0',
    current: -1,
    wen:[],
  },
  select: function (e) {
    var that = this;
    var tmpArr = that.data.wen;
    if (tmpArr[e.currentTarget.id].shuru) {
    } else {
      tmpArr[e.currentTarget.id].shuru = true;
      if (that.data.current == -1) {

      } else {
        tmpArr[that.data.current].shuru = false;
      }
      that.setData({
        current: e.currentTarget.id,
        wen: tmpArr
      })
    }
  },
  daInput: function (e) {
    this.setData({
      'answer': e.detail.value
    })
  },
  submitAnswer: function (e) {
    var that = this;
    var tmpArr = that.data.wen;

    var pid = that.data.id;
    console.log(pid);
    var query = new AV.Query(that.data.database);
    query.equalTo('objectId', pid);

    query.find().then(function (goodsObject) {
      var av = goodsObject[0];
      console.log(av);
      av.increment("unres", -1);
      av.save().then(function (av) {
      })
    });

    tmpArr[that.data.current].da = that.data.answer;
    tmpArr[that.data.current].shuru = false;
    tmpArr[that.data.current].hui = true;

    console.log(tmpArr[that.data.current])

    that.setData({
      current: -1,
      wen: tmpArr,
      answer: '',
      res: that.data.res - 1,
      resd: that.data.resd + 1,
    });

    this.update();
  },
  ask: function (e) {
    var that = this;

    var pid = that.data.id;
    console.log(pid);
    var query = new AV.Query(that.data.database);
    query.equalTo('objectId', pid);

    query.find().then(function (goodsObject) {
      var av = goodsObject[0];
      console.log(av);
      av.increment("comment", 1);
      av.save().then(function (av) {
        console.log(av);
      })
    });

    query.find().then(function (goodsObject) {
      var av = goodsObject[0];
      console.log(av);
      av.increment("unres", 1);
      av.save().then(function (av) {
      })
    });

    if (that.data.wen == '') {
      var tmpArr = [];

      tmpArr[0] = {
        id: 0,
        wen: that.data.quest,
        da: '',
        hui: false,
        shuru: false
      }
    } else {
      var tmpArr = that.data.wen;

      tmpArr[tmpArr.length] = { 
        id: tmpArr.length,
        wen: that.data.quest,
        da: '',
        hui: false,
        shuru: false
      }
    }
    that.setData({
      wen: tmpArr,
      res: that.data.res + 1,
    });

    this.update();
  },
  askInput: function (e) {
    this.setData({
      'quest': e.detail.value
    });
  },
  checkRes: function (e) {
    var that = this;
    var tmpArr = that.data.wen;
    var counter = 0;
    for (var i = 0; i < tmpArr.length; i++) {
      if (tmpArr[i].da == '') {
        counter++;
      }
    }
    var resdCounter = tmpArr.length - counter;
    that.setData({
      res: counter,
      resd: resdCounter
    })
  },
  onLoad: function (params) {
    console.log(params)
    var db = '';
    var cmtdb = '';
    if (params.source == 'zu') {
      db = 'Property';
      cmtdb = 'Comment';
    } else if (params.source == 'buy') {
      db = 'BuyProperty';
      cmtdb = 'BuyComment'
    } else if (params.source == 'duan') {
      db = 'DuanProperty'
      cmtdb = 'DuanComment'
    }
    this.setData({
      cmtdatabase: cmtdb,
      database: db
    })
    var that = this
    that.setData({
      id: params.id
    });
    var that = this;
    var query = new AV.Query(that.data.cmtdatabase);
    query.equalTo('propertyId', that.data.id);
    query.find().then(function (goodsObject) {
      var av = goodsObject[0];
      console.log(av)
      that.setData({
        wen: av.attributes.details,
        res: av.attributes.unres,
        resd: av.attributes.number - av.attributes.unres,
      })
      }, function (error) {
        // 异常处理
        console.error(error);
    }).catch(console.error);
  },
  update: function () {
    this.clearSelection();
    var that = this;
    var query = new AV.Query(that.data.cmtdatabase);
    query.equalTo('propertyId', that.data.id);
    query.find().then(function (goodsObject) {
      var av = goodsObject[0];
      av.set('number', that.data.wen.length);
      av.set('unres', that.data.res);
      av.set('details', that.data.wen);
      console.log(av)
      av.save().then(function (av) {
      }, function (error) {
        // 异常处理
        console.error(error);
      });
    }).catch(console.error);
  },
  clearSelection: function () {
    var that = this;
    var tmpArr = that.data.wen;
    for (var i = 0; i < tmpArr.length; i++) {
      tmpArr[i].shuru = false;
    }
    that.setData({
      wen: tmpArr
    })
  }
})
