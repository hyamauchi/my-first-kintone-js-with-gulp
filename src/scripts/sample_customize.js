/*
 * サンプルカスタマイズ
 * Copyright (c) 2014 Cybozu
 *
 * Licensed under the MIT License
 */
(function () {
  "use strict";

  //レコード一覧イベントを取得
  kintone.events.on('app.record.index.show', function (event) {
    //文字色の設定値
    var fontColorRed = "#ff0000";

    //「会社名」と「確度」の要素を取得
    var elCustomer = kintone.app.getFieldElements('文字列__1行_');    //会社名
    var elAccuracy = kintone.app.getFieldElements('ラジオボタン');    //確度

    for (var i = 0; i < elAccuracy.length; i++) {
      //レコード情報を取得
      var record = event.records[i];

      //「確度」が"A"の場合「会社名」と「確度」の文字色を変更する。
      if (record['ラジオボタン']['value'] == "A") {
        elCustomer[i].style.color = fontColorRed;
        elAccuracy[i].style.color = fontColorRed;
      }
    }
  });
})();
