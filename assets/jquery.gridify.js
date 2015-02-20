/**
 * A lightweight script for creating a Pinterest-like grid using JQuery.
 * 
 * @author Nguyen Hong Khanh https://github.com/hongkhanh/gridify
 * @author Vasilij Belosludcev https://github.com/bupy7/yii2-gridify
 * @version 1.0.0
 */
'use strict';
(function($) {
    $.fn.extend({
        gridify: function(options) {
            var $this           = $(this),
                keys            = [],
                options         = options || {},
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
                        var $item = $(items[i]);
                        
                        if (keys.indexOf($item.closest(options.srcDataKey).data('key')) == -1) {
                            keys.push($item.closest(options.srcDataKey).data('key'));
                        } else {
                            continue;
                        }
                        
                        var idx = indexOfSmallest(columns);
                        
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
                };
                
            render();

            if (options.resizable) {
                var resize = $(window).bind("resize", render);
                $this.on('remove', resize.unbind);
            }
        }
    });
});