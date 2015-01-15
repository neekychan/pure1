require.config({
    baseUrl: "./",
    paths: {
      pure: 'pure/src',
      view: 'pure/src/view',
      zepto: 'pure/lib/zepto',
      backbone: 'pure/lib/backbone',
      underscore: 'pure/lib/underscore',
      text: 'pure/lib/require/text',
      lib: 'pure/lib',
      fastclick: 'pure/lib/fastclick'
    },
    shim: {
      underscore: {exports: '_'},
      zepto: {exports: '$'},
      backbone: {
        deps: ['underscore', 'zepto'],
        exports: 'Backbone'
      }
    },
    waitSeconds: 10,

  });

//开始吧
require(['pure/pure', 'fastclick'],
  function(Pure, FastClick) {
    FastClick.attach(document.body);
    new Pure().start();
  }
);