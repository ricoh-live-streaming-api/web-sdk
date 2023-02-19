# CHANGE LOG

## v0.0.0

- first release with base implementation

## v0.0.1

- fixup d.ts for adding declare module
- fixup d.ts for replace enum to string union
- add PULL_REQUEST_TEMPLATE.md & ISSUE_TEMPLARE.md

## v0.0.2

- fixup for supporting a new signaling message

## v0.0.3

- add SFU support


## v0.0.4

- add stream metadata support

## v0.0.5

- add notify callback

## v0.0.6

- add track interface support

## v0.0.7

- add addremoteconnection event on connect
- remove stream interface

## v0.0.8

- add connection metadata support
- fix connection_id on addremoteconnection event

## v0.0.9

- change SDK name
- add getStats
- add zip.sh

## v0.1.0

- add errors
- add change metadata methods
- add connect options (beta)

## v0.1.1
- add connect option 'role' (beta)
- add replaceMediaStreamTrack
- add updateMute

## v0.2.0
- change updateMute to changeMute
- change iceTransportPolicy on sfu
- fix p2p bug

## v0.2.1
- fix d.ts

## v0.2.3
- add errors
- add Report methods
- add connect options (sending/iceTransportPolicy)

### v0.3.0
- add msTrack to removeconnection event
- add changestability event
- change errors
- change signaling server

## v0.4.0
- change Track to LSTrack

## v0.5.0
- add d.ts for event handlers

## v0.6.0
- change connect option
- remove beta options
- change errors

## v0.6.1
- fix type of onerror args
- fix changestability event
- fix getStats type

## v0.6.2
- fix type of onerror args

## v1.0.0
- change signaling server
- add errors
- fix onerror arg
- fix initial mute on p2p

## v1.0.1
- fix disconnect

## v1.0.2
- add ws error code
- fix signaling success close
- fix type of updatemute arg

## v1.0.3
- fix replaceMediaStreamTrack on sfu

## v1.0.4
- fix type of ConnectOption

## v1.0.5
- add changeMute restriction
- change release js file name

## v1.1.1
- enable updateMeta on P2P
- improve changeMute stability
- add errors (45605,45614) 
- remove errors (45003,45207,45216)
- change module name

## v1.2.0
- API変更
    - changeMediaRequirementsで対向connectionごとにvideoを受信するか指定できるようにした
    - ConnectOptionのiceServersProtocolでTURNサーバに接続する際にどのトランスポートプロトコルで接続するか指定できるようにした。この属性で"tls"を指定してTCP443ポートの強制が可能になり、他のトランスポートプロトコルを使ってパフォーマンス最適化する余地を犠牲にして、ファイヤーウォールやプロキシを通過する確率を上げることができる
- SDK修正
    - 特定のタイミングでchangeMute、updateTrackMetaを実行した場合に対向connectionに内容が通知されない不具合を修正
    - 要求されたRoomSpecに対応するSFUまたはTURNが一時的にクラウド上に存在しない場合に専用のエラーコード53806を追加
    - tailReportsの残存期間を修正

## v1.3.0
- API変更
    - changeVideoSendBitrateで接続中に映像送信ビットレートを変更できるようにした
    - (dev環境のみ提供のβ機能)ConnectOptionのsending.enabledでクライアントの送信機能を無効にできるようにした。同一Room中に大量に送信機能が有効なクライアントが存在する場合、クライアントに大きな処理負荷や遅延が発生してしまうが、このオプションで低減することができる
- SDK修正
    - 規定時間内にSignalingメッセージが到達しなかった場合にSignalingTimeoutエラーを通知
    - 規定時間内にIceConnectionが接続確立しなかった場合にIceConnectionTimeoutエラーを通知
    - closing/closed状態で発生するInternalErrorをListenerへ通知しないように修正
    - SDKError型をexportしていなかった不具合を修正

## v1.4.0
- API変更
    - 送信映像フレームレートを送信中に変更できる
    - [Client#changeVideoSendFramerate(maxFramerate: number)](https://api.livestreaming.ricoh/document/ricoh-live-streaming-client-sdk-api-%E5%A4%96%E9%83%A8%E4%BB%95%E6%A7%98/#changeVideoSendFramerate) を追加
    - (2022/06/29より本番環境で利用可能になりました)ConnectOptionのsending.enabledでクライアントの送信機能を無効にできるようにした。同一Room中に大量に送信機能が有効なクライアントが存在する場合、クライアントに大きな処理負荷や遅延が発生してしまうが、このオプションで低減することができる

- SDK修正
    - UnsupportedRoomSpecTypeOnChangeVideoSendBitrate のエラーコードを修正
        - 誤 45014 => 正 45018
    - `Client#changeMediaRequirements`を実行時に指定したConnectionが同じタイミングで離脱するとエラーになる場合がある問題を修正

## v1.5.0
- API変更
    - openイベントの属性にAccessTokenのclaimのJSON文字列を追加
- SDK修正
    - videoのmuteTypeがhardmuteで指定された際、Roomの帯域幅割当消費の対象外になった 
    - openイベントの直後やリスナー中でいくつかのメソッドを呼ぶと正常に動作しなかった問題を修正
    - updateremotetrackとaddremotetrackの処理が重なった場合にtrackmetaの一部が消失していた問題を修正
    - onのリスナーの一部の引数の型定義中に実際には含まれていないtype属性が定義されていた問題を修正
    - 型違反の引数を受け付けた際にInternalErrorになっていたメソッドについて型違反のエラーを出すように修正
    - open状態からclosing状態を経ずにclosed状態になる場合があった問題の修正
    - 同じRoomに同じConnectionIDのConnectionが入室した際に、新しいConnectionが残り元のConnectionは退室する仕様変更に伴い、エラーコードを追加削除
        - 追加: 43603 SameConnectionIDJoined
        - 廃止: 43602 DuplicateConnectionIDOnConnect
    - 一部エラー内容の表現を改善
- サンプルアプリ修正
    - disconnect時のvideoのsrcObject等の関連リソース解放処理を改善

## v1.6.0
- SDK 修正
    - [NetworkError の追加と廃止](https://api.livestreaming.ricoh/docs/clientsdk-error-specification/#networkerror)を行いました
        - 追加: Room 管理 API (3 月までにリリース予定) でアプリケーションから切断された場合のエラーコード 53002 ConnectionClosedByApplication
        - 追加: Room の最大持続時間(24 時間)を越えて切断された場合のエラーコード 53003 MaxRoomPeriodExceeded
        - 廃止: 54000 OnTrackTimeout。同等の内容はログに出力されるのみになります
    - open イベントの前で addremoteconnection イベントが発生しないように修正しました

## v1.6.1
- SDK 修正
  - replaceMediaStreamTrack で CanvasCaptureMediaStreamTrack のインスタンスを指定できない問題を修正しました