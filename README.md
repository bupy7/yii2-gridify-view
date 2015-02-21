# yii2-gridify

This is widget extended of ListView with plugin of https://github.com/hongkhanh/gridify. This widget allows load content automatically via Ajax when you reach the end of the page. Content is displayed in table form.

# How use

Added your controller folliwing code:

```php
public function actionIndex()
{
    $searchModel = new ModelSearch();
    $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

    if (Yii::$app->request->isAjax) {
        return $this->renderPartial('_page', [
            'dataProvider' => $dataProvider,
            'onlyItems' => true,
        ]);
    }

    return $this->render('index', [
        'dataProvider' => $dataProvider,
        'searchModel' => $searchModel,
    ]);
}
```
