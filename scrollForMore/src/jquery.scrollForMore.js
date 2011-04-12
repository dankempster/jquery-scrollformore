(function($) {
    var
        version = 1.0,

        $target = null,

        eventsAssigned = false,

        opts = { },

        elements = {
            siteBoundries: null,
            startFadeAt: null,
            endFadeAt: null
        }

        methods = {
            init: function(options)
            {
                // Doesn't support IE6
                if($.browser.msie && $.browser.version == 6.0) {
                    return;
                }

                $target = $(this);

                opts = options;

                if(!opts.startFadingAt) {
                    alert("Can't init scrollForMore, missing 'startFadingAt' option");
                    return
                }
                opts.startFadingAt = $(opts.startFadingAt);

                if(!opts.siteBoundaries) {
                    alert("Can't init scrollForMore, missing 'siteBoundires' option");
                }
                opts.siteBoundaries = $(opts.siteBoundaries);
                if(!opts.horizontalOffset) {
                    opts.horizontalOffset = 0;
                }

                if(!opts.finishFadingBy) {
                    opts.finishFadingBy = opts.startFadingAt;
                }
                else {
                    opts.finishFadingBy = $(opts.finishFadingBy);
                }

                // Set Css
                $target.css({
                    position: 'fixed',
                    bottom: '0px'
                });

                // Assign the scroll event... once
                if(!eventsAssigned) {
                    eventsAssigned = true;
                    $(window).scroll(methods.scroll);
                    $(window).resize(methods.resize);
                }

                methods.scroll();
                methods.resize();
            },

            resize: function()
            {
                switch(opts.horizontalPosition) {
                    case 'left': {
                        var offset = opts.siteBoundaries.offset( ).left
                            + opts.horizontalOffset,
                            viewPointBoundary = 0;
                        ;

                        if(offset < viewPointBoundary) {
                            offset = viewPointBoundary;
                        }

                        break;
                    }
                    default: {
                        var offset = opts.siteBoundaries.offset( ).left
                            + opts.siteBoundaries.width( )
                            - $target.outerWidth( )
                            - opts.horizontalOffset,
                            viewPointBoundary = $(window).width( ) - $target.outerWidth( );
                        ;
                        if(offset > viewPointBoundary) {
                            offset = viewPointBoundary;
                        }
                    }
                }

                $target.css('left', offset+'px');
            },

            scroll: function()
            {
                var scrollPos = $(window).scrollTop() + $(window).height(),
                    startFadingAt = opts.startFadingAt.offset().top;
                    finishFadingBy = opts.finishFadingBy.offset().top + opts.finishFadingBy.height();

                if(scrollPos<startFadingAt && $target.css('opacity')<1) {
                    $target.css('opacity', 1);
                }
                else if(scrollPos>=startFadingAt) {
                    var fadeArea = finishFadingBy - startFadingAt,
                        diff = scrollPos - startFadingAt,
                        opacityValue = (fadeArea-diff)/fadeArea
                    ;

                    $target.css('opacity', opacityValue);
                }
            }
        }
    ;

    $.fn.scrollForMore = function(method) {
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === 'object' || ! method ) {
            var r = methods.init.apply( this, arguments );
            return r;
        }
        else {
            alert('Method ' + method + ' does not exist on jQuery.sticky');
        }
    };

    $.scrollForMore = function()
    {
        return version;
    };
})(jQuery);