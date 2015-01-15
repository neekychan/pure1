define(['view'], function(View) {
  return View.extend({

    events: {

    },

    //stayContent 所有界面切换均在pure-content中完成
    config: {
      stayContent: false
    },

    initialize: function(options) {
      View.prototype.initialize.call(this,options);
      this.tabItems = this.$('[pure-nav-bar] li');
    },

    //重载路由
    route: function(path, query) {
      var _this = this;

      if(!path) path = this.mainModule;

      var views = this.views = this.views || {};
      var view = views[path];
      var isTabView = this.isTabBarModule(path);
      if(view) {
        this.transModule(view, true);
      } 

      if(isTabView) {
        Pure.loadView(path, function(view) {
          if(view) {
            var currentView = _this.currentView;
            if(currentView) {
              currentView.hide();
              currentView.remove();
            }
            currentView = _this.currentView = view;
            currentView.query = query;
            _this.transModule(currentView, false);
            _this.views[path] = view;
            // _.each(_this.tabItems, function(tabItem, index) {
              // if($(tabItem).find('a').attr('href').indexOf(path) != -1)
            // })
          }
        });
        return false;
      }

      return !this.config.stayContent;//表示路由可以往上一级传递
    },

    transModule: function(view, loaded) {
      var content = $(this.$('[pure-content]')[0]);
      if(!view || !content) throw new Error("无法正常加载模块对象或没有设置pure-content标识");
      if(!loaded) {
        view.render(function() {
          view.init();
          view.show();
        });
      } else {
        view.show();
      }
      content.html(view.$el);
    },

    isTabBarModule: function(path) {
      return _.find(this.tabItems, function(tabItem) {
        return $(tabItem).find('a').attr('href').indexOf(path) != -1;
      }) != undefined;
    },

    transitionModule: function(prevView, currentView, style) {
      var style = style || 'default';
      var content = $(this.$('[pure-content]')[0]);
      // if(!currentView || !preView || !content) throw new Error("无法正常加载模块对象或没有设置pure-content标识");
      content.append(currentView.$el);
      currentView.$el.addClass('animated fadeInRight');
    }

  });
});