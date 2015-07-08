/**
 * A lightweight script for creating a Pinterest-like grid using JQuery with autoload content via ajax.
 * 
 * @author Nguyen Hong Khanh https://github.com/hongkhanh/gridify
 * @author Vasilij Belosludcev https://github.com/bupy7/yii2-gridify-view
 * @version 1.0.0
 */

'use strict';

(function($) {   
    $.fn.gridify = function(o) {
        var $this           = $(this),
            options         = $.extend({
                events: {
                    afterLoad: function() {}
                }
            }, o),
            scrollDistance  = 250,
            loading         = false,
            pageCurrent     = 1,
            progress        = null,

            indexOfSmallest = function(a) {
                var lowest = 0;
                for (var i = 1, length = a.length; i < length; i++) {
                    if (a[i] < a[lowest]) {
                        lowest = i;
                    }
                }
                return lowest;
            },
            render = function() {
                $this.css('position', 'relative');

                var items       = $this.find(options.srcNode),
                    width       = $this.innerWidth(),
                    itemMargin  = parseInt(options.margin || 0),
                    itemWidth   = parseInt(options.maxWidth || options.width || 220),
                    columnCount = Math.max(Math.floor(width / (itemWidth + itemMargin)),1),
                    left        = columnCount == 1 ? itemMargin / 2 : (width % (itemWidth + itemMargin)) / 2,
                    columns     = [];

                if (options.maxWidth) {
                    columnCount = Math.ceil(width / (itemWidth + itemMargin));
                    itemWidth   = (width - columnCount * itemMargin - itemMargin) / columnCount;
                    left        = itemMargin / 2;
                }

                for (var i = 0; i < columnCount; i++) {
                    columns.push(0);
                }

                for(var i = 0, length = items.length; i < length; i++) {                   
                    var $item   = $(items[i]),
                        idx     = indexOfSmallest(columns);

                    $item
                        .css({
                            'width':                itemWidth,
                            'position':             'absolute',
                            'margin':               itemMargin / 2,
                            'top':                  columns[idx] + itemMargin / 2,
                            'left':                 (itemWidth + itemMargin) * idx + left,
                            'display':              'block'
                        })
                        .addClass('loaded');
                    
                    columns[idx] += $item.innerHeight() + itemMargin;
                }

                $this.css('height', Math.max.apply(null, columns) + itemMargin);
                
                progress.remove();
                $('body').removeClass('loading');
                loading = false;
                options.events.afterLoad.call($this);
            },
            imagesLoading = function(cb) {
                var images = $this.find('img');
                var count = images.length;
                if (count == 0) {
                    cb();
                    return;
                }
                for (var i = 0; i < count; i++) {
                    var image = new Image();
                    image.onload = image.onerror = function(e) {
                        if (--count == 0) {
                            cb();
                            return;
                        }
                    };
                    image.src = images[i].src;
                }
            },
            progressBar = function(message) {
                var styles = [
                        'position: fixed;',
                        'display: block;',
                        'z-index: 999999;',
                        'text-align: center;',
                        'background: rgba(0, 0, 0, 0.5);',
                        'font-size: 20px;',
                        'color: #fff'
                    ],
                    template = 
                        '<div style="' + styles.join(' ') + '">' +
                            '<div style="display: inline-block; padding: 10px;">' + message + '</div>' +
                        '</div>',
                    progressBar = $(template),
                    offset = $('body').offset();
                progressBar.attr('class', 'gridify-modal-loader');
                
                progressBar.css({
                    width: $('body').innerWidth(),
                    top: offset.top + 'px',
                    left: offset.left + 'px'
                });
                $('body').append(progressBar);

                return $(progressBar);
            },
            autoload = function() {
                $(window).on('scroll', function() {

                    var scrollPos = $(document).height() - $(window).height() - $(window).scrollTop();
                    if (scrollPos < scrollDistance && !loading && pageCurrent != options.pageCount) {
                        loading = true;   
                        
                        $('body').addClass('loading');
                        progress = progressBar(options.loader);
                        
                        var data = new Object;
                        data[options.pageParam] = ++pageCurrent;

                        $.ajax({
                            url:        options.url,
                            data:       data,
                            type:       'get',
                            success:    function(data) {
                                $('#' + options.id).append(data);
                                imagesLoading(render);                             
                            }
                        });
                    }
                });
            };

        imagesLoading(render);
        autoload();

        if (options.resizable) {
            var resize = $(window).bind("resize", render);
            $this.on('remove', resize.unbind);
        }
    };
    
})(jQuery);
