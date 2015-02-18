<?php
namespace bupy7\gridifyview;

use yii\base\Widget;
use yii\helpers\Json;
use yii\web\View;

/**
 * This is widget wrapper of ListView with plugin of https://github.com/hongkhanh/gridify. This widget allows load 
 * content automatically via Ajax when you reach the end of the page. Content is displayed in table form.
 * 
 * @author Belosludcev Vasilij http://mihaly4.ru
 * @version 1.0.0
 */
class GridifyView extends Widget
{
    
    /**
     * @var array Options of jQuery plugin.
     * - srcNode: grid items (class, node)
     * - margin: margin in pixel, default: 0px
     * - width: grid item width in pixel, default: 220px
     * - maxWidth: dynamic gird item width if specified, (pixel)
     * - resizable: re-layout if window resize
     * - transition: support transition for CSS3, default: all 0.5s ease 
     */
    public $pluginOptions = [];
    
    public function init()
    {
        GridifyViewAsset::register($this->view);
        
        $pluginOptions = Json::encode($this->pluginOptions);
        
        $js = "$('#{$this->id}').gridify({$pluginOptions});";
        $this->view->registerJs($js, View::POS_LOAD);
    }
    
    public function run()
    {
        
    } 
    
}
