define(['backbone'], function(Backbone) {
  return Backbone.View.extend({

    events: {
      "click [pure-back]": "back"
    },

    initialize: function(options) {
      _.extend(this, options);
    },

    render: function(callback) {
      var _this = this;
      var path = this.templatePath || this.path + '.html';
      require(["text!" + path], function(HTML) {
        if(!HTML) {
          HTML = _this._defaultTemplate;
        }
        var template = _.template(HTML);
        var div = $(template());
        _this.$el.html(div.html());
        if(div.attr('pure-module') != null)
          _this.$el.attr("pure-module", "");
        callback && callback();
      });
    },

    _defaultTemplate: "<div pure-module>视图模板未能正确加载!</div>",

    onShow: function() {

    },

    onHide: function() {

    },

    init: function() {

    },

    show: function() {
      this.$el.show();
      this.onShow();
    },

    hide: function() {
      this.$el.hide();
      this.onHide();
    },

    back: function() {
      window.history.back();
    }

    

  });
});