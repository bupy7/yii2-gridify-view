<?php
namespace bupy7\gridifyview;

use yii\helpers\Url;
use yii\helpers\Json;
use yii\web\View;
use yii\widgets\ListView;
use yii\base\InvalidConfigException;
use yii\helpers\Html;
use yii\helpers\ArrayHelper;
use yii\web\JsExpression;

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
     * - scrollDistance: Distance from bottom before load next page, default: 250px.
     * - pageParam: Variable for number of page. By default value from $dataProvider->pagination->pageParam.
     * 
     * Grid options:
     * - srcNode: grid items (class, node). Require.
     * - margin: margin in pixel, default: 0px
     * - width: grid item width in pixel, default: 220px
     * - maxWidth: dynamic gird item width if specified, (pixel)
     * - resizable: re-layout if window resize
     * - transition: support transition for CSS3, default: opacity 0.5s ease-out 0s.
     * - events: { - list of events
     *      afterLoad: calling after successfully load content via Ajax
     *   }
     * 
     * Loader options:
     * - loader - Text or valid HTML for indication of loading content. 
     */
    public $pluginOptions = [];
    
    /**
     * @var string the layout that determines how different sections of the list view should be organized.
     * The following tokens will be replaced with the corresponding section contents:
     *
     * - `{items}`: the list items. See [[renderItems()]].
     */
    public $layout = '{items}';
    
    /**
     * @var bool Display only items or with ListView tag wrap.
     */
    public $onlyItems = false;
    
    public function init()
    {
        parent::init();
        
        foreach (['url', 'srcNode'] as $property) {
            if ($this->pluginOptions[$property] === null) {
                throw new InvalidConfigException("The \"{$property}\" property must be set to \"pluginOptions\".");
            }
        }
        Html::addCssStyle($this->itemOptions, ['visibility' => 'hidden']);
    }
    
    /**
     * @inheritdoc
     */
    public function run()
    {
        if ($this->dataProvider->getCount() > 0 || $this->showOnEmpty) {
            $content = preg_replace_callback("/{\\w+}/", function ($matches) {
                $content = $this->renderSection($matches[0]);

                return $content === false ? $matches[0] : $content;
            }, $this->layout);
            
            $this->_registerScript();
        } else {
            $content = $this->renderEmpty();
        }
        
        if (!$this->onlyItems) {
            $tag = ArrayHelper::remove($this->options, 'tag', 'div');
            echo Html::tag($tag, $content, $this->options);
        } else {
            echo $content;
        }
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

    /**
     * Register JS script.
     */
    private function _registerScript()
    {
        GridifyViewAsset::register($this->view);

        $this->pluginOptions = array_merge($this->pluginOptions, [
            'url' => Url::toRoute($this->pluginOptions['url']),
            'id' => $this->options['id'],
            'pageCount' => $this->dataProvider->pagination->pageCount,
        ]);
        $this->pluginOptions = array_merge([
            'loader' => 'Loading...',
            'pageParam' => $this->dataProvider->pagination->pageParam,
        ], $this->pluginOptions);     
     
        if (!empty($this->pluginOptions['events'])) {
            foreach (['afterLoad'] as $event) {
                $this->pluginOptions['events'][$event] = new JsExpression($this->pluginOptions['events'][$event]);
            }
        }
        $pluginOptions = Json::encode($this->pluginOptions);
        
        $js = "$('#{$this->options['id']}').gridify({$pluginOptions});";
        $this->view->registerJs($js, View::POS_LOAD);
    }
    
}
