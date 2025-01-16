# RICOH Live Streaming Client SDK for Web

株式会社リコーが提供するRICOH Live Streaming Serviceを利用するためのRICOH Live Streaming Client SDK for Web (JavaScript)です。

RICOH Live Streaming Serviceは、映像/音声などのメディアデータやテキストデータなどを
複数の拠点間で双方向かつリアルタイムにやりとりできるプラットフォームです。

サービスのご利用には、API利用規約への同意とアカウントの登録、ソフトウェア利用許諾書への同意が必要です。
詳細は下記Webサイトをご確認ください。

* サービスサイト: https://livestreaming.ricoh/
* トライアル登録: https://console.livestreaming.mw.smart-integration.ricoh.com/login/register
* ソフトウェア使用許諾契約書 : [Software License Agreement](SoftwareLicenseAgreement.txt)

* NOTICE: This package includes SDK and sample application(s) for "RICOH Live Streaming Service".
At this moment, we provide API license agreement / software license agreement only in Japanese.

## デモアプリの起動方法

demo/credential.temlate.js に `client_id`/`client_secret` を記載し、credential.js にリネームしてください。

```sh
$ npm i -g http-server
$ http-server -a localhost -o demo -p 3000 -s
```

ブラウザで http://localhost:3000/demo を開き、`start` ボタンをクリックしてください。

## デモアプリの使用方法

demo/demo.js を参照してください

## バージョンアップ時の更新方法

ricoh-ls-sdk.jsを差し替えてください

