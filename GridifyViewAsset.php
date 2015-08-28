<?php

namespace bupy7\gridifyview;

use yii\web\AssetBundle;

/**
 * Register jQuery plugin Gridfy from https://github.com/hongkhanh/gridify with modification.
 * 
 * @author Belosludcev Vasilij http://mihaly4.ru
 * @since 1.0.0
 */
class GridifyViewAsset extends AssetBundle
{
    
    public $sourcePath = '@bupy7/gridifyview/assets';
    public $js = [
        'jquery.gridify.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
    
}
