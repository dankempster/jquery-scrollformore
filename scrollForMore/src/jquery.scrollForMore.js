(function($) {
    var
        version = 1.0,

        $target = null,

        eventsAssigned = false,

        opts = { },

        defaultOptions = {
            fadeWhen: 'atScrollPosition',
            fadeConfig: {
                startFadingAt: 50,
                finishFadingBy: 300
            },
            siteBoundaries: null,
            horizontalPosition: 'right',
            horizontalOffset: 0,
            onClickScroll: 100,
            hideWhenFaddedOut: true
        },

        elements = {
            siteBoundaries: null,
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

                // Plugin Options
                opts = $.extend(defaultOptions, options);

                // Target Elements
                $target = $(this).css({
                    position: 'fixed',
                    bottom: '0px'
                });

                // Site Boundaries
                if(!opts.siteBoundaries) {
                    alert("Can't init scrollForMore, missing 'siteBoundires' option");
                }
                elements.siteBoundaries = $(opts.siteBoundaries);
                if(!opts.horizontalOffset) {
                    opts.horizontalOffset = 0;
                }

                // Inialise the plugin based on it's mode
                switch(opts.fadeWhen) {
                    case 'atElement': {
                        init_fadeAtElement();
                        break;
                    }
                    case 'atScrollPosition': {
                        init_fadeAtScrollPosition();
                        break;
                    }
                }

                if(opts.onClickScroll>0) {
                    $target.bind('click', function() {
                        $(window).scrollTop($(window).scrollTop()+opts.onClickScroll);
                    });
                }

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
                        var offset = elements.siteBoundaries.offset( ).left
                            + opts.horizontalOffset,
                            viewPointBoundary = 0;
                        ;

                        if(offset < viewPointBoundary) {
                            offset = viewPointBoundary;
                        }

                        break;
                    }
                    default: {
                        var offset = elements.siteBoundaries.offset( ).left
                            + elements.siteBoundaries.width( )
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
                switch(opts.fadeWhen) {
                    case 'atElement': {
                        fade_atElement();
                        break;
                    }

                    case 'atScrollPosition': {
                        fade_atScrollPosition();
                        break;
                    }
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

    function performFade(scrollPos, startFadingAt, finishFadingBy)
    {
        if(scrollPos<startFadingAt && $target.css('opacity')<1) {
            $target.css('opacity', 1);
        }
        else if(scrollPos>=startFadingAt) {
            var fadeArea = finishFadingBy - startFadingAt,
                diff = scrollPos - startFadingAt,
                opacityValue = (fadeArea-diff)/fadeArea
            ;

            if(opacityValue>0) {
                $target.css({
                    opacity: opacityValue,
                    display: 'block'
                });
            }
            else {
                $target.css({
                    display: 'none'
                });
            }
        }
    }

    function init_fadeAtElement()
    {
        if(!opts.fadeConfig.startFadingAt) {
            alert("Can't init scrollForMore, missing 'fadeConfig.startFadingAt' option");
            return
        }
        elements.startFadingAt = $(opts.fadeConfig.startFadingAt);
        if(!opts.fadeConfig.finishFadingBy) {
            elements.finishFadingBy = elements.startFadingAt;
        }
        else {
            elements.finishFadingBy = $(opts.fadeConfig.finishFadingBy);
        }
    }

    function fade_atElement()
    {
        var scrollPos = $(window).scrollTop() + $(window).height(),
            startFadingAt = elements.startFadingAt.offset().top,
            finishFadingBy = elements.finishFadingBy.offset().top + elements.finishFadingBy.height();

        performFade(scrollPos, startFadingAt, finishFadingBy);
    }

    function init_fadeAtScrollPosition()
    {
        if(!opts.fadeConfig.startFadingAt) {
            alert('scrollForMore: Missing option fadeConfig.startFadingAt');
        }
        if(!opts.fadeConfig.finishFadingBy) {
            alert('scrollForMore: Missing option fadeConfig.finishFadingBy');
        }
    }

    function fade_atScrollPosition()
    {
        console.log('scrolling');
        var scrollPos = $(window).scrollTop(),
            startFadingAt = opts.fadeConfig.startFadingAt,
            finishFadingBy = opts.fadeConfig.finishFadingBy
        ;

        performFade(scrollPos, startFadingAt, finishFadingBy);
    }
})(jQuery);