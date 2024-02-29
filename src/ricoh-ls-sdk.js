//@ts-check
/** @module ricoh-ls-sdk */
/** @typedef {string} ConnectionID */
/** @typedef {string} RoomSessionID */
/** @typedef {string} P2PSessionID */
/** @typedef {string} ClientID */
/** @typedef {string} JwtAccessToken */
/** @typedef {string} TrackID */

/**
 * @typedef {object} ConnectOption
 * @property {LSTrack[]} localLSTracks
 * @property {Meta} meta
 * @property {string} signalingURL
 * @property {ConnectionReceivingOptions} receiving
 * @property {ConnectionSendingOptionsUser} sending
 * @property {"relay"|"all"} iceTransportPolicy
 * @property {"all"|"udp"|"tcp"|"tls"|"tcp_tls"} iceServersProtocol
 */

/**
 * @typedef {object} SendingVideoOption
 * @property {"h264" | "vp8" | "vp9" | "h265" | "av1"} codec
 * @property {"normal" | "high"} priority
 * @property {number} maxBitrateKbps
 */

/**
 * @typedef {object} SendingOption
 * @property {SendingVideoOption} video
 * @property {boolean} enabled
 */

/**
 * @typedef {object} ReceivingOption
 * @property {boolean} enabled
 */

/**
 * @typedef {object} LSTrackOption
 * @property {Meta} meta
 * @property {MuteType} mute
 */

/**
 * @typedef {object} Log
 * @property {Date} dt
 * @property {string} log
 */

/**
 * @typedef {object} LabeledLog
 * @property {string} target
 * @property {string} prop
 * @property {Date} dt
 * @property {string} log
 */

/**
 * @typedef {object} LabeledHistory
 * @property {string} target
 * @property {string} prop
 * @property {Log[]} history
 */

/**
 * @typedef {object} ConnectionInfo
 * @property {"trackadded"|"joined"|"timeout"} state
 * @property {number} join
 * @property {Role} sendrecv
 * @property {object} [reservedUpdate]
 */

/**
 * @typedef {object} Tag
 * @property {string} name
 * @property {any} value
 */

/**
 * @typedef {object} LocalTag
 * @property {"sdk" | "app_front"| "app_back"} source
 * @property {boolean} [use_analysis]
 * @property {boolean} [use_notification]
 * @property {string} name
 * @property {any} value
 */

/**
 * @typedef {object} RemoteTag
 * @property {"sdk" | "app_front"} source
 * @property {string} name
 * @property {any} value
 */

/**
 * @typedef {object} RemoteTrackMetadata
 * @property {ConnectionID} connection_id
 * @property {TrackID} track_id
 * @property {string} msid
 * @property {string} mid
 * @property {"video" | "audio"}  kind
 * @property {RemoteTag[]} tags
 * @property {MediaStream|null} [stream]
 * @property {MediaStreamTrack|null} [track]
 */

/**
 * @typedef {object} LocalTrackMetadata
 * @property {TrackID} track_id
 * @property {LocalTag[]} tags
 */

/**
 * @typedef {object} LocalTrackSlot
 * @property {TrackID} track_id
 * @property {string} msid
 * @property {string} mid
 * @property {"video"|"audio"} kind
 */

/**
 * @typedef {object} InitialUpdateSendingVideoOptionVideo
 * @property {number} max_bitrate_kbps
 */

/**
 * @typedef {object} InitialUpdateSendingVideoOption
 * @property {InitialUpdateSendingVideoOptionVideo} video
 */

/**
 * @typedef {object} InitialUpdateSendingVideoOptionMuteVideo
 * @property {string} mute_type
 */

/**
 * @typedef {object} InitialUpdateSendingVideoOptionMute
 * @property {InitialUpdateSendingVideoOptionMuteVideo} video
 */

/**
 * @typedef {object} InitialUpdateTrack
 * @property {LocalLSTrack} localLSTrack
 * @property {LocalTag[]} tags
 */

/**
 * @typedef {object} InitialUpdateReceivingVideosOption
 * @property {boolean} enabled
 */

/**
 * @typedef {object} InitialReplaceMediaStreamTrack
 * @property {LocalLSTrack} localLSTrack
 * @property {MediaStreamTrack} mediaStreamTrack
 */

/**
 * @typedef {Object.<string, string>} Meta
 */

/**
 * @typedef {object} ConnectionVideoStatus
 * @property {boolean} receiver_existence
 */

/**
 * @typedef {object} ConnectionStatus
 * @property {ConnectionVideoStatus} video
 */

/**
 * @typedef {object} SDKInfo
 * @property {"web"} platform
 * @property {string} version
 */

/**
 * @typedef {object} ConnectMessage
 * @property {"connect"} message_type
 * @property {ClientID|null} client_id
 * @property {JwtAccessToken|null} access_token
 * @property {LocalTag[]} tags
 * @property {SDKInfo} sdk_info
 * @property {ConnectOptions} options
 */

/**
 * @typedef {object} ConnectSuccessMessage
 * @property {"connect_success"} message_type
 * @property {RoomSessionID} room_session_id
 * @property {RTCIceServer[]} ice_servers
 * @property {Connection[]} connections
 * @property {any} connections_status
 * @property {object} access_token_info
 */

/**
 * @typedef {object} P2PRequestOfferMessage
 * @property {"p2p.request_offer"} message_type
 * @property {ConnectionID} peer_connection_id
 * @property {P2PSessionID} p2psession_id
 */

/**
 * @typedef {object} P2PRelayOfferMessage
 * @property {"p2p.relay_offer"} message_type
 * @property {ConnectionID} peer_connection_id
 * @property {RTCSessionDescription} sdp
 * @property {P2PSessionID} p2psession_id
 */

/**
 * @typedef {object} P2PRelayAnswerMessage
 * @property {"p2p.relay_answer"} message_type
 * @property {ConnectionID} peer_connection_id
 * @property {RTCSessionDescription} sdp
 * @property {P2PSessionID} p2psession_id
 */

/**
 * @typedef {object} P2PRelayIcecandidateMessage
 * @property {"p2p.relay_answer"} message_type
 * @property {ConnectionID} peer_connection_id
 * @property {RTCIceCandidate|null} candidate
 * @property {P2PSessionID} p2psession_id
 */

/**
 * @typedef {object} SFURelayIcecandidateMessage
 * @property {"sfu.relay_icecandidate"} message_type
 * @property {RTCIceCandidate|null} candidate
 */

/**
 * @typedef {object} SFUOfferMessage
 * @property {"sfu.offer"} message_type
 * @property {RTCSessionDescription} sdp
 * @property {LocalTrackSlot[]} local_track_slots
 * @property {RemoteTrackMetadata[]} remote_track_metadata
 */

/**
 * @typedef {object} SFUUpdateOfferMessage
 * @property {"sfu.update_offer"} message_type
 * @property {RTCSessionDescription} sdp
 * @property {RemoteTrackMetadata[]} remote_track_metadata
 */

/**
 * @typedef {object} ConnectionConnectingOptions
 * @property {Array<"udp"|"tcp"|"tls">} turn_protocols
 */
/**
 * @typedef {object} ConnectionSendingVideoOptions
 * @property {"h264"|"vp8"|"vp9"|"h265"|"av1"} codec
 * @property {"normal"|"high"} priority
 * @property {number} max_bitrate_kbps
 * @property {"unmute"|"hard"|"soft"} [mute_type]
 */

/**
 * @typedef {object} ConnectionSendingOptionsUser
 * @property {boolean} enabled
 * @property {ConnectionSendingVideoOptionsUser} video
 */

/**
 * @typedef {object} ConnectionSendingVideoOptionsUser
 * @property {"h264"|"vp8"|"vp9"|"h265"|"av1"} codec
 * @property {"normal"|"high"} priority
 * @property {number} maxBitrateKbps
 */

/**
 * @typedef {object} ConnectionSendingOptions
 * @property {boolean} enabled
 * @property {ConnectionSendingVideoOptions} video
 */

/**
 * @typedef {object} ConnectionReceivingOptions
 * @property {boolean} enabled
 */

/**
 * @typedef {object} ConnectOptions
 * @property {ConnectionConnectingOptions} connecting
 * @property {ConnectionSendingOptions} sending
 * @property {ConnectionReceivingOptions} receiving
 */

/**
 * @typedef {object} Connection
 * @property {ConnectionID} connection_id
 * @property {RemoteTag[]} tags
 * @property {ConnectOptions} options
 */

/**
 * @typedef {object} NotifyConnectionConnectMessage
 * @property {"notify.connection.connect"} message_type
 * @property {Connection} connection
 */

/**
 * @typedef {object} NotifyConnectionLeaveMessage
 * @property {"notify.connection.leave"} message_type
 * @property {Connection} connection
 */

/**
 * @typedef {object} NotifyConnectionUpdateMessage
 * @property {"notify.connection.update"} message_type
 * @property {ConnectionID} connection_id
 * @property {RemoteTag[]} tags
 */

/**
 * @typedef {object} NotifySFUTrackUpdateMessage
 * @property {"notify.sfu.track.update"} message_type
 * @property {ConnectionID} connection_id
 * @property {TrackID} track_id
 * @property {RemoteTag[]} tags
 */

/**
 * @typedef {object} ConnectionsVideoStatus
 * @property {boolean} receiver_existence
 */

/**
 * @typedef {object} ConnectionsStatus
 * @property {ConnectionsVideoStatus} video
 */

/**
 * @typedef {object} NotifySFUConnectionsUpdateMessage
 * @property {"notify.sfu.track.update"} message_type
 * @property {ConnectionsStatus} connections_status
 */

/**
 * @typedef {object} ErrorMessage
 * @property {"error"} message_type
 * @property {string} client_message_type
 * @property {number} error_code
 * @property {string} reason
 */

/**
 * @typedef {object} PingMessage
 * @property {"ping"} message_type
 * @property {string} timestamp
 */

/**
 * @typedef {object} DebugInfoObject
 * @property {string} timestamp
 * @property {string} room_instance_id
 * @property {string} connection_instance_id
 * @property {object} token_info
 * @property {{sora: string, turn: string, back_signaling: string}} service_ids
 */

/**
 * @typedef {object} DebugInfoMessage
 * @property {"debug_info"} message_type
 * @property {DebugInfoObject} debug_info
 */

/**
 * @typedef {object} AddLocalTrackObj
 * @property {MediaStreamTrack} mediaStreamTrack
 * @property {MediaStream} stream
 */

/**
 * @typedef {object} AddRemoteTrackObj
 * @property {ConnectionID} connection_id
 * @property {MediaStreamTrack} mediaStreamTrack
 * @property {MediaStream} stream
 * @property {Meta[]} [meta]
 * @property {MuteType} [mute]
 */

/**
 * @typedef {object} AddRemoteConnectionObj
 * @property {ConnectionID} connection_id
 * @property {Meta[]} [meta]
 */

/**
 * @typedef {object} UpdateRemoteTrackObj
 * @property {ConnectionID} connection_id
 * @property {MediaStreamTrack|null|undefined} mediaStreamTrack
 * @property {MediaStream|null|undefined} stream
 * @property {Meta[]} meta
 */

/**
 * @typedef {object} UpdateConnectionsStatusObj
 * @property {ConnectionsStatus} connections_status
 */

/**
 * @typedef {object} UpdateMuteObj
 * @property {ConnectionID} connection_id
 * @property {MediaStreamTrack|null|undefined} mediaStreamTrack
 * @property {MediaStream|null|undefined} stream
 * @property {MuteType} mute
 */

/**
 * @typedef {object} UpdateRemoteConnectionObj
 * @property {ConnectionID} connection_id
 * @property {Meta[]} meta
 */

/**
 * @typedef {object} RemoveRemoteConnectionObj
 * @property {ConnectionID} connection_id
 * @property {Meta[]} meta
 * @property {Array<MediaStreamTrack|null|undefined>} [mediaStreamTracks]
 */

/**
 * @typedef {object} ChangeStabilityObj
 * @property {ConnectionID} connection_id
 * @property {"iceconnecttimeout"|"icestable"|"iceunstable"} stability
 */

/**
 * @typedef {object} CandidatePair
 * @property {string} id
 * @property {string} localCandidateId
 * @property {string} availableOutgoingBitrate
 * @property {string} availableIncomingBitrate
 */

/**
 * @typedef {object} SendingVideo
 * @property {string} [mute_type]
 * @property {number} [max_bitrate_kbps]
 */

/** @type {string} */
const SIGNALING_URL = "wss://signaling.livestreaming.mw.smart-integration.ricoh.com/v1/room";

/**
 * Client の State Type
 *
 * @public
 * @typedef {"idle" | "connecting" | "open" | "closing" | "closed"} StateType
 */

/**
 * Client の Event Type
 *
 * @public
 * @typedef {"connecting" | "open" | "closing" | "close" | "error" | "addlocaltrack" | "addremotetrack" | "updateremotetrack" | "addremoteconnection" | "removeremoteconnection" | "updateremoteconnection" | "updateconnectionsstatus" |  "updatemute" | "changestability" | "mediaopen" | "changemediastability"} EventType
 */

/**
 * LSTrack の Mute type
 *
 * @public
 * @typedef {"unmute" | "softmute" | "hardmute" } MuteType
 */

/**
 * Client の Role
 *
 * @public
 * @typedef {"sendrecv" | "sendonly" | "recvonly" | "void"} Role
 */

/**
 * Client の 送信モード
 *
 * @public
 * @typedef {"normal" | "priority"} SendingMode
 */

/**
 * Safari が EventTarget を継承できないので Polyfill
 * Client が動く程度の範囲で実装
 *
 * @public
 * @class ET
 */
class ET {
  /** @typedef {{listener: EventListener, options: AddEventListenerOptions}} EventListenerWithOptions */

  constructor() {
    /** @type {Map<string, EventListenerWithOptions[]>} */
    this.listeners = new Map();
  }

  /**
   * @param {string} type
   * @param {EventListener} listener
   * @param {AddEventListenerOptions} options
   */
  addEventListener(type, listener, options = {}) {
    const listeners = this.listeners.get(type) || [];
    listeners.push({ listener, options });
    this.listeners.set(type, listeners);
  }

  /**
   * @param {Event} event
   */
  dispatchEvent(event) {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach(({ listener, options }) => {
      listener.call(this, event);
      if (!options.once) return;
      this.removeEventListener(event.type, listener, options);
    });
  }

  /**
   *
   * @param {string} type
   * @param {EventListener} func
   * @param {AddEventListenerOptions} options
   */
  removeEventListener(type, func, options = {}) {
    const listeners = this.listeners.get(type) || [];
    const removed = listeners.filter(({ listener }) => listener !== func);
    this.listeners.set(type, removed);
  }
}

/**
 * Log出力 クラス
 *
 * @private
 * @extends EventTarget*
 */
