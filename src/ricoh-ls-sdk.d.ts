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
  const SIGNALING_URL = "wss://signaling.livestreaming.mw.smart-integration.ricoh.com/v1/room";
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
   * @typedef {"connecting" | "open" | "closing" | "close" | "error" | "addlocaltrack" | "addremotetrack" | "updateremotetrack" | "addremoteconnection" | "removeremoteconnection" | "updateremoteconnection" | "updateconnectionsstatus" | "updaterecording" | "updatemute" | "changestability" | "mediaopen" | "changemediastability" | "log"} EventType
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
    | "updateconnectionsstatus"
    | "updaterecording"
    | "updatemute"
    | "mediaopen"
    | "changestability"
    | "changemediastability"
    | "log";

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
    iceServersProtocol?: "all" | "udp" | "tcp" | "tls" | "tcp_tls";
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

  interface ConnectionsVideoStatus {
    receiver_existence: boolean;
  }

  interface ConnectionsStatus {
    video: ConnectionsVideoStatus;
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

  /** @typedef {{listener: EventListener, options: AddEventListenerOptions}} EventListenerWithOptions
   */
  type EventListenerWithOptions = any;

  interface LSConnectingEvent extends Event {}
  interface LSOpenEvent extends Event {
    access_token_json: string;
    connections_status?: Object;
  }
  interface LSClosingEvent extends Event {}
  interface LSCloseEvent extends Event {}
  interface LSAddRemoteConnectionEvent extends Event {
    connection_id: string;
    meta: Object;
  }
  interface LSUpdateRemoteConnectionEvent extends Event {
    connection_id: string;
    meta: Object;
  }
  interface LSRemoveRemoteConnectionEvent extends Event {
    connection_id: string;
    meta: Object;
    mediaStreamTrack?: MediaStreamTrack;
  }
  interface LSAddRemoteTrackEvent extends Event {
    connection_id: string;
    meta?: Object;
    mediaStreamTrack: MediaStreamTrack;
    stream: MediaStream;
    mute: MuteType;
    mid?: string;
  }
  interface LSUpdateRemoteTrackEvent extends Event {
    connection_id: string;
    mediaStreamTrack: MediaStreamTrack;
    stream: MediaStream;
    meta: Object;
  }
  interface LSChangeStabilityEvent extends Event {
    connection_id: string;
    stability: string;
  }
  interface LSChangeMediaStabilityEvent extends Event {
    connection_id: string;
    stability: string;
  }
  interface LSAddLocalTrackEvent extends Event {
    mediaStreamTrack: MediaStreamTrack;
    stream: MediaStream;
  }
  interface LSUpdateMuteEvent extends Event {
    connection_id: string;
    mediaStreamTrack: MediaStreamTrack;
    stream: MediaStream;
    mute: MuteType;
  }
  interface LSUpdateConnectionsStatusEvent extends Event {
    connections_status: ConnectionsStatus;
  }
  interface LSUpdateRecordingEvent extends Event {
    in_recording: boolean;
  }
  interface LSMediaOpenEvent extends Event {}
  interface LSLogEvent extends Event {
    msg: string;
    category: string;
    subcategory: string;
    date: Date;
  }

  interface LSClientEventMap {
    connecting: LSConnectingEvent;
    open: LSOpenEvent;
    closing: LSClosingEvent;
    close: LSCloseEvent;
    error: SDKErrorEvent;
    addremoteconnection: LSAddRemoteConnectionEvent;
    updateremoteconnection: LSUpdateRemoteConnectionEvent;
    removeremoteconnection: LSRemoveRemoteConnectionEvent;
    addremotetrack: LSAddRemoteTrackEvent;
    updateremotetrack: LSUpdateRemoteTrackEvent;
    changestability: LSChangeStabilityEvent;
    changemediastability: LSChangeMediaStabilityEvent;
    addlocaltrack: LSAddLocalTrackEvent;
    updatemute: LSUpdateMuteEvent;
    updateconnectionsstatus: LSUpdateConnectionsStatusEvent;
    updaterecording: LSUpdateRecordingEvent;

    mediaopen: LSMediaOpenEvent;
    log: LSLogEvent;
  }

  /**
   * SDK の中心となる Client クラス
   * このクラスを通してシグナリングやメディアの制御を行う
   *
   * @public
   * @class Client
   * @extends EventTarget
   */
  class Client extends EventTarget {
    /**
     * イベントハンドラを追加する(removeできない)
     *
     * @public
     * @param {EventType} eventName
     * @param {function} listener
     */
    public on<K extends keyof LSClientEventMap>(eventName: K, listener: (ev: LSClientEventMap[K]) => void): void;
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

    /**
     * 接続開始からのTrackログを取得する
     *
     * @public
     */
    public getTrackReport(): string;

    /**
     * LSTrack(local track)に対するmidを取得する
     *
     * @public
     * @param {LSTrack} lsTrack
     * @param {ConnectionID} connection_id*
     *
     */
    public getLocalTrackMid(lsTrack: LSTrack, connection_id: ConnectionID): string;
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
    public toReportString(): string;
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
     * エラーが切断を伴うかどうか　true: 切断あり, false: 切断なし
     */
    public withDisconnection: boolean;
    /**
     * 解析用文字列を取得する
     *
     * @public
     * @returns {String}
     */
    public toReportString(): string;
  }
}
