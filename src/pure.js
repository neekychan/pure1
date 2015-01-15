/*
Pure.JS
Create 2014.12.24
*/
define(['zepto', 'backbone', 'view'],function(_, Backbone, View) {

  var options = {

  };

  function Pure(_options){
    this.options = _.extend(options, _options);
    window.Pure = this;
  };

  var Router = Backbone.Router.extend({

    initialize: function(options) {
      this.pure = options;
    },

    routes: {
      '*path(?*queryString)': 'any',
    },
    any: function(path, queryString){
      if(queryString) {
        var querys = {}
        _.each(queryString.split('&'), function(i, str) {
          if(!str) return;
          var data = str.split("=");
          querys[data[0]] = data[1];
        });
      }
      Pure.log('跳转到: %s?%s', path, queryString);
      this.pure.route(path, querys);
    }
  });

  _.extend(Pure.prototype, {

    start: function() {
      //设置Pure的跟容器节点
      var root = this.options.root || $('[pure-root]') || $('body');
      this.setRootView(root);
      this.setNavigationController();
    },
    //设置导航控制器
    setNavigationController: function(view) {
      var pure = this;


      pure._initNavigationController(pure.root, function() {
        //初始化路由
        var route = new Router(pure);
        var pathname = window.location.pathname;
        var rootPath = pathname.substr(0, pathname.lastIndexOf('/'));
        Backbone.history.start({pushState: false, root: rootPath});
      });
      return;

      var navType = pure.root.attr('pure-nav-type') || 'stack';
      var viewPath = view || 'pure/' + navType;

      //1.tabbar 2.stackView 3.single(单页面应用)
      require(['pure/' + navType], function(NavView) {
        var navigationView = new NavView({
          el: pure.root
        });
        var mainModule = navigationView.$('[pure-content]').attr('pure-main');
        navigationView.mainModule = mainModule;
        pure.navigationView = navigationView;
        //初始化路由
        var route = new Router(pure);
        var pathname = window.location.pathname;
        var rootPath = pathname.substr(0, pathname.lastIndexOf('/'));
        Backbone.history.start({pushState: false, root: rootPath});
        //如果指定了默认模块则自动加载
        // var hash = window.location.hash;
        // if(mainModule && !hash) pure.route(mainModule);
      });
    },

    _initNavigationController: function(el, callback) {
      var pure = this;
      var navType = el.attr('pure-nav-type') || 'stack';
      if(typeof navType == 'string') {
        require(['pure/' + navType], function(NavView) {
          var navigationView = new NavView({
            el: el
          });
          if(el.attr('pure-root') != undefined) {
            pure.navigationView = navigationView;
          }
          var mainModule = navigationView.$('[pure-content]').attr('pure-main');
          navigationView.mainModule = mainModule;
          var subNavigationController = navigationView.$('[pure-nav]');
          if(subNavigationController.length > 0) {
            var type = subNavigationController.attr('pure-nav-type');
            pure._initNavigationController(subNavigationController, function(childNav) {
              if(childNav) {
                navigationView.childNavigationController = childNav;
              }
              callback();
            });
          } else {
            callback(navigationView);
          }
        });
      } else {

      }
    },

    //设置根视图
    setRootView:function($el) {
      return this.root = $el;
    },

    go: function(path, query, options) {
      options = options || {trigger: true};
      options.trigger = (options.trigger == undefined) ? true : options.trigger;
      Backbone.history.navigate(path, options);
    },

    route: function(path, query) {
      this.navigationView.route(path, query);
    },

    back: function() {
      this.navigationView.back();
    },
    //加载模块
    loadView: function(path, callback) {
      if(typeof path == 'string') {
        require([path], function(PureView) {
          var view = new PureView({
            path: path
          });
          callback && callback(view);
        });
      }
    },

  });

  _.extend(Pure, {

    version: "0.1",

    log: function() {
      console.log.apply(console, arguments);
    }
  });


  return Pure;

})