class Logger extends EventTarget {
  /**
   * @param {{headperiod: number, tailperiod: number}} option
   */
  constructor(option) {
    super();
    /**
     * @private
     * @type {number}
     */
    this.headperiod = option.headperiod; // msec

    /**
     * @private
     * @type {number}
     */
    this.tailperiod = option.tailperiod; // msec

    /**
     * @private
     * @type {number}
     */
    this.starttime = new Date().getTime();
  }

  /**
   * 新規logをheads/tailsに追加し、古いlogを削除する
   *
   * @public
   * @param {string} category
   * @param {string} subcategory
   * @param {Log[]|null} headHistory
   * @param {Log[]} tailHistory
   * @param {string} log
   * @returns {Log[]}
   */
  putLog(category, subcategory, headHistory, tailHistory, log) {
    const entry = { dt: new Date(), log };
    const epoch = entry.dt.getTime();

    this.dispatchEvent(new CustomEvent("logged", { detail: { log, category, subcategory, date: entry.dt } }));

    if (headHistory !== null) {
      if (epoch < this.starttime + this.headperiod) headHistory.push(entry);
    }
    tailHistory.push(entry);

    // 古いtailログの削除
    const len = tailHistory.length;
    let n = 0;
    for (let i = 0; i < len; i++) {
      if (epoch - this.tailperiod < tailHistory[i].dt.getTime()) break;
      n++;
    }
    if (n !== 0) tailHistory.splice(0, n);
    return tailHistory;
  }
}

/**
 * Report出力 クラス
 *
 * @private
 */
class Report {
  /**
   * @param {string} id
   */
  constructor(id) {
    /**
     * @private
     * @type {string}
     */
    this.id = id;
    /**
     * @private
     * @type {LabeledHistory[]}
     */
    this.labeledHistories = [];
  }

  /**
   * @private
   * @param {LabeledLog[]} merged
   * @returns {string}
   */
  mergedStr(merged) {
    let str = `${this.id}:\n`;
    merged.forEach((labeledLog) => {
      str += `[${labeledLog.dt.toISOString()}]\t${labeledLog.target}\t${labeledLog.prop}\t${labeledLog.log}\n`;
    });
    return str;
  }

  /**
   * Historyをmergeして出力
   *
   * @public
   * @returns {string}
   */
  dumpMerged() {
    /** @type {LabeledLog[]} */
    let merged = [];
    this.labeledHistories.forEach((labeledHistory) => {
      merged = merged.concat(
        labeledHistory.history.map((log) => {
          return { target: labeledHistory.target, prop: labeledHistory.prop, dt: log.dt, log: log.log };
        }),
      );
    });
    merged.sort((a, b) => {
      if (a.dt === b.dt) return 0;
      return a.dt < b.dt ? -1 : 1;
    });
    return this.mergedStr(merged);
  }

  /**
   * historyを追加
   *
   * @public
   * @param {string} target
   * @param {string} prop
   * @param {Log[]|undefined} history
   */
  addHistory(target, prop, history) {
    if (history) this.labeledHistories.push({ target, prop, history });
  }
}
/**
 * RTCPeerConnection の拡張クラス
 *
 * @private
 */
class Peer extends RTCPeerConnection {
  /**
   * @param {ConnectionID} connection_id
   * @param {RTCConfiguration} rtcConfiguration
   * @param {Logger|null} logger
   */
  constructor(connection_id, rtcConfiguration, logger) {
    super(rtcConfiguration);
    Object.setPrototypeOf(this, Peer.prototype);

    if (logger) {
      /**
       * @private
       * @type {Logger}
       */
      this.logger = logger;
    }

    /**
     * @private
     * @type {"initial"|RTCPeerConnectionState}
     */
    this.connectionStateLatest = "initial";

    /**
     * @public
     * @type {Log[]}
     */
    this.connectionStateHeadHistory = [];
    /**
     * @public
     * @type {Log[]}
     */
    this.connectionStateTailHistory = [];

    /**
     * @private
     * @type {"initial"|RTCSignalingState}
     */
    this.signalingStateLatest = "initial";

    /**
     * @public
     * @type {Log[]}
     */
    this.signalingStateHeadHistory = [];

    /**
     * @public
     * @type {Log[]}
     */
    this.signalingStateTailHistory = [];

    /**
     * @private
     * @type {"initial"|RTCIceConnectionState}
     */
    this.iceConnectionStateLatest = "initial";

    /**
     * @public
     * @type {Log[]}
     */
    this.iceConnectionStateHeadHistory = [];
    /**
     * @public
     * @type {Log[]}
     */
    this.iceConnectionStateTailHistory = [];

    /**
     * @private
     * @type {"initial"|RTCIceGatheringState}
     */
    this.iceGatheringStateLatest = "initial";

    /**
     * @public
     * @type {Log[]}
     */
    this.iceGatheringStateHeadHistory = [];
    /**
     * @public
     * @type {Log[]}
     */
    this.iceGatheringStateTailHistory = [];

    /**
     * @public
     * @type {Log[]}
     */
    this.iceEventHeadHistory = [];

    /**
     * @public
     * @type {Log[]}
     */
    this.iceEventTailHistory = [];

    /**
     * @public
     * @type {Log[]}
     */
    this.statsHistory = [];

    /**
     * @public
     * @type {ConnectionID}
     */
    this.connection_id = connection_id;

    /**
     * @private
     * @type {number}
     */
    this.startTime = new Date().getTime();
    /**
     * @private
     * @type {"initial"|"connected"|"timeout"}
     */
    this.iceConnectState = "initial";

    /**
     * @private
     * @type {Array<Object>}
     */
    this.connectedTracks = [];

    this.on("signalingstatechange", () => {
      this.signalingStateTailHistory = this.putLog("signalingState", this.signalingStateHeadHistory, this.signalingStateTailHistory, `${this.signalingState} <- ${this.signalingStateLatest}`);
      this.signalingStateLatest = this.signalingState;

      if (this.signalingState == "stable") this.emitTrackEvents();
    });
    this.on("iceconnectionstatechange", () => {
      this.iceConnectionStateTailHistory = this.putLog(
        "iceConnectionState",
        this.iceConnectionStateHeadHistory,
        this.iceConnectionStateTailHistory,
        `${this.iceConnectionState} <- ${this.iceConnectionStateLatest}`,
      );
      this.iceConnectionStateLatest = this.iceConnectionState;
      if (this.iceConnectionState === "connected") {
        this.iceConnectState = "connected";
        this.emit("iceconnected", {});
      }
    });
    this.on("icegatheringstatechange", () => {
      this.iceGatheringStateTailHistory = this.putLog(
        "iceGatheringState_",
        this.iceGatheringStateHeadHistory,
        this.iceGatheringStateTailHistory,
        `${this.iceGatheringState} <- ${this.iceGatheringStateLatest}`,
      );
      this.iceGatheqingStateLatest = this.iceGatheringState;
    });
    this.on("connectionstatechange", () => {
      this.connectionStateTailHistory = this.putLog("connectionState", this.connectionStateHeadHistory, this.connectionStateTailHistory, `${this.connectionState} <- ${this.connectionStateLatest}`);
      this.connectionStateLatest = this.connectionState;
    });
    this.on("icecandidateerror", (e) => {
      const errstr = `icecandidateerror(${e.errorCode}) ${e.errorText}, ${e.address}:${e.port}, ${e.url}`;
      this.iceEventTailHistory = this.putLog("iceEvent", this.iceEventHeadHistory, this.iceEventTailHistory, errstr);
      if (e.errorCode !== 600 && e.errorCode !== 701) console.error(e);
    });

    /**
     * signalingstatechange で remoteDescription がセットされるまで待つための Promise
     *
     * @type {Promise<void>}
     */
    this.remoteSDP = this.waitRemoteDescription();

    /** @type {RemoteTrackMetadata[]} */
    this.remote_track_metadata = [];

    /** @type {number} */
    this.timerid = window.setInterval(this.monitor.bind(this), 2500);

    /** @type {"stable"|"unstable"} */
    this.stability = "stable";

    /** @type {boolean} */
    this.iceSucceeded = false;
  }

  /**
   * @private
   */
  putLog(type, headHistory, tailHistory, msg) {
    const conn_id = this.connection_id == "" ? "sfu" : this.connection_id;
    return this.logger.putLog(`Peer(${conn_id})`, type, headHistory, tailHistory, msg);
  }

  /**
   * @private
   */
  putLog(type, headHistory, tailHistory, msg) {
    const conn_id = this.connection_id == "" ? "sfu" : this.connection_id;
    return this.logger.putLog(`Peer(${conn_id})`, type, headHistory, tailHistory, msg);
  }

  /**
   * @private
   */
  emitTrackEvents() {
    const tracks = [];
    this.getReceivers().forEach((r) => {
      if (r.track.readyState != "ended") {
        const codec = typeof r.getParameters == "function" ? r.getParameters()?.codecs[0]?.mimeType : undefined;
        const isRemoteTrack = this.remote_track_metadata.find((t) => t.track?.id === r.track.id);
        if (isRemoteTrack) tracks.push({ id: r.track.id, kind: r.track.kind, codec });
      }
    });
    const connected = tracks.filter((t) => this.connectedTracks.every((c) => c.id !== t.id));
    connected.forEach((t) => {
      this.emit("trackconnected", { id: t.id, codec: t.codec, kind: t.kind });
    });
    const disconnected = this.connectedTracks.filter((c) => tracks.every((t) => t.id !== c.id));
    disconnected.forEach((t) => {
      this.emit("trackdisconnected", { id: t.id, kind: t.kind });
    });
    this.connectedTracks = tracks;
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  waitRemoteDescription() {
    return new Promise((done) => {
      const waitRemoteSDP = () => {
        if (!this.remoteDescription) return;
        this.removeEventListener("signalingstatechange", waitRemoteSDP);
        done();
      };
      this.addEventListener("signalingstatechange", waitRemoteSDP);
    });
  }

  /**
   * @public
   * @param {RemoteTrackMetadata[]} remote_track_metadata
   */
  setRemoteTrackMetadata(remote_track_metadata) {
    /** @type {Object.<TrackID, {track: MediaStreamTrack|null, stream: MediaStream|null}>} */
    const lastinfo = this.remote_track_metadata.reduce((ret, a) => {
      ret[a.track_id] = { track: a.track, stream: a.stream };
      return ret;
    }, {});

    this.remote_track_metadata = remote_track_metadata;

    this.remote_track_metadata.forEach((e) => {
      const last = lastinfo[e.track_id];
      if (!last) return;
      e.track = last.track;
      e.stream = last.stream;
    });
  }

  /**
   * LSTrackにtrack_idを割り当てる
   *
   * @public
   * @param {LocalTrackSlot[]} local_track_slots
   * @param {LocalLSTrack[]} loclsTracks
   */
  assignTrackIdToTrack(local_track_slots, loclsTracks) {
    const videos = local_track_slots.filter((s) => s.kind === "video").map((s) => s.track_id);
    const audios = local_track_slots.filter((s) => s.kind === "audio").map((s) => s.track_id);

    loclsTracks.forEach((loclsTrack) => {
      const track_id = loclsTrack.mediaStreamTrack.kind === "video" ? videos.shift() : audios.shift();
      if (track_id) loclsTrack.track_id = track_id;
    });
  }

  /**
   * local_track_metadataを作成する
   *
   * @public
   * @param {LocalTrackSlot[]} local_track_slots
   * @param {Array<LocalLSTrack>} loclsTracks
   * @returns {LocalTrackMetadata[]}
   */
  makeLocalTrackMeta(local_track_slots, loclsTracks) {
    return local_track_slots.map((slot) => {
      const track_id = slot["track_id"];
      const localLSTrack = loclsTracks.find((loclsTrack) => loclsTrack.track_id === track_id);
      if (!localLSTrack) return { track_id, tags: [] };

      /** @type {LocalTag[]}*/
      const tags = Object.entries(localLSTrack.meta).map(([name, value]) => ({
        name,
        value,
        source: "app_front",
        use_notification: true,
      }));
      tags.push({
        name: "muteState",
        value: localLSTrack.getMuteState(),
        source: "sdk",
        use_notification: true,
      });
      return { track_id, tags };
    });
  }

  /**
   * addEventListener の wrapper
   * CustomEvent の場合 detail を listener に渡す
   * removeEventListener 出来ない点に注意
   *
   * @public
   * @param {string} eventName
   * @param {function} listener
   */
  on(eventName, listener) {
    this.addEventListener(eventName, (e) => {
      const target = e instanceof CustomEvent ? e.detail : e;
      listener(target);
    });
  }

  /**
   * dispachEvent の wrapper
   * CustomEvent を生成して dispatch する
   *
   * @public
   * @param {string} name
   * @param {any} detail
   */
  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  /**
   * @public
   * @param {LocalLSTrack[]} loclsTracks
   * @returns {Promise}
   */
  addTracks(loclsTracks) {
    return new Promise((done) => {
      // TODO: renegotiation を考える
      this.on("negotiationneeded", done);

      // addTrack した結果 negotiationeeded したら resolve
      loclsTracks.forEach((loclsTrack) => {
        this.addTrack(loclsTrack.mediaStreamTrack, loclsTrack.stream);
        loclsTrack.addSenders(this);
      });
    });
  }

  /**
   * @public
   * @param {MediaStreamTrack} [mediaStreamTrack]
   * @return {Promise<{connection_id: ConnectionID, report: RTCStatsReport}>}
   */
  getConnectionStats(mediaStreamTrack) {
    const promise = mediaStreamTrack ? this.getStats(mediaStreamTrack) : this.getStats();
    return promise.then((report) => {
      // 空文字のconnection_idはないため偽であればsfu
      const connection_id = this.connection_id ? this.connection_id : "sfu";
      return { connection_id, report };
    });
  }

  /**
   * Offer を生成し適用してから返す
   *
   * @public
   * @param {RTCOfferOptions} [options={}]
   * @return {Promise<RTCSessionDescription|null>}
   */
  async getOffer(options) {
    await this.setLocalDescription(await super.createOffer(options));
    if (this.localDescription) return new RTCSessionDescription(this.localDescription);
    else return null;
  }

  /**
   * @public
   * @param {RTCSessionDescription} offer
   * @return {Promise<RTCSessionDescriptionInit>}
   */
  async createAnswerSDP(offer) {
    await this.setRemoteDescription(offer);
    return await super.createAnswer();
  }

  /**
   * @public
   * @param {RTCSessionDescriptionInit} answer
   * @return {Promise<RTCSessionDescription|null>}
   */
  async setAnswerSDP(answer) {
    await this.setLocalDescription(answer);
    if (this.localDescription) return new RTCSessionDescription(this.localDescription);
    return null;
  }

  /**
   * 受信した Answer を適用する
   *
   * @public
   * @param {RTCSessionDescription} answer
   */
  async setAnswer(answer) {
    await this.setRemoteDescription(answer);
  }

  /**
   * Remote SDP があることを確認してから addIceCandidate する
   *
   * @public
   * @param {RTCIceCandidate} candidate
   */
  async setIceCandidate(candidate) {
    // Remote SDP が無い状態で addIceCandidate すると Firefox はエラーになるので待つ
    await this.remoteSDP;
    await super.addIceCandidate(candidate);
  }

  /**
   * @private
   */
  iceConnectionSuccessLog(stats) {
    const pairs = [];
    stats.forEach((stat) => {
      if (stat.type === "candidate-pair") pairs.push(stat);
    });
    stats.forEach((stat) => {
      if (stat.type == "local-candidate") {
        pairs.forEach((pair) => {
          if (pair.localCandidateId === stat.id) pair.local = stat;
        });
      }
    });
    pairs.forEach((pair) => {
      const local = pair.local;
      const logstr = `ice success: ${pair.id}(${pair.state}):${local.networkType}, ${local.candidateType}(${local.relayProtocol}), ${local.url}`;
      this.iceEventTailHistory = this.putLog("iceEvent", this.iceEventHeadHistory, this.iceEventTailHistory, logstr);
    });
  }

  /**
   * @private
   */
  async monitor() {
    const stats = await this.getStats();

    /** @type {RTCStats[]} */
    const statsArray = [];
    stats.forEach((s) => {
      statsArray.push(s);
    });
    this.statsHistory = this.logger.putLog("Client", "stats", null, this.statsHistory, JSON.stringify(statsArray));

    /** @type {ChangeStabilityObj} */
    const obj = { connection_id: this.connection_id, stability: "icestable" };

    if (this.iceConnectState === "initial") {
      const now = new Date().getTime();
      if (30 * 1000 < now - this.startTime) {
        obj.stability = "iceconnecttimeout";
        this.emit("changestability", obj);
        this.iceConnectState = "timeout";
      }
    }

    if (this.connectionState === "connected" && this.iceSucceeded == false) {
      this.iceSucceeded = true;
      this.iceConnectionSuccessLog(stats);
    }

    if (this.connectionState === "connected" && this.stability === "unstable") {
      this.stability = "stable";
      obj.stability = "icestable";
      this.emit("changestability", obj);
    } else if (this.connectionState === "disconnected" && this.stability === "stable") {
      this.stability = "unstable";
      obj.stability = "iceunstable";
      this.emit("changestability", obj);
    }
  }

  stop() {
    window.clearInterval(this.timerid);
  }
}

/**
 * WebSocket の拡張クラス
 *
 * @private
 */
class WS extends WebSocket {
  /**
   * @param {string} url
   * @param {Logger} logger
   * @param {string | string[]} [protocol=[]]
   */
  constructor(url, logger, protocol) {
    super(url, protocol);
    Object.setPrototypeOf(this, WS.prototype);
    this.addEventListener("message", this.onMessage.bind(this));

    /** @type {Logger} */
    this.logger = logger;
    /** @type {Log[]} */
    this.sendHeadHistory = [];
    /** @type {Log[]} */
    this.sendTailHistory = [];
    /** @type {Log[]} */
    this.recvHeadHistory = [];
    /** @type {Log[]} */
    this.recvTailHistory = [];

    /** @type {number} */
    this.lastReceived = new Date().getTime();
  }

