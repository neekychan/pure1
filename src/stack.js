define(['view'], function(View) {
  return View.extend({

    transStyle: 'normal',

    routeOnce: false,

    initialize: function(options) {
      View.prototype.initialize.call(this,options);
      this.stack = [];
    },

    //重载路由
    route: function(path, query) {
      var _this = this;
    
      //如果路由地址为空则载入默认模块
      if(!path) { path = this.mainModule; };

      var isBack = this.stack.length > 1 && this.stack[this.stack.length - 2].path == path;
      var childNav = this.childNavigationController;
      //如果存在子导航
      if(childNav) {
        if(this.stack.length == 0) {
          this.pushView(null, childNav);
        }
        if(this.stack.length == 1 && !childNav.route(path, query)) return;
        isBack = isBack || childNav.isTabBarModule(path);
      }
      var currentView = this.stack.length >= 1 && this.stack[this.stack.length - 1].view;
      var prevView = isBack && this.stack[this.stack.length - 2].view;

      //返回
      if(isBack) {
        _this.transModule(currentView, prevView, false, this.transStyle, function(currentView, prevView) {
          _this.popView();
          currentView.hide();
          currentView.remove();
        });
      } else {
        Pure.loadView(path, function(view) {
          if(view) {
            view.query = query;
            _this.pushView(path, view);
            _this.transModule(currentView, view, true, _this.transStyle);
          }
        });
      }
    },

    pushView: function(path, _view){
      var view = {path: path, view: _view};
      this.stack.push(view);
      return view;
    },

    popView: function() {
      return this.stack.pop();
    },

    transModule: function(currentView, nextView, forward, style, callback) {

      var style = style || 'normal';
      var _this = this;

      var content = $(this.$('[pure-content]')[0]);
      if(!content) throw new Error("无法正常加载模块对象或没有设置pure-content标识");
      if(forward) {
        //渲染并初始化新页面
        nextView.render(function() {
          nextView.init();
          nextView.show();
        });
      } else {
        nextView.show();
      }
      //载入页面切换过渡动画
      var animation = this.animateStyle[style][forward?'forward':'forback'];
      if(currentView) {
        this.addAnimateEndListener(currentView.el, function() {
          callback && callback(currentView, nextView);
          _this.removeAnimateEndListener(currentView.el);
        });
        currentView.$el.attr('class', animation[0]);
        nextView.$el.attr('class', animation[1]);
      }
      //如果载入新模块则需要往容器中添加该视图
      forward && content.append(nextView.$el);
    },

    addAnimateEndListener: function(view, callback) {
      view = view.length > 0 ? view[0] : view;
      view.addEventListener('webkitAnimationEnd', callback);
      view.addEventListener('animationend', callback);
      view.addEventListener('MSAnimationEnd', callback);
      view.addEventListener('oAnimationEnd', callback);
    },

    removeAnimateEndListener: function(view) {
      view = view.length > 0 ? view[0] : view;
      view.removeEventListener('webkitAnimationEnd');
      view.removeEventListener('animationend');
      view.removeEventListener('MSAnimationEnd');
      view.removeEventListener('oAnimationEnd');
    },

    animateStyle: {
      'normal': {
        forward: [null, 'animated fadeInRight'],
        forback: ['animated fadeOutRight', null]
      },
      'bounce': {
        forward: [null, 'animated bounceIn'],
        forback: ['animated bounceOut', null]
      },
      'fadeIn': {
        forward: [null, 'animated fadeIn'],
        forback: ['animated fadeOut', null]
      },
      'zoom': {
        forward: [null, 'animated zoomIn'],
        forback: ['animated zoomOut', null]
      },
      'fadeInUpDown': {
        forward: [null, 'animated fadeInUp'],
        forback: ['animated fadeOutDown', null]
      },
    }

  });
});