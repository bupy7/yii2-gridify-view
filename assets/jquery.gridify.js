/**
 * A lightweight script for creating a Pinterest-like grid using JQuery.
 * 
 * @author Nguyen Hong Khanh https://github.com/hongkhanh/gridify
 * @author Vasilij Belosludcev https://github.com/bupy7/yii2-gridify
 * @version 1.0.0
 */
'use strict';
(function($) {
    
    $.fn.gridify = function(options) {
        
        var $this           = $(this),
            options         = options || {},
            scrollDistance  = 250,
            processLoad     = false,

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
                    transition  = (options.transition || 'all 0.5s ease') + ', height 0, width 0',
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

                    $item.css({
                        width:      itemWidth,
                        position:   'absolute',
                        margin:     itemMargin / 2,
                        top:        columns[idx] + itemMargin / 2,
                        left:       (itemWidth + itemMargin) * idx + left,
                        transition: transition
                    });
                    columns[idx] += $item.innerHeight() + itemMargin;
                }

                $this.css('height', Math.max.apply(null, columns) + itemMargin);
                
            },
            autoload = function() {
                
                $(window).on('scroll', function () {
                    if ($(document).height() - $(window).height() - $(window).scrollTop() < scrollDistance 
                        && !processLoad
                    ) {
                        processLoad = true;         
                        $.ajax({
                            url: options.url,
                            type: 'get',
                            success: function(data) {
                                $('#' + options.id).append(data);
                                render();                              
                                processLoad = false;
                            }
                        });
                    }
                });
                
            };

        render();
        autoload();

        if (options.resizable) {
            var resize = $(window).bind("resize", render);
            $this.on('remove', resize.unbind);
        }
        
    };
    
})(jQuery);