  /**
   * 受信したメッセージタイプに応じて CustomEvent を作り上げる
   *
   * @private
   * @param {object} e
   */
  onMessage(e) {
    this.recvTailHistory = this.logger.putLog("WebSocket", "recvMessage", this.recvHeadHistory, this.recvTailHistory, e.data);

    this.lastReceived = new Date().getTime();

    /** @type {object} */
    const message = JSON.parse(e.data);
    this.dispatchEvent(new CustomEvent("_" + message.message_type, { detail: message }));
  }

  /**
   * メッセージを JSON シリアライズして送信する
   *
   * @public
   * @param {object} message
   */
  sendMessage(message) {
    const msg = JSON.stringify(message);
    super.send(msg);

    this.sendTailHistory = this.logger.putLog("WebSocket", "sendMessage", this.sendHeadHistory, this.sendTailHistory, msg);
  }

  /**
   * addEventListener の wrapper
   * CustomEvent の場合だけ detail を listener に渡す
   * removeEventListener 出来ない点に注意
   *
   * @public
   * @param {string} eventName
   * @param {function} listener
   */
  on(eventName, listener) {
    this.addEventListener("_" + eventName, (e) => {
      if (!(e instanceof CustomEvent)) return;
      listener(e.detail);
    });
  }
}

/**
 * appからlocalLSTrackを指定するためのデータ構造
 *
 * @public
 * @class LSTrack
 */
class LSTrack {
  /**
   * @public
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} stream
   * @param {LSTrackOption} option
   */
  constructor(mediaStreamTrack, stream, option) {
    /**
     * @public
     * @type {MediaStreamTrack}
     */
    this.mediaStreamTrack = mediaStreamTrack;

    /**
     * @public
     * @type {MediaStream}
     */
    this.stream = stream;

    /**
     * @public
     * @type {Meta}
     */
    this.meta = {};

    if (option.meta) this.meta = option.meta;

    /**
     * @public
     * @type {MuteType}
     */
    this.muteType = "unmute";

    if (option.mute) this.muteType = option.mute;
  }
}

/**
 * 内部で扱うLSTrack
 *
 * @package
 * @class LocalLSTrack
 */
class LocalLSTrack {
  /**
   * @public
   * @param {LSTrack} lsTrack
   */
  constructor(lsTrack) {
    /** @type {TrackID} */
    this.track_id = "";
    /** @type {MuteType} */
    this.muteType = lsTrack.muteType;
    /** @type {MediaStreamTrack} */
    this.mediaStreamTrack = lsTrack.mediaStreamTrack;
    /** @type {MediaStreamTrack} */
    this.senderMediaStreamTrack = lsTrack.mediaStreamTrack;
    /** @type {Meta} */
    this.meta = lsTrack.meta;
    /** @type {MediaStream} */
    this.stream = lsTrack.stream; // addTrack()以降使用してはいけない
    /** @type {LSTrack} */
    this.lsTrack = lsTrack; // appからのLocalLSTrack特定にのみ使用し、以降中身は参照しない
    /** @type {RTCRtpSender[]} */
    this.senders = [];
    /** @type {number|null} */
    this.initialFramerate = null;
  }

  getMuteState() {
    if (this.muteType === "softmute") return "blank";
    if (this.muteType === "hardmute") return "paused";
    return "on"; // unmute
  }

  getMuteType() {
    if (this.muteType === "softmute") return "soft";
    if (this.muteType === "hardmute") return "hard";
    return "unmute";
  }

  addSenders(peer) {
    /** @type {RTCRtpSender[]} */
    const senders = peer.getSenders().filter((sender) => {
      if (!sender || !sender.track || !sender.track.kind) return false;
      return sender.track.kind === this.mediaStreamTrack.kind;
    });
    this.senders = this.senders.concat(senders);
  }

  removeSenders(peer) {
    /** @type {RTCRtpSender[]} */
    const senders = peer.getSenders().filter((sender) => {
      if (!sender || !sender.track || !sender.track.kind) return false;
      return sender.track.kind === this.mediaStreamTrack.kind;
    });
    this.senders = this.senders.filter((sender) => !senders.includes(sender));
  }

  async replaceSenderTrack(msTrack) {
    this.senderMediaStreamTrack = msTrack;
    for (let i in this.senders) await this.senders[i].replaceTrack(this.senderMediaStreamTrack);
  }

  async changeFramerate(framerate) {
    for (const sender of this.senders) {
      if (sender.track === null) return;
      if (sender.track.kind !== "video") return;
      const parameters = sender.getParameters();
      if (!parameters.encodings) parameters.encodings = [{}];
      // @ts-ignore
      if (parameters.encodings[0]) parameters.encodings[0].maxFramerate = framerate;
      await sender.setParameters(parameters);
    }
    if (this.senders.every((sender) => sender.track === null)) this.initialFramerate = framerate;
  }

  updateEncodingParameters() {
    if (this.initialFramerate !== null) {
      this.changeFramerate(this.initialFramerate);
      this.initialFramerate = null;
    }
  }
}

/**
 * 内部エラー表現クラス
 *
 * @private
 * @class ErrorData
 */
class ErrorData {
  /**
   * @public
   * @param {number} code
   * @param {string} error
   * @param {any} detail
   */
  constructor(code, error, detail = null) {
    /**
     * @private
     * @type {number}
     */
    this.code = code;

    /**
     * @public
     * @type {string}
     */
    this.error = error;

    /**
     * @private
     * @type {any}
     */
    this.detail = detail;

    /** @type {number} */
    const category = Math.floor(code / 10000);

    /**
     * @private
     * @type {string}
     */
    this.type = "UnexpectedError";
    if (category === 4) this.type = "ParameterError";
    else if (category === 5) this.type = "NetworkError";

    /**
     * @private
     * @type {number}
     */
    this.localtime = new Date().getTime();
  }

  /**
   * appに渡すエラーオブジェクトを取得する
   *
   * @public
   * @returns {{code: number, type: string, error: string}}}
   */
  getDetail() {
    return {
      code: this.code,
      type: this.type,
      error: this.error,
    };
  }

  /**
   * 解析用文字列を取得する
   *
   * @public
   * @returns {string}
   */
  toReportString() {
    let report = `ricoh-ls-sdk error dump\n\
timestamp: ${this.localtime}\n\
error: ${this.type} (${this.code}) ${this.error}\n`;

    if (this.detail instanceof Error) report += "stack: " + this.detail.stack + "\n";

    /**
     * @param {object} object
     * @param {number} depth
     * @returns {object|string}
     */
    function recursive_stringify(object, depth = 0) {
      if (depth > 2) return "Object";
      /** @type {object} */
      const obj = {};
      for (let key in object) {
        obj[key] = object[key] instanceof Object ? recursive_stringify(object[key], depth + 1) : object[key];
      }
      return depth ? obj : JSON.stringify(obj);
    }

    return report + "detail:\n" + recursive_stringify(this.detail);
  }
}

/**
 * エラー表現クラス
 * (try-catchのエラー)
 *
 * @public
 * @class SDKError
 */
class SDKError extends Error {
  /**
   * @public
   * @param {ErrorData} errdata
   */
  constructor(errdata) {
    super(errdata.error);

    /**
     * @private
     * @type {{code: number, type: string, error: string}}
     */
    this.detail = errdata.getDetail();

    /**
     * @public
     * @type {ErrorData}
     */
    this.errdata = errdata;
  }

  /**
   * 解析用文字列を取得する
   *
   * @public
   * @returns {string}
   */
  toReportString() {
    return this.errdata.toReportString();
  }
}

/**
 * エラーイベントクラス
 * (onerrorのエラー)
 *
 * @public
 * @class SDKErrorEvent
 */
class SDKErrorEvent extends CustomEvent {
  /**
   * @public
   * @param {ErrorData} errdata
   */
  constructor(errdata) {
    super("error", { detail: errdata.getDetail() });

    /**
     * @public
     * @type {ErrorData}
     */
    this.errdata = errdata;
  }

  /**
   * 解析用文字列を取得する
   *
   * @public
   * @returns {string}
   */
  toReportString() {
    return this.errdata.toReportString();
  }
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
  constructor() {
    super();

    /**
     * @private
     * @type {StateType}
     */
    this.state = "idle";

    /**
     * @private
     * @type {RTCConfiguration}
     */
    this.rtcConfiguration = {};

    /**
     * @private
     * @type {RoomSessionID|null}
     */
    this.room_session_id = null;

    /**
     * @private
     * @type {LocalLSTrack[]}
     */
    this.localLSTracks = [];

    /**
     * @private
     * @type {WS|null}
     */
    this.ws = null;

    /**
     * @private
     * @type {Map<ConnectionID, Peer>}
     */
    this.peers = new Map();

    /**
     * @private
     * @type {ClientID|null}
     */
    this.client_id = null;

    /**
     * @private
     * @type {JwtAccessToken|null}
     */
    this.access_token = null;

    /**
     * @private
     * @type {Peer|null}
     */
    this.sfupc = null;

    /**
     * @private
     * @type {Meta}
     */
    this.connectionMetadata = {};

    /**
     * @private
     * @type {Role}
     */
    this.sendrecv = "sendrecv";

    /**
     * @private
     * @type {ConnectionSendingOptionsUser|null}
     */
    this.sendingOption = null;

    /**
     * @private
     * @type {ConnectionReceivingOptions|null}
     */
    this.receivingOption = null;

    /**
     * @private
     * @type {RTCRtpSender[]}
     */
    this.mutedVideoSenders = [];
    /**
     * @private
     * @type {RTCRtpSender[]}
     */
    this.mutedAudioSenders = [];

    /**
     * @private
     * @type {Logger|null}
     */
    this.logger = null;

    /**
     * @private
     * @type {Log[]}
     */
    this.stateHeadHistory = [];
    /**
     * @private
     * @type {Log[]}
     */
    this.stateTailHistory = [];

    /**
     * @private
     * @type {Log[]}
     */
    this.wsEventHeadHistory = [];
    /**
     * @private
     * @type {Log[]}
     */
    this.wsEventTailHistory = [];

    /**
     * @private
     * @type {Log[]}
     */
    this.debugInfoHeadHistory = [];
    /**
     * @private
     * @type {Log[]}
     */
    this.debugInfoTailHistory = [];

    /**
     * @private
     * @type {Map<string, RTCIceCandidate[]>}
     */
    this.earlyCandidates = new Map();

    /**
     * @private
     * @type {Map<ConnectionID, ConnectionInfo>}
     */
    this.connections = new Map();

    /**
     * @private
     * @type {"all"|"relay"|null}
     */
    this.userIceTransportPolicy = null;

    /**
     * @private
     * @type {"all"|"udp"|"tcp"|"tls"|"tcp_tls"|null}
     */
    this.userIceServersProtocol = null;

    /**
     * @private
     * @type {number|null}
     */
    this.timerId = null;

    /**
     * @private
     * @type {number|null}
     */
    this.initialFramerate = null;

    /**
     * @private
     * @type {"sfu"|"sfu_large"|"p2p"|"p2p_turn"|null}
     */
    this.roomSpecType = null;

    /**
     * @private
     * @type {boolean}
     */
    this.internalErrorOccured = false;

    /**
     * @private
     * @type {InitialUpdateSendingVideoOption|null}
     */
    this.initialUpdateSendingVideoOption = null;

    /**
     * @private
     * @type {InitialUpdateSendingVideoOptionMute|null}
     */
    this.initialUpdateSendingVideoOptionMute = null;

    /**
     * @private
     * @type {Map<string, InitialUpdateTrack>}
     */
    this.initialUpdateTrack = new Map();

    /**
     * @private
     * @type {Map<ConnectionID, InitialUpdateReceivingVideosOption>}
     */
    this.initialUpdateReceivingVideosOption = new Map();

    /**
     * @private
     * @type {Map<TrackID, InitialReplaceMediaStreamTrack>}
     */
    this.initialReplaceMediaStreamTrack = new Map();

    /**
     * @private
     * @type {boolean}
     */
    this.apiReady = false;

    /**
     * @private
     * @type {boolean}
     */
    this.mediaOpened = false;

    this.wscancel = false;

    this.trackReport = "";
  }

