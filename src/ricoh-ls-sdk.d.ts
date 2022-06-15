/** @module ricoh-ls-sdk
 */
declare module "@ricoh-live-streaming-api/ricoh-ls-sdk" {
  /** @typedef {String} ConnectionID
   */
  type ConnectionID = string;
  /** @typedef {String} RoomSessionID
   */
  type RoomSessionID = string;
  /** @typedef {String} ClientID
   */
  type ClientID = string;
  /** @typedef {String} JwtAccessToken
   */
  type JwtAccessToken = string;
  /** @type {string}
   */
  const SIGNALING_URL = "wss://signaling-dev.livestreaming.mw.smart-integration.ricoh.com/v1/room";
  /**
   * Client の State Type
   *
   * @public
   * @typedef {"idle" | "connecting" | "open" | "closing" | "closed"} StateType
   */
  type StateType = "idle" | "connecting" | "open" | "closing" | "closed";
  /**
   * Client の Event Type
   *
   * @public
   * @typedef {"connecting" | "open" | "closing" | "close" | "error" | "addlocaltrack" | "addremotetrack" | "updateremotetrack" | "addremoteconnection" | "removeremoteconnection" | "updateremoteconnection" | "updatemute" | "changestability"} EventType
   */
  type EventType =
    | "connecting"
    | "open"
    | "closing"
    | "close"
    | "error"
    | "addlocaltrack"
    | "addremotetrack"
    | "updateremotetrack"
    | "addremoteconnection"
    | "removeremoteconnection"
    | "updateremoteconnection"
    | "updatemute"
    | "changestability";

  type VideoCodecType = "h264" | "vp8" | "vp9" | "h265" | "av1";

  type SendingPriority = "normal" | "high";

  interface SendingVideoOption {
    codec?: VideoCodecType;
    priority?: SendingPriority;
    maxBitrateKbps?: number;
  }

  interface SendingOption {
    video?: SendingVideoOption;
    enabled?: boolean;
  }

  interface ReceivingOption {
    enabled?: boolean;
  }

  interface ConnectOption {
    /**
     * local Tracks
     */
    localLSTracks?: LSTrack[];
    /**
     * connection metadata object
     */
    meta?: Object;
    /**
     * signaling server endpoint
     */
    signalingURL?: string;
    /**
     * sending option
     */
    sending?: SendingOption;
    /**
     * receiving option
     */
    receiving?: ReceivingOption;
    /**
     * iceTransportPolicy override
     */
    iceTransportPolicy?: "all" | "relay";
    /**
     * iceServers protocol
     */
    iceServersProtocol?: "all" | "udp" | "tcp" | "tls";
  }

  /**
   * LSTrack の Mute type
   *
   * @public
   * @typedef {"unmute" | "softmute" | "hardmute"} MuteType
   */
  type MuteType = "unmute" | "softmute" | "hardmute";

  interface LSTrackOption {
    /**
     * lstrack metadata object
     */
    meta?: Object;
    /**
     * mute state
     */
    mute?: MuteType;
  }

  /**
   * エラー種別
   *
   * @public
   * @typedef {"ParameterError" | "NetworkError" | "UnexpectedError" }
   */
  type ErrorType = "ParameterError" | "NetworkError" | "UnexpectedError";
  interface ErrorDetail {
    /**
     * エラーコード
     */
    code: Number;
    /**
     * エラー種別
     */
    type: ErrorType;
    /**
     * エラー内容
     */
    error: string;
  }

