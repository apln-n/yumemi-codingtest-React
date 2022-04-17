# 総人口推移グラフ


## 概要
日本の都道府県の総人口の推移をグラフで表示するWebアプリです。  
→[Webアプリを開く](https://apln-n.github.io/pages/yumemi-codingtest-React/)  

## 操作方法
- 「[Webアプリを開く](https://apln-n.github.io/pages/yumemi-codingtest-React/)」を押すと都道府県一覧が表示されます。
- 都道府県を選択することで、その都道府県の総人口推移グラフが表示されます。
	- 縦軸が人口数(人)、横軸が年度(1960年～今年)です。
- チェックを付ける・外すことで、その都道府県のグラフの表示・非表示を設定できます。
	- 複数の都道府県を同時にチェックすることで、都道府県間における人口の推移を比較することもできます。

<img src="demo.gif" width="50%" alt="demo.gif">

---
## 開発者向け
### 開発環境

|                           |            |
|---------------------------|------------|
| **react**                 | **18.0.0** |
| react-dom                 | 18.0.0     |
| react-scripts             | 5.0.1      |
| **highcharts**            | **10.0.0** |
| highcharts-react-official | 3.1.0      |
| eslint                    | 8.13.0     |
| eslint-config-prettier    | 8.5.0      |
| eslint-plugin-react       | 7.29.4     |
| prettier                  | 2.6.2      |


### Webアプリのタグ構造
 div
> h2 (`<Title />` "総人口推移グラフ")

> div (`<CheckBoxes />`)
>> div ("都道府県")

>> div
>>> li (`<CheckBox />` 47個ある)
>>>> input (チェックボックス)

>>>> label (各都道府県名)

> br

> div (`<Population />`)
>> HighchartsReact (`<MyHighChartsGraph />` グラフの表示)

### コーディングで注意した点など
- 関数コンポーネント(クラスを用いていない)。
- `let`なグローバル変数を用いていない。
- 特定の都道府県がチェックされたときにその都道府県の人口構成を取得する。
	- **不必要なAPI呼び出しを行わないようにした。**
	- これまで取得した人口構成(リスト)は、その都道府県のチェックが外されるまで保持される。
- `setEffect`の中で`setInterval`を用いた箇所
	- 主に、チェックボックスの`onClick`で`const`なグローバルな変数(Hook)を変更する、のような仕様にしなかったため。
	- 都道府県一覧のうちチェックされた物を内部のリストに保持するため、リストへの追加において`Set()`、削除で`filter()`を用いた。
		- `setInterval`によって意図せず連続でリストに追加・削除されることを防ぐため、`push()`および`splice()`の使用を避けた。

### ライセンス
[MIT License](https://github.com/apln-n/yumemi-codingtest-React/blob/main/LICENSE)

---
## 作成者
- 大坂直輝(おおさかなおき)
- 北海道大学大学院情報科学院 情報科学専攻 修士2年
- e-mail: applingo@eis.hokudai.ac.jp