  /**
   * addEventListener の wrapper
   * removeEventListener 出来ない点に注意
   *
   * @public
   * @param {EventType} eventName
   * @param {function} listener
   */
  on(eventName, listener) {
    this.addEventListener(eventName, (e) => {
      if (!(e instanceof CustomEvent)) return;
      if (e.type === "error") listener(e);
      else listener(e.detail);
    });
  }

  /**
   * @private
   * @param {string} name
   * @param {any} detail
   */
  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  /**
   * @private
   * @param {number} code
   * @param {string} err
   * @param {any} detail
   */
  emitError(code, err, detail) {
    this.dispatchEvent(new SDKErrorEvent(new ErrorData(code, err, detail)));
  }

  /**
   * @private
   * @param {number} code
   * @param {any} detail
   * @param {boolean} disconnect
   */
  internalError(code, detail, disconnect = true) {
    const ignoreError = this.state === "closing" || this.state === "closed";
    if (disconnect) this.disconnect();
    if (!ignoreError) {
      const err = "InternalError" + code.toString();
      this.putLog("debug", `InternalError: ${detail}`);
      this.emitError(code, err, detail);
    }
  }

  /**
   * @private
   * @param {number} errcode
   * @param {function(): any} func
   * @param {null|function(): void} postfunc
   * @param {boolean} disconnect
   */
  withErr(errcode, func, postfunc = null, disconnect = true) {
    this.internalErrorOccured = false;
    /** @type {any} */
    let ret = null;
    try {
      ret = func();
    } catch (e) {
      this.internalError(errcode, e, disconnect);
      this.internalErrorOccured = true;
      return;
    }
    // try-catch内のemit()によりapp内エラーがInternalErrorとなることを避けるため、emit()はpostfuncで行う。
    if (postfunc) postfunc();
    return ret;
  }

  /**
   * @private
   */
  async withErrAsync(errcode, func) {
    this.internalErrorOccured = false;
    try {
      return await func();
    } catch (e) {
      this.internalError(errcode, e);
      this.internalErrorOccured = true;
    }
  }

  /**
   * State を取得する
   *
   * @public
   * @returns {StateType}
   */
  getState() {
    return this.withErr(61002, () => {
      return this.state;
    });
  }

  /**
   * @private
   * @param {Array<Promise<{connection_id: ConnectionID, report: RTCStatsReport}>|undefined>} promises
   * @returns {Promise<{connection_id: ConnectionID, report: RTCStatsReport}>|{}}
   */
  arrangeStats(promises) {
    return Promise.all(promises).then((arr) => {
      return arr.reduce((ret, stats) => {
        if (stats) ret[stats.connection_id] = stats.report;
        return ret;
      }, {});
    });
  }

  /**
   * Stats を取得する
   *
   * @public
   * @param {MediaStreamTrack} [mediaStreamTrack]
   * @returns {Promise<RTCStatsReport>}
   */
  getStats(mediaStreamTrack) {
    return this.withErr(61003, () => {
      /** @type {Array<Promise<{connection_id: ConnectionID, report: RTCStatsReport}>|undefined>} */
      const promises = [];
      this.peers.forEach((peer) => promises.push(peer.getConnectionStats(mediaStreamTrack)));
      if (this.isSfuRoom()) promises.push(this.sfupc?.getConnectionStats(mediaStreamTrack));
      return this.arrangeStats(promises);
    });
  }

  /**
   * 開始数分のログを取得する
   *
   * @public
   * @returns {string}
   */
  getHeadReport() {
    const report = new Report("first 5 minutes log");
    report.addHistory("Client___", "state_____________", this.stateHeadHistory);
    report.addHistory("Websocket", "event_____________", this.wsEventHeadHistory);
    if (this.ws) {
      report.addHistory("Websocket", "recvMessage_______", this.ws.recvHeadHistory);
      report.addHistory("Websocket", "sendMessage_______", this.ws.sendHeadHistory);
    }
    report.addHistory("DebugInfo", "debugInfo_________", this.debugInfoHeadHistory);
    this.peers.forEach((peer) => {
      report.addHistory(`Peer(${peer.connection_id})`, "connectionState___", peer.connectionStateHeadHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "signalingState____", peer.signalingStateHeadHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "iceGatheringState_", peer.iceGatheringStateHeadHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "iceConnectionState", peer.iceConnectionStateHeadHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "iceEvent__________", peer.iceEventHeadHistory);
    });
    if (this.sfupc) {
      report.addHistory("Peer(sfu)", "connectionState___", this.sfupc.connectionStateHeadHistory);
      report.addHistory("Peer(sfu)", "signalingState____", this.sfupc.signalingStateHeadHistory);
      report.addHistory("Peer(sfu)", "iceGatheringState_", this.sfupc.iceGatheringStateHeadHistory);
      report.addHistory("Peer(sfu)", "iceConnectionState", this.sfupc.iceConnectionStateHeadHistory);
      report.addHistory("Peer(sfu)", "iceEvent__________", this.sfupc.iceEventHeadHistory);
    }
    return report.dumpMerged();
  }

  /**
   * 直近数分のログを取得する
   *
   * @public
   * @returns {string}
   */
  getTailReport() {
    const report = new Report("last 5 minutes log");
    report.addHistory("Client___", "state_____________", this.stateTailHistory);
    report.addHistory("Websocket", "event_____________", this.wsEventTailHistory);
    if (this.ws) {
      report.addHistory("Websocket", "recvMessage_______", this.ws.recvTailHistory);
      report.addHistory("Websocket", "sendMessage_______", this.ws.sendTailHistory);
    }
    report.addHistory("DebugInfo", "debugInfo_________", this.debugInfoTailHistory);
    this.peers.forEach((peer) => {
      report.addHistory(`Peer(${peer.connection_id})`, "connectionState___", peer.connectionStateTailHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "signalingState____", peer.signalingStateTailHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "iceGatheringState_", peer.iceGatheringStateTailHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "iceConnectionState", peer.iceConnectionStateTailHistory);
      report.addHistory(`Peer(${peer.connection_id})`, "iceEvent__________", peer.iceEventTailHistory);
    });
    if (this.sfupc) {
      report.addHistory("Peer(sfu)", "connectionState___", this.sfupc.connectionStateTailHistory);
      report.addHistory("Peer(sfu)", "signalingState____", this.sfupc.signalingStateTailHistory);
      report.addHistory("Peer(sfu)", "iceGatheringState_", this.sfupc.iceGatheringStateTailHistory);
      report.addHistory("Peer(sfu)", "iceConnectionState", this.sfupc.iceConnectionStateTailHistory);
      report.addHistory("Peer(sfu)", "iceEvent__________", this.sfupc.iceEventTailHistory);
    }
    return report.dumpMerged();
  }

  /**
   * 直近数分のstatsログを取得する
   *
   * @public
   * @returns {string}
   */
  getStatsReport() {
    const report = new Report("stats log");
    this.peers.forEach((peer) => {
      report.addHistory(`Peer(${peer.connection_id})`, "stats", peer.statsHistory);
    });
    if (this.sfupc) {
      report.addHistory("Peer(sfu)", "stats", this.sfupc.statsHistory);
    }
    return report.dumpMerged();
  }

  /**
   * Connectionのログを取得する
   *
   * @public
   * @returns {string}
   */
  getTrackReport() {
    return this.trackReport;
  }

  /**
   * @private
   * @param {ClientID} client_id
   * @param {JwtAccessToken} access_token
   * @param {ConnectOption} option
   */
  connectMain(client_id, access_token, option) {
    this.withErr(
      61004,
      () => {
        this.timerId = window.setInterval(this.monitor.bind(this), 2500);

        this.client_id = client_id;
        this.access_token = access_token;

        this.peers = new Map();
        if (option.meta) this.connectionMetadata = option.meta;
        if (option.iceTransportPolicy) this.userIceTransportPolicy = option.iceTransportPolicy;
        if (option.iceServersProtocol !== undefined) this.userIceServersProtocol = option.iceServersProtocol;

        this.logger = new Logger({ headperiod: 5 * 60 * 1000, tailperiod: 5 * 60 * 1000 });
        this.logger.addEventListener("logged", this.onLogged.bind(this));
        this.putLog("debug", `UA: ${window.navigator.userAgent}`);
        this.putLog("debug", `API Call: connect - ${JSON.stringify(option)}`);
        this.ws = new WS(option.signalingURL || SIGNALING_URL, this.logger);
        this.setState("connecting", "connecting");

        // standard events
        this.ws.addEventListener("open", this.onWSOpen.bind(this));
        this.ws.addEventListener("error", this.onWSError.bind(this));
        this.ws.addEventListener("close", this.onWSClose.bind(this));

        this.ws.on("connect_success", this.onConnectSuccess.bind(this));

        this.ws.on("p2p.request_offer", this.onP2PRequestOffer.bind(this));
        this.ws.on("p2p.relay_offer", this.onP2PRelayOffer.bind(this));
        this.ws.on("p2p.relay_answer", this.onP2PRelayAnswer.bind(this));
        this.ws.on("p2p.relay_icecandidate", this.onP2PRelayIcecandidate.bind(this));

        this.ws.on("sfu.offer", this.onSFUOffer.bind(this));
        this.ws.on("sfu.relay_icecandidate", this.onSFURelayIcecandidate.bind(this));
        this.ws.on("sfu.update_offer", this.onSFUUpdateOffer.bind(this));

        this.ws.on("notify.connection.connect", this.onNotifyConnectionConnect.bind(this));
        this.ws.on("notify.connection.leave", this.onNotifyConnectionLeave.bind(this));
        this.ws.on("notify.connection.update", this.onNotifyConnectionUpdate.bind(this));

        this.ws.on("notify.sfu.track.update", this.onNotifySFUTrackUpdate.bind(this));
        this.ws.on("notify.sfu.connections.update", this.onNotifySFUConnectionsUpdate.bind(this));

        this.ws.on("ping", this.onPing.bind(this));
        this.ws.on("error", this.onError.bind(this));

        this.ws.on("debug_info", this.onDebugInfo.bind(this));
      },
      () => {
        if (this.sendrecv === "sendrecv" || this.sendrecv === "sendonly") {
          option.localLSTracks.forEach((loclsTrack) => {
            this.localLSTracks.push(new LocalLSTrack(loclsTrack));
            /** @type {AddLocalTrackObj} */
            const obj = { mediaStreamTrack: loclsTrack.mediaStreamTrack, stream: loclsTrack.stream };
            this.emit("addlocaltrack", obj);
          });
        }
      },
    );
  }

  /**
   * @private
   * @param {ConnectOption} option
   */
  setSendRecv(option) {
    this.withErr(61049, () => {
      if (option.sending) this.sendingOption = option.sending;
      if (option.receiving) this.receivingOption = option.receiving;
      this.sendrecv = this.getSendRecvFromOption(this.sendingOption, this.receivingOption);
    });
  }

  /**
   * @private
   * @param {ConnectOption} option
   * @returns {{code: number, error: string}}
   */
  checkConnectErr(option) {
    const needSend = this.sendrecv === "sendrecv" || this.sendrecv === "sendonly";
    const haveLocalLSTracks = option.localLSTracks;

    if (haveLocalLSTracks && !needSend) return { code: 45014, error: "InvalidLocalTracksOnConnect" };
    if (!haveLocalLSTracks && needSend) return { code: 45004, error: "NeedLocalTracksOnConnect" };

    return { code: 0, error: "" };
  }

  /**
   * 渡された credential を用い Signaling Server に接続する
   *
   * @public
   * @param {ClientID} client_id
   * @param {JwtAccessToken} access_token
   * @param {ConnectOption} option
   */
  connect(client_id, access_token, option) {
    if (this.state !== "idle") throw new SDKError(new ErrorData(45000, "BadStateOnConnect"));

    this.setSendRecv(option);
    if (this.internalErrorOccured) return;

    const { code, error } = this.checkConnectErr(option);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    this.connectMain(client_id, access_token, option);
  }

  /**
   * 保持する PeerConnection と WebSocket を開放し
   * State を CLOSING に遷移
   *
   * @public
   */
  disconnect() {
    this.withErr(
      61005,
      () => {
        this.putLog("debug", "API Call: disconnect");
        if (this.state === "connecting") this.wscancel = true;
        else if (this.state !== "open") return; // do nothing
        this.setState("closing", "closing");

        if (this.ws) this.ws.close(1000);

        if (this.sfupc) {
          this.sfupc.close();
          this.sfupc.stop();
          this.sfupc = null;
        }
        this.peers.forEach((v, k) => {
          v.close();
          v.stop();
          this.peers.delete(k);
        });
        this.peers = new Map();

        if (this.timerId) {
          window.clearInterval(this.timerId);
          this.timerId = null;
        }

        this.trackReport = "";
      },
      null,
      false,
    );
  }

  /**
   * @private
   * @returns {{code: number, error: string}}
   */
  checkUpdateMetaErr() {
    if (this.state !== "open") return { code: 45006, error: "BadStateOnUpdateMeta" };
    return { code: 0, error: "" };
  }

  /**
   * @private
   * @param {Meta} meta
   */
  updateMetaMain(meta) {
    this.withErr(61031, () => {
      const tags = this.metaToTags(meta);
      this.sendUpdateConnection({ tags });
    });
  }

  /**
   * connection metaを更新する
   *
   * @public
   * @param {Meta} meta
   */
  updateMeta(meta) {
    this.putLog("debug", "API Call: updateMeta");
    const { code, error } = this.checkUpdateMetaErr();
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    this.updateMetaMain(meta);
  }

  /**
   * @private
   * @param {LSTrack} lsTrack
   * @returns {{code: number, error: string, localLSTrack: LocalLSTrack|null}}
   */
  checkUpdateTrackMetaErr(lsTrack) {
    if (this.state !== "open") return { code: 45007, error: "BadStateOnUpdateTrackMeta", localLSTrack: null };
    if (!this.isSfuRoom()) return { code: 45002, error: "UnsupportedRoomSpecTypeOnUpdateTrackMeta", localLSTrack: null };
    const localLSTrack = this.localLSTracks.find((loclsTrack) => loclsTrack.lsTrack === lsTrack);
    if (!localLSTrack) return { code: 45001, error: "TrackNotFoundOnUpdateTrackMeta", localLSTrack: null };
    return { code: 0, error: "", localLSTrack };
  }