  /**
   * Safari が EventTarget を継承できないので Polyfill
   * Client が動く程度の範囲で実装
   *
   * @public
   * @class ET
   */
  class ET {
    /** @type Map<String, EventListenerWithOptions[]>
     */
    listeners: Map<String, EventListenerWithOptions[]>;
    /**
     * @param {String} type
     * @param {EventListener} listener
     * @param {AddEventListenerOptions} options
     */
    addEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions): void;
    /**
     * @param {Event} event
     */
    dispatchEvent(event: Event): void;
    /**
     *
     * @param {String} type
     * @param {EventListener} func
     * @param {EventListenerOptions} options
     */
    removeEventListener(type: string, func: EventListener, options?: EventListenerOptions): void;
  }
  /** @typedef {{listener: EventListener, options: AddEventListenerOptions}} EventListenerWithOptions
   */
  type EventListenerWithOptions = any;
  /**
   * SDK の中心となる Client クラス
   * このクラスを通してシグナリングやメディアの制御を行う
   *
   * @public
   * @class Client
   * @extends ET
   */
  class Client extends ET {
    /**
     * connecting イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "connecting", listener: (e: { type: string }) => void): void;
    /**
     * open イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "open", listener: (e: { type: string }) => void): void;
    /**
     * closing イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "closing", listener: (e: { type: string }) => void): void;
    /**
     * close イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "close", listener: (e: { type: string }) => void): void;
    /**
     * error イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "error", listener: (e: SDKErrorEvent) => void): void;
    /**
     * addremoteconnection イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "addremoteconnection", listener: (e: { connection_id: string; meta: Object }) => void): void;
    /**
     * updateremoteconnection イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "updateremoteconnection", listener: (e: { connection_id: string; meta: Object }) => void): void;
    /**
     * removeremoteconnection イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "removeremoteconnection", listener: (e: { connection_id: string; meta: Object; mediaStreamTrack?: MediaStreamTrack }) => void): void;
    /**
     * addremotetrack イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "addremotetrack", listener: (e: { connection_id: string; meta?: Object; mediaStreamTrack: MediaStreamTrack; stream: MediaStream; mute: MuteType }) => void): void;
    /**
     * updateremotetrack イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "updateremotetrack", listener: (e: { connection_id: string; mediaStreamTrack: MediaStreamTrack; stream: MediaStream; meta: Object }) => void): void;
    /**
     * changestability イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "changestability", listener: (e: { connection_id: string; stability: string }) => void): void;
    /**
     * addlocaltrack イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "addlocaltrack", listener: (e: { mediaStreamTrack: MediaStreamTrack; stream: MediaStream }) => void): void;
    /**
     * updatemute イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on(eventName: "updatemute", listener: (e: { connection_id: string; mediaStreamTrack: MediaStreamTrack; stream: MediaStream; mute: MuteType }) => void): void;

    /**
     * State を取得する
     *
     * @public
     * @returns {StateType}
     */
    public getState(): StateType;
    /**
     * Stats を取得する
     * mediaStreamTrack指定時は当該MediaStreamTrackのみに関するstatsを取得
     * 未指定時は全体のstatsを取得
     *
     * @public
     * @param {MediaStreamTrack} mediaStreamTrack
     * @returns {Promise}
     */
    public getStats(mediaStreamTrack?: MediaStreamTrack): Promise<{ [connection_id: string]: RTCStatsReport }>;
    /**
     * 渡された credential を用い Signaling Server に接続する
     *
     * @public
     * @param {ClientID} client_id
     * @param {JwtAccessToken} access_token
     * @param {ConnectOption} option
     */
    public connect(client_id: ClientID, access_token: JwtAccessToken, option: ConnectOption): void;
    /**
     * 保持する PeerConnection と WebSocket を開放し
     * State を CLOSING に遷移
     *
     * @public
     */
    public disconnect(): void;
    /**
     * metaを更新する
     * 更新するKeyValueのみを指定する(connect時に登録していないKeyは新規追加できない)
     *
     * @public
     * @param {Object} meta
     */
    public updateMeta(meta: Object): void;
    /**
     * LSTrackのmetaを更新する
     * 更新するKeyValueのみを指定する(connect時に登録していないKeyは新規追加できない)
     *
     * @public
     * @param {LSTrack} lsTrack
     * @param {Object} meta
     */
    public updateTrackMeta(lsTrack: LSTrack, meta: Object): void;

    /**
     * TrackのmediaStreamTrackを更新する
     *
     * @public
     * @param {LSTrack} lsTrack
     * @param {MediaStreamTrack} mediaStreamTrack
     */
    public replaceMediaStreamTrack(lsTrack: LSTrack, mediaStreamTrack: MediaStreamTrack): Promise<void>;

    /**
     * TrackのMuteTypeを変更する
     *
     * @public
     * @param {LSTrack} lsTrack
     * @param {MuteType} nextMuteType
     */
    public changeMute(lsTrack: LSTrack, nextMuteType: MuteType): Promise<void>;

    /**
     * ConnectionのMedia要件を変更する
     *
     * @public
     * @param {ConnectionID} connection_id
     * @param {"required"|"unrequired"} videoRequirement
     */
    public changeMediaRequirements(connection_id: ConnectionID, videoRequirement: "required" | "unrequired"): void;

    /**
     * videoの送信ビットレートを変更する
     *
     * @public
     * @param {Number} maxBitrateKbps
     */
    public changeVideoSendBitrate(maxBitrateKbps: number): void;

    /**
     * videoの送信フレームレートを変更する
     *
     * @public
     * @param {Number} maxFramerate
     */
    public changeVideoSendFramerate(maxFramerate: number): void;

    /**
     * 開始数分のログを取得する
     *
     * @public
     */
    public getHeadReport(): string;

    /**
     * 直近数分のログを取得する
     *
     * @public
     */
    public getTailReport(): string;

    /**
     * 直近数分のStatsを取得する
     *
     * @public
     */
    public getStatsReport(): string;
  }
  /**
   * MediaStreamTrack の wrapper
   *
   * @public
   * @class LSTrack
   */
  class LSTrack {
    /**
     *
     * @public
     * @param {MediaStreamTrack} track
     * @param {MediaStream} stream
     * @param {LSTrackOption} option
     */
    constructor(mediaStreamTrack: MediaStreamTrack, stream: MediaStream, option: LSTrackOption);
    /** @type MediaStreamTrack
     */
    mediaStreamTrack: MediaStreamTrack;
  }

  /**
   * SDK Error クラス
   *
   * @public
   * @class SDKError
   * @extends Error
   */
  class SDKError extends Error {
    /**
     * エラー内容
     */
    public detail: ErrorDetail;
    /**
     * 解析用文字列を取得する
     *
     * @public
     * @returns {String}
     */
    public toReportString();
  }

  /**
   * SDK Error イベント
   *
   * @public
   * @class SDKErrorEvent
   * @extends CustomEvent<any>
   */
  class SDKErrorEvent extends CustomEvent<any> {
    /**
     * エラー内容
     */
    public detail: ErrorDetail;
    /**
     * 解析用文字列を取得する
     *
     * @public
     * @returns {String}
     */
    public toReportString();
  }
}
