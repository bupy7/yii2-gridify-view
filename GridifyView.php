<?php
namespace bupy7\gridifyview;

use yii\helpers\Url;
use yii\helpers\Json;
use yii\web\View;
use yii\widgets\ListView;
use yii\base\InvalidConfigException;

/**
 * This is widget extended of ListView with plugin of https://github.com/hongkhanh/gridify. This widget allows load 
 * content automatically via Ajax when you reach the end of the page. Content is displayed in table form.
 * 
 * @author Belosludcev Vasilij http://mihaly4.ru
 * @version 1.0.0
 */
class GridifyView extends ListView
{
    
    /**
     * @var array Options of jQuery plugin.
     * Pagination options:
     * - url: URL to action for get next page via Ajax. Require.
     * - scrollDistance: Distance from top/bottom before showing element (px)
     * - srcDataKey: Selector to node where content "data-key" attribute. 
     * It selector must be parent of "srcNode". Require.
     * 
     * Grid options:
     * - srcNode: grid items (class, node). Require.
     * - margin: margin in pixel, default: 0px
     * - width: grid item width in pixel, default: 220px
     * - maxWidth: dynamic gird item width if specified, (pixel)
     * - resizable: re-layout if window resize
     * - transition: support transition for CSS3, default: all 0.5s ease 
     */
    public $pluginOptions = [];
    
    /**
     * @var string the layout that determines how different sections of the list view should be organized.
     * The following tokens will be replaced with the corresponding section contents:
     *
     * - `{items}`: the list items. See [[renderItems()]].
     */
    public $layout = '{items}';
    
    public function init()
    {
        parent::init();
        
        foreach (['url', 'srcDataKey', 'srcNode'] as $property) {
            if ($this->pluginOptions[$property] === null) {
                throw new InvalidConfigException("The \"{$property}\" property must be set to \"pluginOptions\".");
            }
        }
        
        GridifyViewAsset::register($this->view);
        
        $this->pluginOptions['url'] = Url::toRoute($this->pluginOptions['url']);
        $this->pluginOptions['id'] = $this->options['id'];
        $pluginOptions = Json::encode($this->pluginOptions);
        
        $js = "$('#{$this->options['id']}').gridify({$pluginOptions});";
        $this->view->registerJs($js, View::POS_LOAD);
    }
    
    /**
     * Renders a section of the specified name.
     * If the named section is not supported, false will be returned.
     * @param string $name the section name, e.g., `{items}`.
     * @return string|boolean the rendering result of the section, or false if the named section is not supported.
     */
    public function renderSection($name)
    {
        switch ($name) {
            case '{items}':
                return $this->renderItems();
            default:
                return false;
        }
    }

    
}