  /**
   * LSTrackのmetaを更新する
   *
   * @private
   * @param {LocalLSTrack} localLSTrack
   * @param {Meta} meta
   * @param {"sdk"|"app_front"} source
   */
  updateTrackMetaMain(localLSTrack, meta, source = "app_front") {
    this.withErr(61032, () => {
      const tags = this.metaToTags(meta, source);
      if (this.apiReady) this.sendUpdateTrack({ localLSTrack, tags });
      else this.initialUpdateTrack.set(localLSTrack.mediaStreamTrack.id, { localLSTrack, tags });
    });
  }

  /**
   * LSTrackのmetaを更新する
   *
   * @public
   * @param {LSTrack} lsTrack
   * @param {Meta} meta
   * @param {"sdk"|"app_front"} source
   */
  updateTrackMeta(lsTrack, meta, source = "app_front") {
    this.putLog("debug", "API Call: updateTrackMeta");
    const { code, error, localLSTrack } = this.checkUpdateTrackMetaErr(lsTrack);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    if (localLSTrack) this.updateTrackMetaMain(localLSTrack, meta, source);
  }

  /**
   * @private
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {LSTrack} lsTrack
   * @returns {{code: number, error: string, localLSTrack: LocalLSTrack|null}}
   */
  checkReplaceMediaStreamTrackErr(mediaStreamTrack, lsTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) return { code: 45020, error: "InvalidMediaStreamTrackOnReplaceMediaStreamTrack", localLSTrack: null };

    const localLSTrack = this.localLSTracks.find((loclsTrack) => loclsTrack.lsTrack === lsTrack);
    if (!localLSTrack) return { code: 45009, error: "TrackNotFoundOnReplaceMediaStreamTrack", localLSTrack: null };
    return { code: 0, error: "", localLSTrack };
  }

  /**
   * @private
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {LocalLSTrack} localLSTrack
   */
  async replaceMediaStreamTrackMain(mediaStreamTrack, localLSTrack) {
    await this.withErrAsync(61037, async () => {
      if (this.apiReady) await this.replaceLSTrack(mediaStreamTrack, localLSTrack);
      else this.initialReplaceMediaStreamTrack.set(localLSTrack.track_id, { localLSTrack, mediaStreamTrack });
    });
  }

  /**
   * TrackのmediaStreamTrackを更新する
   *
   * @public
   * @param {LSTrack} lsTrack
   * @param {MediaStreamTrack} mediaStreamTrack
   */
  async replaceMediaStreamTrack(lsTrack, mediaStreamTrack) {
    this.putLog("debug", "API Call: replaceMediaStreamTrack");
    const { code, error, localLSTrack } = this.checkReplaceMediaStreamTrackErr(mediaStreamTrack, lsTrack);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    if (localLSTrack) await this.replaceMediaStreamTrackMain(mediaStreamTrack, localLSTrack);
  }

  /**
   * @private
   * @param {MuteType} muteType
   * @returns {boolean}
   */
  checkMuteType(muteType) {
    return muteType === "unmute" || muteType === "hardmute" || muteType === "softmute";
  }

  /**
   * @private
   * @param {MuteType} nextMuteType
   * @param {LSTrack} lsTrack
   * @returns {{code: number, error: string, localLSTrack: LocalLSTrack|null}}
   */
  checkChangeMuteErr(nextMuteType, lsTrack) {
    if (this.state !== "open") return { code: 45005, error: "BadStateOnChangeMute", localLSTrack: null };
    if (!this.checkMuteType(nextMuteType)) return { code: 45021, error: "InvalidNextMuteTypeOnChangeMute", localLSTrack: null };

    const localLSTrack = this.localLSTracks.find((loclsTrack) => loclsTrack.lsTrack === lsTrack);
    if (!localLSTrack) return { code: 45008, error: "TrackNotFoundOnChangeMute", localLSTrack: null };

    return { code: 0, error: "", localLSTrack };
  }

  /**
   * @private
   * @param {MuteType} curMuteType
   * @param {MuteType} nextMuteType
   * @param {LocalLSTrack} localLSTrack
   */
  async changeMuteMain(curMuteType, nextMuteType, localLSTrack) {
    await this.withErrAsync(61040, async () => {
      await this.changeMuteState(curMuteType, nextMuteType, localLSTrack);
      if (this.isSfuRoom()) {
        const tags = this.metaToTags({ muteState: localLSTrack.getMuteState() }, "sdk");
        if (this.apiReady) {
          this.sendUpdateTrack({ localLSTrack, tags });
          if (localLSTrack.mediaStreamTrack.kind === "video") this.sendUpdateSendingVideoOption({ video: { mute_type: localLSTrack.getMuteType() } });
          if (nextMuteType === "unmute") localLSTrack.updateEncodingParameters();
        } else {
          this.initialUpdateTrack.set(localLSTrack.mediaStreamTrack.id, { localLSTrack, tags });
          this.initialUpdateSendingVideoMuteOption = { video: { mute_type: localLSTrack.getMuteType() } };
        }
      }
    });
  }

  /**
   * TrackのMuteTypeを変更する
   *
   * @public
   * @param {LSTrack} lsTrack
   * @param {MuteType} nextMuteType
   */
  async changeMute(lsTrack, nextMuteType) {
    this.putLog("debug", "API Call: changeMute");
    const { code, error, localLSTrack } = this.checkChangeMuteErr(nextMuteType, lsTrack);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    if (localLSTrack) {
      const curMuteType = localLSTrack.muteType;
      if (curMuteType !== nextMuteType) await this.changeMuteMain(curMuteType, nextMuteType, localLSTrack);
    }
  }

  /**
   * @private
   * @param {ConnectionID} connection_id
   * @returns {RemoteTrackMetadata|null|undefined}
   */
  findRtm(connection_id) {
    if (!this.apiReady) return null;
    return this.sfupc?.remote_track_metadata.find((t) => t.connection_id === connection_id && t.kind === "video");
  }

  /**
   * @private
   * @param {ConnectionID} connection_id
   * @returns {{code: number, error: string, rtm: RemoteTrackMetadata|null}}
   */
  checkChangeMediaRequirementsErr(connection_id) {
    if (this.state !== "open") return { code: 45010, error: "BadStateOnChangeMediaRequirements", rtm: null };
    if (!this.isSfuRoom()) return { code: 45011, error: "UnsupportedRoomSpecTypeOnChangeMediaRequirements", rtm: null };
    if (this.sendrecv === "sendonly") return { code: 45013, error: "InvalidReceivingOptionOnChangeMediaRequirements", rtm: null };

    const rtm = this.findRtm(connection_id);
    if (rtm === undefined) return { code: 45012, error: "ConnectionNotFoundOnChangeMediaRequirements", rtm: null };
    return { code: 0, error: "", rtm };
  }

  /**
   * @private
   * @param {ConnectionID} connection_id
   * @param {"required"|"unrequired"} videoRequirement
   * @param {RemoteTrackMetadata|undefined|null} rtm
   */
  changeMediaRequirementsMain(connection_id, videoRequirement, rtm) {
    this.withErr(61047, () => {
      const enabled = videoRequirement === "required";
      if (this.apiReady && rtm) this.sendUpdateReceivingVideosOption({ videos: [{ track_id: rtm.track_id, enabled }] });
      else this.initialUpdateReceivingVideosOption.set(connection_id, { enabled });
    });
  }

  /**
   * ConnectionのMedia要件を変更する
   *
   * @public
   * @param {ConnectionID} connection_id
   * @param {"required"|"unrequired"} videoRequirement
   */
  changeMediaRequirements(connection_id, videoRequirement) {
    this.putLog("debug", "API Call: changeMediaRequirements");
    const { code, error, rtm } = this.checkChangeMediaRequirementsErr(connection_id);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    this.changeMediaRequirementsMain(connection_id, videoRequirement, rtm);
  }

  /**
   * @private
   * @param {number} framerate
   * @returns {{code: number, error: string}}
   */
  checkChangeVideoSendFramerateErr(framerate) {
    if (this.state !== "open") return { code: 45016, error: "BadStateOnChangeVideoSendFramerate" };
    if (framerate < 0.0 || 10000.0 < framerate) return { code: 45017, error: "OutOfRangeMaxFramerateOnChangeVideoSendFramerate" };
    return { code: 0, error: "" };
  }

  /**
   * @private
   * @param {number} framerate
   */
  changeVideoSendFramerateMain(framerate) {
    this.withErrAsync(61050, async () => {
      if (this.apiReady) {
        for (const loclsTrack of this.localLSTracks) {
          await loclsTrack.changeFramerate(framerate);
        }
      } else this.initialFramerate = framerate;
    });
  }

  /**
   * videoの送信フレームレートを変更する
   *
   * @public
   * @param {number} framerate
   */
  changeVideoSendFramerate(framerate) {
    this.putLog("debug", "API Call: changeVideoSendFramerate");
    const { code, error } = this.checkChangeVideoSendFramerateErr(framerate);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    this.changeVideoSendFramerateMain(framerate);
  }

  /**
   * @private
   * @param {number} maxBitrateKbps
   * @returns {{code: number, error: string}}
   */
  checkChangeVideoSendBitrateErr(maxBitrateKbps) {
    if (this.state !== "open") return { code: 45015, error: "BadStateOnChangeVideoSendBitrate" };
    if (!this.isSfuRoom()) return { code: 45018, error: "UnsupportedRoomSpecTypeOnChangeVideoSendBitrate" };
    if (!Number.isInteger(maxBitrateKbps)) return { code: 45019, error: "InvalidMaxBitrateKbpsOnChangeVideoSendBitrate" };
    return { code: 0, error: "" };
  }

  /**
   * @private
   * @param {number} maxBitrateKbps
   */
  changeVideoSendBitrateMain(maxBitrateKbps) {
    this.withErr(61048, () => {
      if (this.apiReady) this.sendUpdateSendingVideoOption({ video: { max_bitrate_kbps: maxBitrateKbps } });
      else this.initialUpdateSendingVideoOption = { video: { max_bitrate_kbps: maxBitrateKbps } };
    });
  }

  /**
   * videoの送信ビットレートを変更する
   *
   * @public
   * @param {number} maxBitrateKbps
   */
  changeVideoSendBitrate(maxBitrateKbps) {
    this.putLog("debug", "API Call: changeVideoSendBitrate");
    const { code, error } = this.checkChangeVideoSendBitrateErr(maxBitrateKbps);
    if (error !== "") throw new SDKError(new ErrorData(code, error));

    this.changeVideoSendBitrateMain(maxBitrateKbps);
  }

  /**
   * @private
   * @param {boolean} sendEnabled
   * @param {boolean} recvEnabled
   * @returns {Role}
   */
  getSendRecvStr(sendEnabled, recvEnabled) {
    if (sendEnabled) return recvEnabled ? "sendrecv" : "sendonly";
    else return recvEnabled ? "recvonly" : "void";
  }

  /**
   * @private
   * @param {ConnectionSendingOptions|ConnectionSendingOptionsUser|null} sending
   * @param {ConnectionReceivingOptions|null} receiving
   * @returns {Role}
   */
  getSendRecvFromOption(sending, receiving) {
    const sendEnabled = !sending || !sending.hasOwnProperty("enabled") || sending.enabled !== false;
    const recvEnabled = !receiving || !receiving.hasOwnProperty("enabled") || receiving.enabled !== false;
    return this.getSendRecvStr(sendEnabled, recvEnabled);
  }

  /**
   * @private
   * @param {MuteType} curMuteType
   * @param {MediaStreamTrack} nextMediaStreamTrack
   * @returns {{nextMediaStreamTrack: MediaStreamTrack|null, trackEnabled: boolean}}
   */
  nextTrackOnReplaceTrack(curMuteType, nextMediaStreamTrack) {
    if (curMuteType === "unmute") return { nextMediaStreamTrack, trackEnabled: true };
    if (curMuteType === "softmute") return { nextMediaStreamTrack, trackEnabled: false };
    return { nextMediaStreamTrack: null, trackEnabled: false }; // hardmute
  }

  /**
   * @private
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {LocalLSTrack} localLSTrack
   * @return {Promise<void>}
   */
  async replaceLSTrack(mediaStreamTrack, localLSTrack) {
    const { nextMediaStreamTrack, trackEnabled } = this.nextTrackOnReplaceTrack(localLSTrack.muteType, mediaStreamTrack);
    mediaStreamTrack.enabled = trackEnabled;
    await localLSTrack.replaceSenderTrack(nextMediaStreamTrack);
    localLSTrack.mediaStreamTrack = mediaStreamTrack;
  }

  /**
   * @private
   * @param {MuteType} curMuteType
   * @param {MuteType} nextMuteType
   * @param {MediaStreamTrack} curMediaStreamTrack
   * @returns {{nextMediaStreamTrack: MediaStreamTrack|null, trackEnabled: boolean}}
   */
  nextTrackOnChangeMute(curMuteType, nextMuteType, curMediaStreamTrack) {
    if (nextMuteType === "unmute") return { nextMediaStreamTrack: curMediaStreamTrack, trackEnabled: true };
    if (nextMuteType === "softmute") return { nextMediaStreamTrack: curMediaStreamTrack, trackEnabled: false };
    return { nextMediaStreamTrack: null, trackEnabled: false }; // hardmute
  }

  /**
   * @private
   * @param {MuteType} curMuteType
   * @param {MuteType} nextMuteType
   * @param {LocalLSTrack} localLSTrack
   * @returns {Promise<void>}
   */
  async changeMuteState(curMuteType, nextMuteType, localLSTrack) {
    const { nextMediaStreamTrack, trackEnabled } = this.nextTrackOnChangeMute(curMuteType, nextMuteType, localLSTrack.mediaStreamTrack);
    localLSTrack.mediaStreamTrack.enabled = trackEnabled;
    await localLSTrack.replaceSenderTrack(nextMediaStreamTrack);
    localLSTrack.muteType = nextMuteType;
  }

  /**
   * @private
   * @param {RemoteTag[]} tags
   * @returns {MuteType}
   */
  tagsToMute(tags) {
    return this.withErr(61039, () => {
      const tag = tags.filter((tag) => tag.name === "muteState")[0];
      if (!tag) return null;
      /** @type {MuteType} */
      let muteType = "unmute";
      if (tag.value === "blank") muteType = "softmute";
      else if (tag.value === "paused") muteType = "hardmute";
      return muteType;
    });
  }

  /**
   * @private
   * @param {RemoteTag[]} tags
   * @returns {Meta[]}
   */
  tagsToMeta(tags) {
    return this.withErr(61008, () => {
      return tags
        .filter((tag) => tag.source === "app_front")
        .reduce((ret, tag) => {
          ret[tag.name] = tag.value;
          return ret;
        }, {});
    });
  }

  /**
   * @private
   * @param {Meta} meta
   * @param {"sdk" | "app_front"} source
   * @returns {LocalTag[]}
   */
  metaToTags(meta, source = "app_front") {
    return this.withErr(61009, () => {
      /** @type {LocalTag[]} */
      const tags = [];
      Object.keys(meta).forEach((key) => {
        tags.push({
          name: key,
          value: meta[key],
          source,
          use_notification: true,
        });
      });
      return tags;
    });
  }

