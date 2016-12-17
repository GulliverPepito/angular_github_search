angular.module('app.animations', ['ngAnimate'])

  .animation('.slide', function() {
    return {
      enter : function(element, done) {
        var height = element.height();
        var parent = element.parent();
        if(height != parent.height()) {
          parent.animate({
            height: height
          })
        }

        element.css({ opacity: 0, top:0 })
               .animate({ opacity: 1 }, function() {
                  element.css('top','auto');
                  done();
               });
      },
      leave : function(element, done) {
        $(element)
          .css({ opacity: 1, top:0 })
          .animate({ opacity: 0 }, done);
      }
    };
  });
