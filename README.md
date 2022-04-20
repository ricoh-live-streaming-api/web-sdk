# RICOH Live Streaming Client SDK for Web

株式会社リコーが提供するRICOH Live Streaming Serviceを利用するためのRICOH Live Streaming Client SDK for Web (JavaScript)です。

RICOH Live Streaming Serviceは、映像/音声などのメディアデータやテキストデータなどを
複数の拠点間で双方向かつリアルタイムにやりとりできるプラットフォームです。

サービスのご利用には、API利用規約への同意とアカウントの登録、ソフトウェア利用許諾書への同意が必要です。
詳細は下記Webサイトをご確認ください。

* サービスサイト: https://livestreaming.ricoh/
  * ソフトウェア開発者向けサイト: https://api.livestreaming.ricoh/
* ソフトウェア使用許諾契約書 : [Software License Agreement](SoftwareLicenseAgreement.txt)

* NOTICE: This package includes SDK and sample application(s) for "RICOH Live Streaming Service".
At this moment, we provide API license agreement / software license agreement only in Japanese.

## HOW TO RUN DEMO

fill `client_id`/`client_secret` into demo/credential.temlate.js and rename it credential.js

```sh
$ npm i -g http-server
$ http-server -a localhost -o demo -p 3000 -s
```

open http://localhost:3000/demo in browser and click `start`


## HOW TO USE

See demo/demo.js


## HOW TO USE WITH NPM

Add a dependency to package.json
```json
 "dependencies": {
   "@ricoh-live-streaming-api/ricoh-ls-sdk": "github:ricoh-live-streaming-api/web-sdk"
 }
```


## CHANGE LOG

### v0.0.0

- first release with base implementation

### v0.0.1

- fixup d.ts for adding declare module
- fixup d.ts for replace enum to string union
- add PULL_REQUEST_TEMPLATE.md & ISSUE_TEMPLARE.md

### v0.0.2

- fixup for supporting a new signaling message

### v0.0.3

- add SFU support


### v0.0.4

- add stream metadata support

### v0.0.5

- add notify callback

### v0.0.6

- add track interface support

### v0.0.7

- add addremoteconnection event on connect
- remove stream interface

### v0.0.8

- add connection metadata support
- fix connection_id on addremoteconnection event

### v0.0.9

- change SDK name
- add getStats
- add zip.sh

### v0.1.0

- add errors
- add change metadata methods
- add connect options (beta)

### v0.1.1
- add connect option 'role' (beta)
- add replaceMediaStreamTrack
- add updateMute

### v0.2.0
- change updateMute to changeMute
- change iceTransportPolicy on sfu
- fix p2p bug

### v0.2.1
- fix d.ts

### v0.2.3
- add errors
- add Report methods
- add connect options (sending/iceTransportPolicy)

### v0.3.0
- add msTrack to removeconnection event
- add changestability event
- change errors
- change signaling server

### v0.4.0
- change Track to LSTrack

### v0.5.0
- add d.ts for event handlers

### v0.6.0
- change connect option
- remove beta options
- change errors

### v0.6.1
- fix type of onerror args
- fix changestability event
- fix getStats type

### v0.6.2
- fix type of onerror args

### v1.0.0
- change signaling server
- add errors
- fix onerror arg
- fix initial mute on p2p

### v1.0.1
- fix disconnect

### v1.0.2
- add ws error code
- fix signaling success close
- fix type of updatemute arg

### v1.0.3
- fix replaceMediaStreamTrack on sfu

### v1.0.4
- fix type of ConnectOption

### v1.0.5
- add changeMute restriction
- change release js file name

### v1.1.1
- enable updateMeta on P2P
- improve changeMute stability
- add errors (45605,45614) 
- remove errors (45003,45207,45216)
- change module name

### v1.2.0
- add changeMediaRequirements
- add options.iceServersProtocol to connect
- fix old tailReports remain

### v1.3.0-alpha1
- add changeVideoSendBitrate
- add sending:enabled to ConnectOption
- add SignalingTimeout error
- remove internalError after close
- export SDKError