  /**
   * @private
   * @param {LocalTrackSlot[]} local_track_slots
   * @returns {Promise<LocalTrackMetadata|null>}
   */
  async getLocalTrackMeta(local_track_slots) {
    return await this.withErrAsync(61036, async () => {
      if (this.localLSTracks.length == 0) return {};
      if (!this.sfupc) return {};
      await this.sfupc.addTracks(this.localLSTracks);
      this.sfupc.assignTrackIdToTrack(local_track_slots, this.localLSTracks);
      return this.sfupc.makeLocalTrackMeta(local_track_slots, this.localLSTracks);
    });
  }

  /**
   * @private
   * @param {StateType} state
   * @param {string} event
   * @param {object|null} obj
   */
  setState(state, event, obj = null) {
    this.withErr(
      61001,
      () => {
        this.putLog("state", `${state} <- ${this.state}`);
        this.state = state;
      },
      () => {
        if (event !== "error") this.emit(event, obj);
      },
    );
  }

  /**
   * @private
   * @param {{tags: LocalTag[]}} param0
   */
  sendUpdateConnection({ tags }) {
    this.ws?.sendMessage({
      message_type: "update_connection",
      tags,
    });
  }

  /**
   * @private
   * @param {{localLSTrack: LocalLSTrack, tags: LocalTag[]}} param0
   */
  sendUpdateTrack({ localLSTrack, tags }) {
    this.ws?.sendMessage({
      message_type: "sfu.update_track",
      track_id: localLSTrack.track_id,
      tags,
    });
  }

  /**
   * @private
   * @param {{videos: Array<{track_id: TrackID, enabled: boolean}>}} param0
   */
  sendUpdateReceivingVideosOption({ videos }) {
    this.ws?.sendMessage({
      message_type: "sfu.update_connect_options",
      options: {
        receiving: {
          videos,
        },
      },
    });
  }

  /**
   * @private
   * @param {{video: SendingVideo}} param0
   */
  sendUpdateSendingVideoOption({ video }) {
    this.ws?.sendMessage({
      message_type: "sfu.update_connect_options",
      options: {
        sending: {
          video,
        },
      },
    });
  }

  /**
   * @private
   * @param {Peer} peer
   * @param {{ track: MediaStreamTrack, streams: MediaStream[] }} e
   */
  onTrackP2P(peer, e) {
    /** @type {AddRemoteTrackObj} */
    let obj;
    this.withErr(
      61027,
      () => {
        const { track, streams } = e;
        const stream = streams[0];
        obj = { connection_id: peer.connection_id, mediaStreamTrack: track, stream };

        const conn = this.connections.get(peer.connection_id);
        if (conn) {
          conn.state = "trackadded";
          this.connections.set(peer.connection_id, conn);
        }
        this.trackReport += `[${new Date().toISOString()}]\tadd(${track.kind})\t${track.id}\tconnection_id: ${peer.connection_id}\n`;
      },
      () => {
        this.emit("addremotetrack", obj);
      },
    );
  }

  /**
   * @private
   * @param {ConnectionInfo} conn
   * @param {TrackID} track_id
   * @param {AddRemoteTrackObj} obj
   */
  updateReserved(conn, track_id, obj) {
    if (!conn.reservedUpdate || !conn.reservedUpdate.hasOwnProperty(track_id)) return;
    const reserved = conn.reservedUpdate[track_id];
    if (reserved.meta) obj.meta = { ...obj.meta, ...reserved.meta };
    if (reserved.muteState) obj.mute = reserved.muteState;
  }

  /**
   * @private
   * @param {Peer} peer
   * @param {{track: MediaStreamTrack, streams: MediaStream[], transceiver: RTCRtpTransceiver }} e
   */
  async onTrackSFU(peer, e) {
    /** @type {AddRemoteTrackObj} */
    let obj;
    this.withErr(
      61026,
      () => {
        const { track, streams } = e;
        const msid = e.streams[0].id;
        const mid = e.transceiver.mid;
        const rtm = peer.remote_track_metadata.find((t) => t.msid === msid && t.mid === mid);
        if (!rtm) return;

        const connection_id = rtm.connection_id;
        const stream = streams[0];
        rtm.track = track;
        rtm.stream = stream;

        const metadata = this.tagsToMeta(rtm.tags);
        const mute = this.tagsToMute(rtm.tags);

        obj = { connection_id, mediaStreamTrack: track, stream, meta: metadata, mute };

        const conn = this.connections.get(connection_id);
        if (conn) {
          conn.state = "trackadded";
          this.connections.set(connection_id, conn);
          this.updateReserved(conn, rtm.track_id, obj);
        }
        this.trackReport += `[${new Date().toISOString()}]\tadd(${track.kind})\t${track.id}\tconnection_id: ${connection_id}\n`;
      },
      () => {
        this.emit("addremotetrack", obj);
      },
    );
  }

  /**
   * @private
   * @param {Peer} peer
   * @param {{candidate: string}} e
   */
  onIceCandidateP2P(peer, e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onIceCandidateP2P (state!=open)");
      return;
    }

