# coil_generation
coil_generation
====
coil_generationは、coil式学習法を利用した英単語学習問題を自動生成するものである。

### 氏名
```
    柴田　薫
```

### 所属
```
    大阪電気通信大学院
    総合情報学研究科
　　コンピュータサイエンス専攻　
    MT18A006　柴田　薫
```


### メールアドレス
```
    mt18a006@oecu.jp
```
### 準備するもの
* words.json
```
//内容例
[
    {
        "eng": "athlete",
        "jpn": "運動選手",
        "lv": [
            {
                "lable": "レベル",
                "content": "4"
            },
            {
                "lable": "英検",
                "content": "2級以上の単語"
            },
            {
                "lable": "学校レベル",
                "content": "高校3年以上の水準"
            },
            {
                "lable": "TOEICスコア",
                "content": "470点以上の単語"
            },
            {
                "lable": "大学入試",
                "content": "難関大対策レベル"
            }
        ],
        "kategori": "スポーツ",
        "sentence": {
            "en": "I think that he is an amazing athlete.",
            "jp": "彼はすごい選手だと思います。"
        },
        "imgURL": "https://cdn.pixabay.com/photo/2014/12/20/09/18/running-573762_960_720.jpg"
    },
    .
    .
    .
]
```
* 難易度(内容例での lv に当たる部分)はweblioが定めているものを利用する
* カテゴリ(内容例での kategori に当たる部分)はJUMAN が定めているものを利用する
* 内容例での sentence に当たる部分は単語を使用した例文を指す
* 内容例での imgURL に当たる部分は、その単語から連想される画像のURLを指す
    * 例では pixabay から取得しているものを利用
## 生成方法
```
   1. words.jsonをdatasetディレクトリに置く
   2. mingw上でbash allrun.shを実行する
   3. 実行が終了した後に、bash format.shを実行
   4. 実行が終了したらjsonディレクトリにcoils.jsonが生成されている
```