    this.withErr(61028, () => {
      if (e.candidate === null) return;
      this.ws?.sendMessage({
        message_type: "p2p.icecandidate",
        peer_connection_id: peer.connection_id,
        candidate: e.candidate,
      });
    });
  }

  /**
   * @private
   * @param {{candidate: string}} e
   */
  onIceCandidateSFU(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onIceCandidateSFU (state!=open)");
      return;
    }
    this.withErr(61030, () => {
      this.ws?.sendMessage({
        message_type: "sfu.icecandidate",
        candidate: e.candidate,
      });
    });
  }

  /**
   * @private
   * @param {{id: string, kind: string, codec: string}} e
   */
  onTrackConnected(e) {
    if (e.codec) this.trackReport += `[${new Date().toISOString()}]\tconnect(${e.kind})\t${e.id}\tcodec: ${e.codec}\n`;
    else this.trackReport += `[${new Date().toISOString()}]\tconnect(${e.kind})\t${e.id}\n`;
  }

  /**
   * @private
   * @param {{}} e
   */
  onIceConnected(e) {
    if (!this.mediaOpened) {
      this.emit("mediaopen", {});
      this.mediaOpened = true;
    }
  }

  /**
   * @private
   * @param {{id: string, kind: string}} e
   */
  onTrackDisconnected(e) {
    this.trackReport += `[${new Date().toISOString()}]\tdisconnect(${e.kind})\t${e.id}\n`;
  }

  /**
   * @private
   * @param {{connection_id: ConnectionID, stability: string}} e
   */
  onChangeStability(e) {
    const connection_id = e.connection_id === "" ? "sfu" : e.connection_id;
    if (e.stability === "iceconnecttimeout") {
      this.emitError(54001, "IceConnectionTimeout", e);
    } else {
      this.emit("changestability", { connection_id, stability: e.stability });
      this.emit("changemediastability", { connection_id, stability: e.stability });
    }
  }

  /**
   * @private
   * @param {ConnectionSendingOptionsUser} send
   * @returns {ConnectionSendingOptions}
   */
  makeSending(send) {
    /** @type {ConnectionSendingOptions} */
    const sending = {};
    if (send.hasOwnProperty("enabled")) sending.enabled = send.enabled;
    if (send.hasOwnProperty("video")) {
      /** @type {ConnectionSendingVideoOptions} */
      const video = {};
      if (send.video.hasOwnProperty("codec")) video.codec = send.video.codec;
      if (send.video.hasOwnProperty("priority")) video.priority = send.video.priority;
      if (send.video.hasOwnProperty("maxBitrateKbps")) video.max_bitrate_kbps = send.video.maxBitrateKbps;
      sending.video = video;
    }
    return sending;
  }

  /**
   * @private
   * @param {ConnectionReceivingOptions} recv
   * @returns {ConnectionReceivingOptions}
   */
  makeReceiving(recv) {
    /** @type {ConnectionReceivingOptions} */
    const receiving = {};
    if (recv.hasOwnProperty("enabled")) receiving.enabled = recv.enabled;
    return receiving;
  }

  /**
   * @private
   * @param {"all"|"udp"|"tcp"|"tls"|"tcp_tls"} ice
   * @returns {ConnectionConnectingOptions}
   */
  makeConnecting(ice) {
    /** @type {ConnectionConnectingOptions} */
    const connecting = {};
    if (ice === "all") connecting.turn_protocols = ["udp", "tcp", "tls"];
    else if (ice === "tcp_tls") connecting.turn_protocols = ["tcp", "tls"];
    else connecting.turn_protocols = [ice];
    return connecting;
  }

  /**
   * @private
   * @param {ConnectionSendingOptionsUser|null} send
   * @param {ConnectionReceivingOptions|null} recv
   * @param {"all"|"udp"|"tcp"|"tls"|"tcp_tls"|null} ice
   * @returns {ConnectOptions}
   */
  makeConnectMessageOptions(send, recv, ice) {
    /** @type {ConnectOptions} */
    const options = {};
    if (send) options.sending = this.makeSending(send);
    if (recv) options.receiving = this.makeReceiving(recv);
    if (ice !== undefined && ice !== null) options.connecting = this.makeConnecting(ice);
    return options;
  }

  /**
   * @private
   */
  onLogged(e) {
    this.emit("log", { msg: e.detail.log, category: e.detail.category, subcategory: e.detail.subcategory, date: e.detail.date });
  }

  /**
   * @private
   */
  onWSOpen() {
    this.withErr(61010, () => {
      this.putLog("wsevent", "wsopen");
      /** @type {ConnectMessage} */
      const connectMessage = {
        message_type: "connect",
        client_id: this.client_id,
        access_token: this.access_token,
        tags: this.metaToTags(this.connectionMetadata),
        sdk_info: { platform: "web", version: "1.9.1+20240229" },
        options: this.makeConnectMessageOptions(this.sendingOption, this.receivingOption, this.userIceServersProtocol),
      };
      this.ws?.sendMessage(connectMessage);
      this.lastReceived = new Date().getTime();
    });
  }

  /**
   * @private
   * @param {object} e
   */
  onWSError(e) {
    this.withErr(61011, () => {
      this.putLog("wsevent", "wserror: " + JSON.stringify(e));
      if (!this.wscancel) this.emitError(50001, "WebSocketError", e);
    });
  }

  getCloseErr(code) {
    const table = [
      { code: 1000, retcode: 0, error: "" },
      { code: 3002, retcode: 53002, error: "ConnectionClosedByApplication" },
      { code: 3003, retcode: 53003, error: "MaxRoomPeriodExceeded" },
      { code: 3004, retcode: 53004, error: "ConnectionClosedByServer" },
      { code: 3601, retcode: 53601, error: "ConnectionLimitExceeded" },
      { code: 3719, retcode: 53719, error: "ConnectionCreateTimeout" },
      { code: 3806, retcode: 53806, error: "ServerUnavailable" },
    ];
    for (const t of table) {
      if (t.code === code) return { code: t.retcode, error: t.error };
    }
    if (code < 3000) return { code: 50000 + code, error: "WebSocketBadClose" + code.toString() };
    if (3000 <= code && code <= 3099) return { code: 0, error: "" };
    return { code: 0, error: "paramerr" };
  }

  /**
   * @private
   * @param {{code: number, reason: string}} e
   */
  onWSClose(e) {
    this.putLog("wsevent", `wsclose(${e.code}): ${e.reason}`);

    const { code, error } = this.getCloseErr(e.code);
    if (error === "paramerr") {
      const paramerr = this.getParamError(e.code);
      if (paramerr) this.emitError(40000 + e.code, paramerr.err, e);
      else this.internalError(65000 + e.code, e); // This was once 61046
    } else if (error !== "") {
      if (!this.wscancel) this.emitError(code, error, e);
    }

    if (this.sfupc) {
      this.sfupc.close();
      this.sfupc.stop();
      this.sfupc = null;
    }
    this.peers.forEach((v, k) => {
      v.close();
      v.stop();
      this.peers.delete(k);
    });
    this.peers = new Map();

    if (this.state === "idle" || this.state === "connecting" || this.state === "open") this.setState("closing", "closing");

    this.setState("closed", "close");
  }

  /**
   * @private
   * @param {ConnectSuccessMessage} e
   */
  onConnectSuccess(e) {
    let access_token_json = "";
    let connections_status = {};

    this.withErr(
      61013,
      () => {
        if (this.state !== "connecting") return; // do nothing
        const { ice_servers, room_session_id } = e;
        access_token_json = JSON.stringify(e.access_token_info);
        connections_status = e.connections_status;
        this.roomSpecType = e.access_token_info.room_spec.type;
        this.rtcConfiguration.iceServers = ice_servers;
        this.room_session_id = room_session_id;
      },
      () => {
        this.setState("open", "open", { access_token_json, connections_status });
        const now = new Date().getTime();
        e.connections.forEach((connection) => {
          const { connection_id, tags } = connection;
          const sendrecv = this.getSendRecvFromOption(connection.options.sending, connection.options.receiving);
          const meta = this.tagsToMeta(tags);
          /** @type {AddRemoteConnectionObj} */
          const obj = { connection_id, meta };
          this.emit("addremoteconnection", obj);
          this.connections.set(connection_id, { state: "joined", join: now, sendrecv });
        });
      },
    );
  }

  /**
   * @private
   * @param {NotifyConnectionConnectMessage} e
   */
  onNotifyConnectionConnect(e) {
    /** @type {AddRemoteConnectionObj} */
    let obj;
    this.withErr(
      61014,
      () => {
        const { connection } = e;
        const { connection_id, tags } = connection;
        const sendrecv = this.getSendRecvFromOption(connection.options.sending, connection.options.receiving);
        const meta = this.tagsToMeta(tags);
        obj = { connection_id, meta };

        this.connections.set(connection_id, { state: "joined", join: new Date().getTime(), sendrecv });
      },
      () => {
        this.emit("addremoteconnection", obj);
      },
    );
  }

  /**
   * @private
   * @param {NotifyConnectionLeaveMessage} e
   */
  onNotifyConnectionLeave(e) {
    /** @type {RemoveRemoteConnectionObj} */
    let obj;

    this.withErr(
      61015,
      () => {
        const { connection } = e;
        const { connection_id, tags } = connection;
        const meta = this.tagsToMeta(tags);

        if (this.sfupc) {
          const rtmForConnecion = this.sfupc.remote_track_metadata.filter((rtm) => rtm.connection_id === connection_id);
          const mediaStreamTracks = rtmForConnecion.map((meta) => meta.track);
          mediaStreamTracks.forEach((track) => {
            this.trackReport += `[${new Date().toISOString()}]\tremove(${track?.kind})\t${track?.id}\n`;
          });
          obj = { connection_id, meta, mediaStreamTracks };
        } else {
          obj = { connection_id, meta };
        }

        const peer = this.peers.get(connection_id);
        if (peer) {
          this.localLSTracks.forEach((loclsTrack) => {
            const track = loclsTrack.mediaStreamTrack;
            this.trackReport += `[${new Date().toISOString()}]\tremove(${track?.kind})\t${track?.id}\n`;
            loclsTrack.removeSenders(peer);
          });
          peer.stop();
          peer.close();
          this.peers.delete(connection_id);
        }
        const candidates = this.earlyCandidates.get(connection_id);
        if (candidates) this.earlyCandidates.delete(connection_id);

        const conn = this.connections.get(connection_id);
        if (conn) this.connections.delete(connection_id);
      },
      () => {
        this.emit("removeremoteconnection", obj);
      },
    );
  }

  /**
   * @private
   * @param {NotifyConnectionUpdateMessage} e
   */
  onNotifyConnectionUpdate(e) {
    /** @type {UpdateRemoteConnectionObj} */
    let obj;
    this.withErr(
      61033,
      () => {
        const { connection_id, tags } = e;
        const meta = this.tagsToMeta(tags);
        obj = { connection_id, meta };
      },
      () => {
        this.emit("updateremoteconnection", obj);
      },
    );
  }

  /**
   *
   * @param {ConnectionID} peer_connection_id
   * @returns {Promise<Peer>}
   */
  async initP2PPeer(peer_connection_id) {
    const peer = new Peer(peer_connection_id, this.rtcConfiguration, this.logger);
    this.peers.set(peer_connection_id, peer);
    peer.on("track", this.onTrackP2P.bind(this, peer));
    peer.on("icecandidate", this.onIceCandidateP2P.bind(this, peer));
    peer.on("changestability", this.onChangeStability.bind(this));
    peer.on("trackconnected", this.onTrackConnected.bind(this));
    peer.on("trackdisconnected", this.onTrackDisconnected.bind(this));
    if (this.localLSTracks && this.localLSTracks.length !== 0) await peer.addTracks(this.localLSTracks);
    return peer;
  }

  /**
   * @private
   * @param {P2PRequestOfferMessage} e
   * @returns {Promise<void>}
   */
  async onP2PRequestOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onP2PRequestOffer (state!=open)");
      return;
    }
    await this.withErrAsync(61016, async () => {
      const { peer_connection_id } = e;
      if (this.userIceTransportPolicy) this.rtcConfiguration.iceTransportPolicy = this.userIceTransportPolicy;
      const peer = await this.initP2PPeer(peer_connection_id);

      this.initialReplaceMediaStreamTrack.forEach(async (v) => {
        await this.replaceLSTrack(v.mediaStreamTrack, v.localLSTrack);
      });
      this.localLSTracks.forEach(async (localLSTrack) => {
        await this.changeMuteState("unmute", localLSTrack.muteType, localLSTrack);
      });

      const offer = await peer.getOffer();
      this.ws?.sendMessage({
        message_type: "p2p.offer",
        peer_connection_id,
        sdp: offer,
      });

      this.apiReady = true;

      // このタイミングでないと設定できない
      for (const localLSTrack of this.localLSTracks) {
        if (this.initialFramerate) await localLSTrack.changeFramerate(this.initialFramerate);
      }
    });
  }

  /**
   * @private
   * @param {ConnectionID} peer_connection_id
   * @param {Peer} peer
   */
  setEarlyCandidate(peer_connection_id, peer) {
    const candidates = this.earlyCandidates.get(peer_connection_id);
    if (candidates) {
      candidates.forEach(async (candidate) => {
        await peer.setIceCandidate(candidate);
      });
      this.earlyCandidates.delete(peer_connection_id);
    }
  }

  /**
   * @private
   * @param {P2PRelayOfferMessage} e
   * @returns {Promise<void>}
   */
  async onP2PRelayOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onP2PRelayOffer (state!=open)");
      return;
    }
    await this.withErrAsync(61017, async () => {
      const { peer_connection_id, sdp } = e;
      if (this.userIceTransportPolicy) this.rtcConfiguration.iceTransportPolicy = this.userIceTransportPolicy;
      const peer = await this.initP2PPeer(peer_connection_id);

      this.initialReplaceMediaStreamTrack.forEach(async (v) => {
        await this.replaceLSTrack(v.mediaStreamTrack, v.localLSTrack);
      });
      this.localLSTracks.forEach(async (localLSTrack) => {
        await this.changeMuteState("unmute", localLSTrack.muteType, localLSTrack);
      });

      const answerSDP = await peer.createAnswerSDP(sdp);
      this.putLog("debug", `answer: ${JSON.stringify(answerSDP)}`);
      const answer = await peer.setAnswerSDP(answerSDP);
      this.ws?.sendMessage({
        message_type: "p2p.answer",
        peer_connection_id,
        sdp: answer,
      });

      // 先行到着していたcandidateがあればここで処理
      this.setEarlyCandidate(peer_connection_id, peer);

      this.apiReady = true;

      // このタイミングでないと設定できない
      for (const localLSTrack of this.localLSTracks) {
        if (this.initialFramerate) await localLSTrack.changeFramerate(this.initialFramerate);
      }
    });
  }

  /**
   * @private
   * @param {P2PRelayAnswerMessage} e
   * @return {Promise<void>}
   */
  async onP2PRelayAnswer(e) {
    await this.withErrAsync(61018, async () => {
      const { peer_connection_id, sdp } = e;
      const peer = this.peers.get(peer_connection_id);
      await peer?.setAnswer(sdp);
    });
  }

  /**
   * @private
   * @param {P2PRelayIcecandidateMessage} e
   * @return {Promise<void>}
   */
  async onP2PRelayIcecandidate(e) {
    await this.withErrAsync(61019, async () => {
      const { peer_connection_id, candidate } = e;
      if (candidate === null || candidate.candidate === "") return;
      const peer = this.peers.get(peer_connection_id);

      // 稀にこの時点でpeerがないケースがある。その場合保留しAnswer後に処理する
      if (peer) await peer.setIceCandidate(candidate);
      else {
        const candidates = this.earlyCandidates.get(peer_connection_id);
        if (candidates) candidates.push(candidate);
        else this.earlyCandidates.set(peer_connection_id, [candidate]);
      }
    });
  }

  /**
   * apiReady前に呼ばれたAPIに関するメッセージを送信する
   *
   * @private
   */
  async sendInitialMessages() {
    // track meta
    this.initialUpdateTrack.forEach(this.sendUpdateTrack.bind(this));

    // update_connect_options: sending.video.max_bitrate_kbps
    if (this.initialUpdateSendingVideoOption) this.sendUpdateSendingVideoOption(this.initialUpdateSendingVideoOption);

    // update_connect_options: sending.video.mute_type
    if (this.initialUpdateSendingVideoOptionMute) this.sendUpdateSendingVideoOption(this.initialUpdateSendingVideoOptionMute);

    // update_connect_options: receiving.enabled
    this.initialUpdateReceivingVideosOption.forEach((val, connection_id) => {
      const rtm = this.findRtm(connection_id);
      if (rtm) this.sendUpdateReceivingVideosOption({ videos: [{ track_id: rtm.track_id, enabled: val.enabled }] });
    });
  }

  /**
   * @private
   * @param {SFUOfferMessage} e
   * @return {Promise<void>}
   */
  async onSFUOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onSFUOffer (state!=open)");
      return;
    }
    await this.withErrAsync(61020, async () => {
      const { sdp } = e;
      this.rtcConfiguration.iceTransportPolicy = "relay";
      this.sfupc = new Peer("", this.rtcConfiguration, this.logger);
      this.sfupc.setRemoteTrackMetadata(e.remote_track_metadata);
      this.sfupc.on("track", this.onTrackSFU.bind(this, this.sfupc));
      this.sfupc.on("icecandidate", this.onIceCandidateSFU.bind(this));
      this.sfupc.on("changestability", this.onChangeStability.bind(this));
      this.sfupc.on("trackconnected", this.onTrackConnected.bind(this));
      this.sfupc.on("iceconnected", this.onIceConnected.bind(this));
      this.sfupc.on("trackdisconnected", this.onTrackDisconnected.bind(this));

      if (this.sendrecv !== "recvonly") {
        const local_track_metadata = await this.getLocalTrackMeta(e.local_track_slots);
        this.ws?.sendMessage({
          message_type: "sfu.pre_answer",
          local_track_metadata,
        });
      }

      this.initialReplaceMediaStreamTrack.forEach(async (v) => {
        await this.replaceLSTrack(v.mediaStreamTrack, v.localLSTrack);
      });

      const answerSDP = await this.sfupc.createAnswerSDP(sdp);
      this.putLog("debug", `answer: ${JSON.stringify(answerSDP)}`);
      const answer = await this.sfupc.setAnswerSDP(answerSDP);
      this.ws?.sendMessage({
        message_type: "sfu.answer",
        sdp: answer,
      });
      this.apiReady = true;

      // このタイミングでないと設定できない
      this.localLSTracks.forEach(async (localLSTrack) => {
        await this.changeMuteState("unmute", localLSTrack.muteType, localLSTrack);
        if (localLSTrack.mediaStreamTrack.kind === "video") this.sendUpdateSendingVideoOption({ video: { mute_type: localLSTrack.getMuteType() } });
      });
      for (const localLSTrack of this.localLSTracks) {
        if (this.initialFramerate) await localLSTrack.changeFramerate(this.initialFramerate);
      }
      await this.sendInitialMessages();
    });
  }

  /**
   * @private
   * @param {SFUUpdateOfferMessage} e
   * @return {Promise<void>}
   */
  async onSFUUpdateOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onSFUUpdateOffer (state!=open)");
      return;
    }
    await this.withErrAsync(61023, async () => {
      const { sdp } = e;
      if (this.sfupc && this.ws) {
        this.sfupc.setRemoteTrackMetadata(e.remote_track_metadata);
        const answerSDP = await this.sfupc.createAnswerSDP(sdp);
        this.putLog("debug", `answer: ${JSON.stringify(answerSDP)}`);
        const answer = await this.sfupc.setAnswerSDP(answerSDP);
        this.ws.sendMessage({
          message_type: "sfu.update_answer",
          sdp: answer,
        });
      }
    });
  }

  /**
   * @private
   * @param {SFURelayIcecandidateMessage} e
   * @return {Promise<void>}
   */
  async onSFURelayIcecandidate(e) {
    await this.withErrAsync(61024, async () => {
      const { candidate } = e;
      if (candidate === null || candidate.candidate === "") return;
      await this.sfupc?.setIceCandidate(candidate);
    });
  }

  /**
   * @private
   * @param {ConnectionID} connection_id
   * @param {MuteType} muteState
   * @param {Meta[]} meta
   * @param {TrackID} track_id
   * @returns {boolean}
   */
  storeReservedUpdate(connection_id, muteState, meta, track_id) {
    const conn = this.connections.get(connection_id);
    if (conn && conn.state !== "trackadded") {
      if (!conn.hasOwnProperty("reservedUpdate")) conn.reservedUpdate = {};
      const obj = {};
      if (Object.keys(meta).length) obj.meta = meta;
      if (muteState) obj.muteState = muteState;
      conn.reservedUpdate[track_id] = obj;

      this.connections.set(connection_id, conn);
      return true;
    }
    return false;
  }

  /**
   * @private
   * @param {NotifySFUTrackUpdateMessage} e
   */
  onNotifySFUTrackUpdate(e) {
    /** @type {UpdateRemoteTrackObj} */
    let objUpdateRemoteTrack;
    /** @type {UpdateMuteObj} */
    let objUpdateMute;
    /** @type {MuteType} */
    let muteState;
    /** @type {Meta[]} */
    let meta;
    let onTrackArrived = true;

    this.withErr(
      61034,
      () => {
        const { track_id, tags } = e;
        const rtm = this.sfupc?.remote_track_metadata.find((t) => t.track_id === track_id);
        if (!rtm) return;

        if (!rtm.track) onTrackArrived = false;

        meta = this.tagsToMeta(tags);
        objUpdateRemoteTrack = { connection_id: rtm.connection_id, mediaStreamTrack: rtm.track, stream: rtm.stream, meta };
        muteState = this.tagsToMute(tags);
        objUpdateMute = { connection_id: rtm.connection_id, mediaStreamTrack: rtm.track, stream: rtm.stream, mute: muteState };
        if (this.storeReservedUpdate(rtm.connection_id, muteState, meta, track_id)) return;
      },
      () => {
        if (Object.keys(meta).length && onTrackArrived) this.emit("updateremotetrack", objUpdateRemoteTrack);
        if (muteState && onTrackArrived) this.emit("updatemute", objUpdateMute);
      },
    );
  }

  /**
   * @private
   * @param {NotifySFUConnectionsUpdateMessage} e
   */
  onNotifySFUConnectionsUpdate(e) {
    /** @type {UpdateConnectionsStatusObj} */
    let objUpdateConnectionsStatus;
    this.withErr(
      61051,
      () => {
        const { connections_status } = e;
        objUpdateConnectionsStatus = { connections_status };
      },
      () => {
        this.emit("updateconnectionsstatus", objUpdateConnectionsStatus);
      },
    );
  }

  /**
   * @private
   * @param {PingMessage} e
   */
  onPing(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onPing (state!=open)");
      return;
    }
    this.withErr(61025, () => {
      this.ws?.sendMessage({ message_type: "pong" });
    });
  }

  /**
   * @private
   * @param {ErrorMessage} e
   */
  onError(e) {
    const { error_code } = e;
    this.putLog("wsevent", "sigerror: " + JSON.stringify(e));

    // TODO: remove this if server is modified
    if (e.reason === "room_state_unacceptable_message_type" && e.client_message_type === "sfu.update_track") {
      this.emitError(45005, "BadStateOnChangeMute", e);
      return;
    }
    const sigerr = this.getSignalingError(error_code);
    if (sigerr) {
      if (sigerr.err !== "") this.emitError(45000 + error_code, sigerr.err, e);
      else this.putLog("debug", `emit ignore: ${error_code} `);
    } else this.internalError(61045, e);
  }

  /**
   * @private
   * @param {DebugInfoMessage} e
   */
  onDebugInfo(e) {
    this.withErr(61035, () => {
      this.putLog("debug", JSON.stringify(e.debug_info));
    });
  }

  /**
   * @private
   * @param {number} now
   */
  checkOnTrackTimeout(now) {
    this.connections.forEach((conn, connection_id) => {
      if (conn.sendrecv === "recvonly") return;
      if (conn.state !== "joined") return;
      if (!conn.join) return;
      if (10 * 1000 < now - conn.join) {
        conn.state = "timeout";
        this.connections.set(connection_id, conn);
        this.putLog("debug", `OnTrackTimeout: ${connection_id}`);
      }
    });
  }

  /**
   * @private
   */
  monitor() {
    const now = new Date().getTime();
    let timeout = false;
    if (this.ws) timeout = 90 * 1000 < now - this.ws.lastReceived;
    if ((this.state === "open" || this.state === "connecting") && timeout) {
      this.emitError(54002, "SignalingTimeout", {});
      this.disconnect();
      return;
    }
    if (this.sendrecv === "sendonly") return;
    this.checkOnTrackTimeout(now);
  }

  /**
   * @private
   * @returns {boolean}
   */
  isSfuRoom() {
    return this.roomSpecType === "sfu" || this.roomSpecType === "sfu_large";
  }

  /**
   * @private
   * @param {number} code
   * @returns {{err: string}|undefined}
   */
  getParamError(code) {
    const errmap = new Map([
      //  [3200, {err: "client_id が入力にない"}], // 引数のため発生しない
      [3201, { err: "InvalidClientID" }], // "client_id が Server に存在しない
      //  [3202, {err: "access_token がない"}], // 引数のため発生しない
      //  [3203, {err: "tags が配列でない"}], /
      [3204, { err: "TooManyMeta" }], // tags 内に app_front の tag の数が規定数以上
      //  [3205, {err: "tags 内に sdk の tag の数が規定数以上"}],
      //  [3206, { err: "DuplicateMetaKey" }], // tags 内に同じ source と name の組の tag が存在"}],
      //  [3207, { err: "InvalidMetaType" }], // tags 要素(以下 tag)がオブジェクトでない"}],
      //  [3208, { err: "NotFoundMetaName" }], // tag に name がない"}],
      [3209, { err: "InvalidMetaName" }], //tag の name 形式違反"}],
      //  [3210, {err: "tag に source がない"}],
      //  [3211, {err: "tag の source 形式違反"}],
      //  [3212, {err: "tag に value がない"}],
      [3213, { err: "TooLongMetaValue" }], // tag の value を JSON にした際の長さが規定以上"}],
      //  [3214, {err: "tag の use_notification 形式違反"}],
      //  [3215, {err: "tag の use_analysis 形式違反"}],
      //  [3216, {err: "sdk_info 形式違反"}],
      //  [3217, {err: "sdk_info.platform 形式違反"}],
      //  [3218, {err: "sdk_info.version 形式違反"}],
      //  [3219, {err: "sdk_info の platform と version の組み合わせがobsoleteになっている"}],
      //  [3220, {err: "options 形式違反"}],
      //  [3221, {err: "options.sending 形式違反"}],
      //  [3222, {err: "options.sending.video 形式違反"}],
      [3223, { err: "InvalidVideoCodecOnConnect" }], // options.sending.video.codec 形式違反"}],
      [3224, { err: "InvalidVideoPriorityOnConnect" }], // options.sending.video.priority 形式違反
      [3225, { err: "InvalidVideoMaxBitrateKbpsOnConnect" }], // options.sending.video.max_bitrate_kbps 形式違反
      //  [3226, {err: "options.receiving 形式違反"}],
      //  [3227, {err: "options.receiving.enabled 形式違反"}],
      //  [3228, {err: "options.connecting 形式違反"}],
      [3229, { err: "InvalidConnectingTurnProtocols" }], // options.connecting.turn_protocols 形式違反
      //  [3230, { err: ""}], // options.sending.video.mute_type 形式違反
      //  [3231, { err: "" }], // options.sending.enabled 形式違反
      [3232, { err: "InvalidSendingReceivingEnabled" }], // options.sending.enabled と options.receiving.enabled の両方を false に指定した
      [3233, { err: "TooManySendingClients" }], // sending.enabled を設定された Client が規定数以上
      //  [3399, {err: "その他の connect 形式違反"}],
      [3400, { err: "InvalidAccessTokenNotJWT" }], //JWT でない"}],
      [3401, { err: "InvalidAccessTokenBadAlg" }], //alg が HS256 でない"}],
      [3402, { err: "InvalidAccessTokenBadSignature" }], //署名が有効でない"}],
      [3403, { err: "InvalidAccessTokenNoNbf" }], //nbf がない"}],
      [3404, { err: "InvalidAccessTokenBadNbf" }], //nbf 形式違反"}],
      [3405, { err: "InvalidAccessTokenBadNbfTime" }], //nbf 時刻違反 "}],
      [3406, { err: "InvalidAccessTokenNoExp" }], //exp がない"}],
      [3407, { err: "InvalidAccessTokenBadExp" }], //exp 形式違反"}],
      [3408, { err: "InvalidAccessTokenBatExpTime" }], //exp 時刻違反"}],
      [3409, { err: "InvalidAccessTokenNoConnectionID" }], //connection_id がない"}],
      [3410, { err: "InvalidAccessTokenBadConnectionID" }], //connection_id 形式違反"}],
      [3411, { err: "InvalidAccessTokenNoRoomID" }], //room_id がない"}],
      [3412, { err: "InvalidAccessTokenBadRoomID" }], //room_id 形式違反"}],
      [3413, { err: "InvalidAccessTokenBadVersion" }], //version 形式違反"}],
      //  [3414, { err: "InvalidAccessTokenBadMeta" }], //meta がオブジェクトでない"}],
      //  [3415, { err: "InvalidAccessTokenTooManyMeta" }], //meta の要素数が規定数以上"}],
      //  [3416, { err: "InvalidAccessTokenBadMetaKey" }], //meta に形式違反のキーが存在"}],
      //  [3417, { err: "InvalidAccessTokenBadMetaValue" }], //meta に形式違反のバリューが存在"}],
      [3418, { err: "InvalidAccessTokenNoRoomSpec" }], //room_spec がない"}],
      [3419, { err: "InvalidAccessTokenBadRoomSpec" }], //room_spec 形式違反"}],
      [3420, { err: "InvalidAccessTokenNoRoomSpecType" }], //room_spec.type がない"}],
      [3421, { err: "InvalidAccessTokenBadRoomSpecType" }], //room_spec.type 形式違反"}],
      [3422, { err: "InvalidAccessTokenBadRoomSpecMaxConnections" }], //room_spec.max_connections 形式違反"}],
      [3423, { err: "InvalidAccessTokenBadRoomSpecClassificationLabel" }], //room_spec.classification_label 形式違反"}],
      [3424, { err: "InvalidAccessTokenBadRoomSpecMediaControl" }], //room_spec.media_control 形式違反"}],
      [3425, { err: "InvalidAccessTokenBadRoomSpecMediaControlBitrateReservationMbps" }], //room_spec.media_control.bitrate_reservation_mbps 形式違反"}],
      [3426, { err: "InvalidAccessTokenExceedTimeLimitation" }], //exp - nbf <= 3600 に違反
      [3599, { err: "InvalidAccessToken" }], //その他のAccessToken形式違反"}],
      [3600, { err: "RoomSpecMissMatchOnConnect" }], // room_spec が room_instance 作成時の room_spec と一致しない"}],
      //  [3601, {err: "ConnectionLimitExceeded"}], // max_connection 数超過"}],
      // [3602, { err: "DuplicateConnectionIDOnConnect" }], // 欠番
      [3603, { err: "SameConnectionIDJoined" }], // room に同一 connection_id の接続が行われたため切断された
    ]);
    return errmap.get(code);
  }

  /**
   * @private
   * @param {number} code
   * @returns {{err: string}|undefined}
   */
  getSignalingError(code) {
    const errmap = new Map([
      //[0, { err: ""}], // Server がサポートしていない、または State で許可されていない message_type のメッセージを送信した
      [1, { err: "" }], // [InternalErrorとせずIgnore] P2PRoom で、指定された peer_connection_id が存在しない
      //[100, { err: ""}], // tags が配列でない
      //[101, { err: ""}], // tags 内に同じ source と name の組の tag が存在
      //[102, { err: ""}], // tags 要素(以下 tag)がオブジェクトでない
      //[103, { err: ""}], // tag に name がない
      [104, { err: "InvalidMetaNameOnUpdateConnection" }], // tag の name 形式違反
      //[105, { err: ""}], // tag に source がない
      //[106, { err: ""}], // tag の source 形式違反
      //[107, { err: ""}], // tag に value がない
      [108, { err: "TooLongMetaNameOnUpdateConnection" }], // tag の value を JSON にした際の長さが規定以上
      [109, { err: "NotFoundMetaOnUpdateConnection" }], // tag に対応する name と source が一致する LocalTag が存在していない
      //[199, { err: ""}], // 上記以外のエラー
      //[200, { err: ""}], // sdpがない
      //[201, { err: ""}], // sdp形式違反
      //[202, { err: ""}], // local_track_metadataが配列ではない
      //[203, { err: ""}], // local_track_metadata要素(以下ltm)がオブジェクトでない
      //[204, { err: ""}], // ltmにtrack_idがない
      //[205, { err: ""}], // ltmのtrack_id形式違反
      //[206, { err: ""}], // tags が配列でない
      //[207, { err: "TooManyMetaOnConnect" }], // tags 内に app_front の tag の数が規定数以上
      //[208, { err: ""}], // tags 内に sdk の tag の数が規定数以上
      //[209, { err: "DuplicateMetaOnConnect" }], // tags 内に同じ source と name の組の tag が存在
      //[210, { err: ""}], // tags 要素(以下 tag)がオブジェクトでない
      //[211, { err: ""}], // tag に name がない
      //[212, { err: ""}], // tag の name 形式違反
      //[213, { err: ""}], // tag に source がない
      //[214, { err: ""}], // tag の source 形式違反
      //[215, { err: ""}], // tag に value がない
      //[216, { err: "TooLongMetaValueOnConnect" }], // tag の value を JSON にした際の長さが規定以上
      //[217, { err: ""}], // tag の use_notification 形式違反
      //[218, { err: ""}], // tag の use_analysis 形式違反
      //[299, { err: ""}], // 上記以外のエラー
      //[300, { err: ""}], // candidateがない
      //[301, { err: ""}], // candidate形式違反
      //[399, { err: ""}], // 上記以外のエラー
      //[400, { err: ""}], // sdpがない
      //[401, { err: ""}], // sdp形式違反
      //[499, { err: ""}], // 上記以外のエラー
      //[500, { err: ""}], // track_idがない
      //[501, { err: ""}], // track_id形式違反
      //[502, { err: ""}], // track_idがLocalTrackに割り振られたtrack_idではない
      //[503, { err: ""}], // tags が配列でない
      //[504, { err: "DuplicateMetaOnUpdateTrackMeta" }], // tags 内に同じ source と name の組の tag が存在
      //[505, { err: ""}], // tags 要素(以下 tag)がオブジェクトでない
      //[506, { err: ""}], // tag に name がない
      //[507, { err: ""}], // tag の name 形式違反
      //[508, { err: ""}], // tag に source がない
      //[509, { err: ""}], // tag の source 形式違反
      //[510, { err: ""}], // tag に value がない
      [511, { err: "TooLongMetaValueOnUpdateTrackMeta" }], // tag の value を JSON にした際の長さが規定文字以上
      [512, { err: "NotFoundMetaOnUpdateTrackMeta" }], // tag に対応する name と source が一致する LocalTag が存在していない
      //[599, { err: ""}], // 上記以外のエラー
      //[600, { err: ""}], // local_track_metadata が配列ではない
      //[601, { err: ""}], // local_track_metadata 要素(以下 ltm)がオブジェクトでない
      //[602, { err: ""}], // ltm に track_id がない
      //[603, { err: ""}], // ltm の track_id 形式違反
      //[604, { err: ""}], // tags が配列でない
      [605, { err: "TooManyMetaOnConnect" }], // tags 内に app_front の tag の数が規定数以上
      //[606, { err: ""}], // tags 内に sdk の tag の数が規定数以上
      //[607, { err: ""}], // tags 内に同じ source と name の組の tag が存在
      //[608, { err: ""}], // tags 要素(以下 tag)がオブジェクトでない
      //[609, { err: ""}], // tag に name がない
      //[610, { err: ""}], // tag の name 形式違反
      //[611, { err: ""}], // tag に source がない
      //[612, { err: ""}], // tag の source 形式違反
      //[613, { err: ""}], // tag に value がない
      [614, { err: "TooLongMetaValueOnConnect" }], // tag の value を JSON にした際の長さが規定以上
      //[615, { err: ""}], // tag の use_notification 形式違反
      //[616, { err: ""}], // tag の use_analysis 形式違反
      //[617, { err: ""}], // pre_answerメッセージが複数回クライアントから送信された
      //[699, { err: ""}], // 上記以外のエラー
      //[700, { err: ""}], // track_id がない
      //[701, { err: ""}], // track_id 形式違反
      //[702, { err: ""}], // enabled の形式違反
      [703, { err: "" }], // [InternalErrorとせずIgnore] track_id が LocalTrack に割り振られた track_id ではない
      //[704, { err: ""}], // 送信専用クライアントが受信オプションを変更しようとした
      //[705, { err: ""}], // update_options.sending 形式違反
      //[706, { err: ""}], // update_options.sending.video 形式違反
      //[707, { err: ""}], // update_options.sending.video.max_bitrate_kbps 形式違反
      [708, { err: "OutOfRangeMaxBitrateKbpsOnChangeVideoSendBitrate" }], // update_options.sending.video.max_bitrate_kbps が設定可能範囲を超えている
      //[800, { err: ""}], // peer_connection_idがない
      //[801, { err: ""}], // sdpがない
      //[802, { err: ""}], // sdp形式違反
      //[803, { err: ""}], // p2psession_idがサーバが保持するp2psession_idと一致しない
      //[899, { err: ""}], // 上記以外のエラー
      //[900, { err: ""}], // peer_connection_idがない
      //[901, { err: ""}], // sdpがない
      //[902, { err: ""}], // sdp形式違反
      //[903, { err: ""}], // p2psession_idがサーバが保持するp2psession_idと一致しない
      //[999, { err: ""}], // 上記以外のエラー
      //[1000, { err: ""}], // peer_connection_idがない
      //[1001, { err: ""}], // candidateがない
      //[1002, { err: ""}], // candidate形式違反
      //[1003, { err: ""}], // p2psession_idがサーバが保持するp2psession_idと一致しない
      //[1099, { err: ""}], // 上記以外のエラー
    ]);
    return errmap.get(code);
  }

  /**
   * @private
   * @param {"state"|"wsevent"|"debug"} type
   * @param {string} msg
   */
  putLog(type, msg) {
    if (!this.logger) return;
    if (type === "state") this.stateTailHistory = this.logger.putLog("Client", "state", this.stateHeadHistory, this.stateTailHistory, msg);
    else if (type === "wsevent") this.wsEventTailHistory = this.logger.putLog("WebSocket", "event", this.wsEventHeadHistory, this.wsEventTailHistory, msg);
    else this.debugInfoTailHistory = this.logger.putLog("DebugInfo", "debugInfo", this.debugInfoHeadHistory, this.debugInfoTailHistory, msg);
  }
}

export { LSTrack };
export { Client };
export { SDKError };

export const testables = {
  ErrorData: ErrorData,
  LocalLSTrack: LocalLSTrack,
};
