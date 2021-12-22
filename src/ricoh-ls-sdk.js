/** @module ricoh-ls-sdk */
/** @typedef {String} ConnectionID */
/** @typedef {String} RoomSessionID */
/** @typedef {String} ClientID */
/** @typedef {String} JwtAccessToken */

/**
 * @typedef {Object} ConnectOption
 * @property {LSTrack[]} localLSTracks
 * @property {Object} meta
 * @property {string} signalingURL
 * @property {SendingOption} sending
 * @property {ReceivingOption} receiving
 * @property {"relay"|"all"} iceTransportPolicy
 * @property {"all"|"udp"|"tcp"|"tls"} iceServersProtocol
 */

/**
 * @typedef {Object} SendingVideoOption
 * @property {string} codec
 * @property {string} priority
 * @property {string} maxBitrateKbps
 */

/**
 * @typedef {Object} SendingOption
 * @property {SendingVideoOption} video
 */

/**
 * @typedef {Object} ReceivingOption
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} LSTrackOption
 * @property {Object} meta
 * @property {MuteType} mute
 */

/**
 * @typedef {Object} Log
 * @property {Date} dt
 * @property {String} log
 */

/**
 * @typedef {Object} LabeledLog
 * @property {String} target
 * @property {String} prop
 * @property {Date} dt
 * @property {String} log
 */

/**
 * @typedef {Object} LabeledHistory
 * @property {String} target
 * @property {String} prop
 * @property {Log[]} history
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
 * @typedef {"connecting" | "open" | "closing" | "close" | "error" | "addlocaltrack" | "addremotetrack" | "updateremotetrack" | "addremoteconnection" | "removeremoteconnection" | "updateremoteconnection" | "updatemute" | "changestability"} EventType
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
 * @typedef {"sendrecv" | "sendonly"} Role
 */

/**
 * Client の 送信モード
 *
 * @public
 * @typedef {"normal" | "priority"} SendingMode
 */

/**
 * Log出力 クラス
 *
 * @private
 */
class Logger {
  /**
   * @param {Object} option
   */
  constructor(option) {
    /**
     * @private
     * @type {Number}
     */
    this.headperiod = option.headperiod; // msec

    /**
     * @private
     * @type {Number}
     */
    this.tailperiod = option.tailperiod; // msec

    /**
     * @private
     * @type {Number}
     */
    this.starttime = new Date().getTime();
  }

  /**
   * 新規logをheads/tailsに追加し、古いlogを削除する
   *
   * @public
   * @param {Log[]|null} headHistory
   * @param {Log[]} tailHistory
   * @param {string} log
   * @returns {Log[]}
   */
  putLog(headHistory, tailHistory, log) {
    /**
     * @type {Log}
     */
    const entry = { dt: new Date(), log };

    /**
     * @type {Number}
     */
    const epoch = entry.dt.getTime();

    if (headHistory !== null) {
      if (epoch < this.starttime + this.headperiod) headHistory.push(entry);
    }
    tailHistory.push(entry);

    // 古いtailログの削除
    /**
     * @type {Number}
     */
    const len = tailHistory.length;
    /**
     * @type {Number}
     */
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
   * @param {String} id
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
   * Historyをmergeして出力
   *
   * @public
   * @returns {string}
   */
  dumpMerged() {
    /**
     * @type {LabeledLog[]}
     */
    let merged = [];
    this.labeledHistories.forEach((labeledHistory) => {
      merged = merged.concat(
        labeledHistory.history.map((log) => {
          return { target: labeledHistory.target, prop: labeledHistory.prop, dt: log.dt, log: log.log };
        }),
      );
    });
    merged.sort((a, b) => {
      if (a.dt < b.dt) return -1;
      if (a.dt > b.dt) return 1;
      return 0;
    });
    /**
     * @type {string}
     */
    let str = `${this.id}:\n`;
    merged.forEach((labeledLog) => {
      str += `[${labeledLog.dt.toISOString()}]\t${labeledLog.target}\t${labeledLog.prop}\t${labeledLog.log}\n`;
    });
    return str;
  }

  /**
   * historyを追加
   *
   * @public
   * @param {string} target
   * @param {string} prop
   * @param {Log[]} history
   */
  addHistory(target, prop, history) {
    this.labeledHistories.push({ target, prop, history });
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
   */
  constructor(connection_id, rtcConfiguration, logger) {
    super(rtcConfiguration);
    Object.setPrototypeOf(this, Peer.prototype);

    this.logger = logger;

    this.connectionStateLatest = "initial";
    this.connectionStateHeadHistory = [];
    this.connectionStateTailHistory = [];

    this.signalingStateLatest = "initial";
    this.signalingStateHeadHistory = [];
    this.signalingStateTailHistory = [];

    this.iceConnectionStateLatest = "initial";
    this.iceConnectionStateHeadHistory = [];
    this.iceConnectionStateTailHistory = [];

    this.iceGatheringStateLatest = "initial";
    this.iceGatheringStateHeadHistory = [];
    this.iceGatheringStateTailHistory = [];

    this.iceEventHeadHistory = [];
    this.iceEventTailHistory = [];

    this.statsHistory = [];

    this.iceInfo = [];

    /** @type {ConnectionID} */
    this.connection_id = connection_id;

    this.on("signalingstatechange", () => {
      this.signalingStateTailHistory = this.logger.putLog(this.signalingStateHeadHistory, this.signalingStateTailHistory, `${this.signalingState} <- ${this.signalingStateLatest}`);
      this.signalingStateLatest = this.signalingState;
    });
    this.on("iceconnectionstatechange", () => {
      this.iceConnectionStateTailHistory = this.logger.putLog(this.iceConnectionStateHeadHistory, this.iceConnectionStateTailHistory, `${this.iceConnectionState} <- ${this.iceConnectionStateLatest}`);
      this.iceConnectionStateLatest = this.iceConnectionState;
    });
    this.on("icegatheringstatechange", () => {
      this.iceGatheringStateTailHistory = this.logger.putLog(this.iceGatheringStateHeadHistory, this.iceGatheringStateTailHistory, `${this.iceGatheringState} <- ${this.iceGatheringStateLatest}`);
      this.iceGatheqingStateLatest = this.iceGatheringState;
    });
    this.on("connectionstatechange", () => {
      this.connectionStateTailHistory = this.logger.putLog(this.connectionStateHeadHistory, this.connectionStateTailHistory, `${this.connectionState} <- ${this.connectionStateLatest}`);
      this.connectionStateLatest = this.connectionState;
    });
    this.on("icecandidateerror", (e) => {
      this.iceEventTailHistory = this.logger.putLog(this.iceEventHeadHistory, this.iceEventTailHistory, `icecandidateerror(${e.errorCode}) ${e.errorText}`);
      if (e.errorCode !== 600 && e.errorCode !== 701) console.error(e);
    });

    /**
     * signalingstatechange で remoteDescription がセットされるまで待つための Promise
     *
     * @type {Promise}
     */
    this.remoteSDP = new Promise((done) => {
      const waitRemoteSDP = () => {
        if (!this.remoteDescription) return;
        this.removeEventListener("signalingstatechange", waitRemoteSDP);
        done();
      };
      this.addEventListener("signalingstatechange", waitRemoteSDP);
    });

    /** @type {Array<Object>} */
    this.remote_track_metadata = [];

    /** @type {number} */
    this.timerid = window.setInterval(this.monitor.bind(this), 2500);

    /** @type {"stable"|"unstable"} */
    this.stability = "stable";
  }

  /**
   * @public
   * @param {Array<Object>} remote_track_metadata
   */
  setRemoteTrackMetadata(remote_track_metadata) {
    if (!this.remote_track_metadata) {
      this.remote_track_metadata = remote_track_metadata;
      return;
    }
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
   * @param {Array<Object>} local_track_slots
   * @param {Array<LocalLSTrack>} loclsTracks
   */
  assignTrackIdToTrack(local_track_slots, loclsTracks) {
    /** @type {Object[]} */
    const videos = local_track_slots.filter((s) => s.kind === "video").map((s) => s.track_id);
    /** @type {Object[]} */
    const audios = local_track_slots.filter((s) => s.kind === "audio").map((s) => s.track_id);

    loclsTracks.forEach((loclsTrack) => {
      /** @type {String} */
      const track_id = loclsTrack.mediaStreamTrack.kind === "video" ? videos.shift() : audios.shift();
      if (track_id) loclsTrack.track_id = track_id;
    });
  }

  /**
   * local_track_metadataを作成する
   *
   * @public
   * @param {Array<Object>} local_track_slots
   * @param {Array<LocalLSTrack>} loclsTracks
   */
  makeLocalTrackMeta(local_track_slots, loclsTracks) {
    return local_track_slots.map((slot) => {
      /** @type {String} */
      const track_id = slot["track_id"];
      /** @type {Object} */
      const target = loclsTracks.find((loclsTrack) => loclsTrack.track_id === track_id);
      if (!target) return { track_id };
      /** @type {Object[]} */
      const tags = Object.entries(target.meta).map(([name, value]) => ({
        name,
        value,
        source: "app_front",
        use_notification: true,
      }));
      tags.push({
        name: "muteState",
        value: target.getMuteState(),
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
   * @param {String} eventName
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
   * @param {String} name
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
   * @param {MediaStreamTrack?}
   * @returns {Promise}
   */
  getConnectionStats(mediaStreamTrack) {
    const promise = mediaStreamTrack ? this.getStats(mediaStreamTrack) : this.getStats();
    return promise.then((report) => {
      // 空文字のconnection_idはないため偽であればsfu
      /** @type {String} */
      const connection_id = this.connection_id ? this.connection_id : "sfu";
      return { connection_id, report };
    });
  }

  /**
   * Offer を生成し適用してから返す
   *
   * @public
   * @param {RTCOfferOptions} [options={}]
   * @return {Promise<RTCSessionDescription>}
   */
  async getOffer(options) {
    await this.setLocalDescription(await super.createOffer(options));
    return new RTCSessionDescription(this.localDescription);
  }

  /**
   * 受信した Offer を適用し、 Answer を生成し適用してから返す
   *
   * @public
   * @param {RTCSessionDescription} offer
   * @param {RTCAnswerOptions} [options={}]
   * @return {Promise<RTCSessionDescription>}
   */
  async getAnswer(offer, options) {
    await this.setRemoteDescription(offer);
    await this.setLocalDescription(await super.createAnswer());
    return new RTCSessionDescription(this.localDescription);
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

  getIceInfo(stats) {
    const pairs = [];
    const localCandidates = {};
    stats.forEach((s) => {
      if (s.type === "candidate-pair") {
        const { id, localCandidateId, availableOutgoingBitrate, availableIncomingBitrate } = s;
        pairs.push({ id, localCandidateId, availableOutgoingBitrate, availableIncomingBitrate });
      } else if (s.type === "local-candidate") {
        const { networkType, protocol, relayProtocol, candidateType } = s;
        localCandidates[s.id] = { networkType, protocol, relayProtocol, candidateType };
      }
    });
    pairs.forEach((pair) => {
      const { networkType, protocol, relayProtocol, candidateType } = localCandidates[pair.localCandidateId];
      const { id, availableOutgoingBitrate, availableIncomingBitrate } = pair;
      this.iceInfo.push({ id, availableOutgoingBitrate, availableIncomingBitrate, networkType, protocol, relayProtocol, candidateType });
    });
  }

  /**
   * @private
   */
  async monitor() {
    const stats = await this.getStats();
    const statsArray = [];
    stats.forEach((s) => {
      statsArray.push(s);
    });
    this.statsHistory = this.logger.putLog(null, this.statsHistory, JSON.stringify(statsArray));

    this.getIceInfo(stats);

    if (this.connectionState === "connected" && this.stability === "unstable") {
      this.stability = "stable";
      this.emit("changestability", { connection_id: this.connection_id, stability: "icestable" });
    } else if (this.connectionState === "disconnected" && this.stability === "stable") {
      this.stability = "unstable";
      this.emit("changestability", { connection_id: this.connection_id, stability: "iceunstable" });
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
   * @param {String} url
   * @param {String | String[]} [protocol=[]]
   */
  constructor(url, logger, protocol) {
    super(url, protocol);
    Object.setPrototypeOf(this, WS.prototype);
    this.addEventListener("message", this.onMessage.bind(this));

    this.logger = logger;
    this.sendHeadHistory = [];
    this.sendTailHistory = [];
    this.recvHeadHistory = [];
    this.recvTailHistory = [];
  }

  /**
   * 受信したメッセージタイプに応じて CustomEvent を作り上げる
   *
   * @private
   * @param {any} e
   */
  onMessage(e) {
    this.recvTailHistory = this.logger.putLog(this.recvHeadHistory, this.recvTailHistory, e.data);

    /** @type {Object} */
    const message = JSON.parse(e.data);
    this.dispatchEvent(new CustomEvent("_" + message.message_type, { detail: message }));
  }

  /**
   * メッセージを JSON シリアライズして送信する
   *
   * @public
   * @param {Object} message
   */
  sendMessage(message) {
    const msg = JSON.stringify(message);
    super.send(msg);

    this.sendTailHistory = this.logger.putLog(this.sendHeadHistory, this.sendTailHistory, msg);
  }

  /**
   * addEventListener の wrapper
   * CustomEvent の場合だけ detail を listener に渡す
   * removeEventListener 出来ない点に注意
   *
   * @public
   * @param {String} eventName
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
     * @type {Object}
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
    /**
     * @public
     * @type {String}
     */
    this.track_id = "";
    this.muteType = lsTrack.muteType;
    this.mediaStreamTrack = lsTrack.mediaStreamTrack;
    this.senderMediaStreamTrack = lsTrack.mediaStreamTrack;
    this.meta = lsTrack.meta;
    this.stream = lsTrack.stream; // addTrack()以降使用してはいけない
    this.lsTrack = lsTrack; // appからのLocalLSTrack特定にのみ使用し、以降中身は参照しない
    this.senders = [];
  }

  getMuteState() {
    if (this.muteType === "softmute") return "blank";
    if (this.muteType === "hardmute") return "paused";
    return "on"; // unmute
  }

  addSenders(peer) {
    const senders = peer.getSenders().filter((sender) => {
      if (!sender || !sender.track || !sender.track.kind) return false;
      return sender.track.kind === this.mediaStreamTrack.kind;
    });
    this.senders = this.senders.concat(senders);
  }

  removeSenders(peer) {
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
   * @param {Number} code
   * @param {String} error
   * @param {any} detail
   */
  constructor(code, error, detail = null) {
    /**
     * @private
     * @type {Number}
     */
    this.code = code;

    /**
     * @public
     * @type {String}
     */
    this.error = error;

    /**
     * @private
     * @type {any}
     */
    this.detail = detail;

    /** @type {Number} */
    const category = Math.floor(code / 10000);

    /**
     * @private
     * @type {String}
     */
    this.type = "UnexpectedError";
    if (category === 4) this.type = "ParameterError";
    else if (category === 5) this.type = "NetworkError";

    /**
     * @private
     * @type {Number}
     */
    this.localtime = new Date().getTime();
  }

  /**
   * appに渡すエラーオブジェクトを取得する
   *
   * @public
   * @returns {Object}
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
   * @returns {String}
   */
  toReportString() {
    /** @type {String} */
    let report = `ricoh-ls-sdk error dump\n\
timestamp: ${this.localtime}\n\
error: ${this.type} (${this.code}) ${this.error}\n`;

    if (this.detail instanceof Error) report += "stack: " + this.detail.stack + "\n";

    /**
     * @param {Object} object
     * @param {Number} depth
     * @returns {Object|String}
     */
    function recursive_stringify(object, depth = 0) {
      if (depth > 2) return "Object";
      /** @type {Object} */
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
     * @type {String}
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
   * @returns {String}
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
   * @returns {String}
   */
  toReportString() {
    return this.errdata.toReportString();
  }
}

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
    /** @type Map<String, EventListenerWithOptions[]> */
    this.listeners = new Map();
  }

  /**
   * @param {String} type
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
   * @param {String} type
   * @param {EventListener} func
   * @param {EventListenerOptions} options
   */
  removeEventListener(type, func, options = {}) {
    const listeners = this.listeners.get(type) || [];
    const removed = listeners.filter(({ listener }) => listener !== func);
    this.listeners.set(type, removed);
  }
}

/**
 * SDK の中心となる Client クラス
 * このクラスを通してシグナリングやメディアの制御を行う
 *
 * @public
 * @class Client
 * @extends ET
 */
class Client extends ET {
  // TODO: Safari が EventTarget を継承できるようになったら直す

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
     * @type {RoomSessionID}
     */
    this.room_session_id = null;

    /**
     * @private
     * @type {LocalLSTrack[]}
     */
    this.localLSTracks = [];

    /**
     * @private
     * @type {WS}
     */
    this.ws = null;

    /**
     * @private
     * @type {Map<ConnectionID, Peer>}
     */
    this.peers = new Map();

    /**
     * @private
     * @type {ClientID}
     */
    this.client_id = null;

    /**
     * @private
     * @type {JwtAccessToken}
     */
    this.access_token = null;

    /**
     * @private
     * @type {Peer}
     */
    this.sfupc = null;

    /**
     * @private
     * @type {Object}
     */
    this.connectionMetadata = {};

    /**
     * @private
     * @type {boolean}
     */
    this.sendonly = false;

    /**
     * @private
     * @type {SendingOption}
     */
    this.sendingOption = null;

    /**
     * @private
     * @type {ReceivingOption}
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
     * @type {Logger}
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
     * @type {Map}
     */
    this.earlyCandidates = new Map();

    /**
     * @private
     * @type {Map}
     */
    this.connections = new Map();

    /**
     * @private
     * @type {"all"|"relay"|null}
     */
    this.userIceTransportPolicy = null;

    /**
     * @private
     * @type {"all"|"udp"|"tcp"|"tls"|null}
     */
    this.userIceServersProtocol = null;

    /**
     * @private
     * @type {number|null}
     */
    this.timerId = null;
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
   * dispachEvent の wrapper
   * CustomEvent を生成して dispatch する
   *
   * @private
   * @param {EventType} name
   * @param {any} [detail=null]
   */
  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  /**
   * emit SDKErrorEvent()
   *
   * @private
   * @param {Number} code
   * @param {String} err
   * @param {any} detail
   */
  emitError(code, err, detail) {
    this.dispatchEvent(new SDKErrorEvent(new ErrorData(code, err, detail)));
  }

  /**
   * internalError時の終了処理
   *
   * @private
   * @param {Number} code
   * @param {any} detail
   */
  internalError(code, detail) {
    this.disconnect();
    /** @type {String} */
    const err = "InternalError" + code.toString();
    this.emitError(code, err, detail);
  }

  /**
   * State を取得する
   *
   * @public
   * @returns {StateType}
   */
  getState() {
    try {
      return this.state;
    } catch (e) {
      this.internalError(61002, e);
    }
  }

  /**
   * Stats を取得する
   *
   * @public
   * @param {MediaStreamTrack?} mediaStreamTrack
   * @returns {Promise}
   */
  getStats(mediaStreamTrack) {
    try {
      /** @type {Object[]} */
      const promises = [];
      this.peers.forEach((peer) => promises.push(peer.getConnectionStats(mediaStreamTrack)));
      if (this.sfupc) promises.push(this.sfupc.getConnectionStats(mediaStreamTrack));

      return Promise.all(promises).then((arr) => {
        return arr.reduce((ret, stats) => {
          ret[stats.connection_id] = stats.report;
          return ret;
        }, {});
      });
    } catch (e) {
      this.internalError(61003, e);
    }
  }

  /**
   * 開始数分のログを取得する
   *
   * @public
   * @returns {string}
   */
  getHeadReport() {
    /** @type {Report} */
    const report = new Report("first 5 minutes log");
    report.addHistory("Client___", "state_____________", this.stateHeadHistory);
    report.addHistory("Websocket", "event_____________", this.wsEventHeadHistory);
    report.addHistory("Websocket", "recvMessage_______", this.ws.recvHeadHistory);
    report.addHistory("Websocket", "sendMessage_______", this.ws.sendHeadHistory);
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
    if (this.sfupc) {
      this.sfupc.iceInfo.forEach((info) => {
        this.putLog("debug", JSON.stringify(info));
      });
    }
    /** @type {Report} */
    const report = new Report("last 5 minutes log");
    report.addHistory("Client___", "state_____________", this.stateTailHistory);
    report.addHistory("Websocket", "event_____________", this.wsEventTailHistory);
    report.addHistory("Websocket", "recvMessage_______", this.ws.recvTailHistory);
    report.addHistory("Websocket", "sendMessage_______", this.ws.sendTailHistory);
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
    /** @type {Report} */
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
   * 渡された credential を用い Signaling Server に接続する
   *
   * @public
   * @param {ClientID} client_id
   * @param {JwtAccessToken} access_token
   * @param {ConnectOption} option
   */
  connect(client_id, access_token, option) {
    if (this.state !== "idle") throw new SDKError(new ErrorData(45000, "BadStateOnConnect"));
    if (!option.localLSTracks) throw new SDKError(new ErrorData(45004, "NeedLocalTracksOnConnect"));

    try {
      this.timerId = window.setInterval(this.monitor.bind(this), 2500);

      this.client_id = client_id;
      this.access_token = access_token;

      if (option.sending) this.sendingOption = option.sending;
      if (option.receiving) {
        this.receivingOption = option.receiving;
        if (this.receivingOption.hasOwnProperty("enabled") && this.receivingOption.enabled === false) {
          this.sendonly = true;
        }
      }

      this.peers = new Map();

      if (option.meta) this.connectionMetadata = option.meta;
      if (option.iceTransportPolicy) this.userIceTransportPolicy = option.iceTransportPolicy;
      if (option.iceServersProtocol !== undefined) this.userIceServersProtocol = option.iceServersProtocol;

      this.logger = new Logger({ headperiod: 5 * 60 * 1000, tailperiod: 5 * 60 * 1000 });
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
      this.ws.on("p2p.request_update_answer", this.onP2PRequestUpdateAnswer.bind(this));
      this.ws.on("p2p.relay_update_answer", this.onP2PRelayUpdateAnswer.bind(this));

      this.ws.on("sfu.offer", this.onSFUOffer.bind(this));
      this.ws.on("sfu.relay_icecandidate", this.onSFURelayIcecandidate.bind(this));
      this.ws.on("sfu.update_offer", this.onSFUUpdateOffer.bind(this));

      this.ws.on("notify.connection.connect", this.onNotifyConnectionConnect.bind(this));
      this.ws.on("notify.connection.leave", this.onNotifyConnectionLeave.bind(this));
      this.ws.on("notify.connection.update", this.onNotifyConnectionUpdate.bind(this));

      this.ws.on("notify.sfu.track.update", this.onNotifySFUTrackUpdate.bind(this));

      this.ws.on("ping", this.onPing.bind(this));
      this.ws.on("error", this.onError.bind(this));

      this.ws.on("debug_info", this.onDebugInfo.bind(this));
    } catch (e) {
      this.internalError(61004, e);
      return;
    }
    option.localLSTracks.forEach((loclsTrack) => {
      this.localLSTracks.push(new LocalLSTrack(loclsTrack));
      this.emit("addlocaltrack", { mediaStreamTrack: loclsTrack.mediaStreamTrack, stream: loclsTrack.stream });
    });
  }

  /**
   * 保持する PeerConnection と WebSocket を開放し
   * State を CLOSING に遷移
   *
   * @public
   */
  disconnect() {
    try {
      this.putLog("debug", "API Call: disconnect");
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
    } catch (e) {
      this.internalError(61005, e);
    }
  }

  /**
   * metaを更新する
   *
   * @public
   * @param {Object} meta
   */
  updateMeta(meta) {
    this.putLog("debug", "API Call: updateMeta");
    if (this.state !== "open") throw new SDKError(new ErrorData(45006, "BadStateOnUpdateMeta"));
    try {
      this.ws.sendMessage({
        message_type: "update_connection",
        tags: this.metaToTags(meta),
      });
    } catch (e) {
      this.internalError(61031, e);
    }
  }

  /**
   * LSTrackのmetaを更新する
   *
   * @public
   * @param {LSTrack} lsTrack
   * @param {Object} meta
   */
  updateTrackMeta(lsTrack, meta, src = "app_front") {
    this.putLog("debug", "API Call: updateTrackMeta");
    if (this.state !== "open") throw new SDKError(new ErrorData(45007, "BadStateOnUpdateTrackMeta"));
    if (!this.sfupc) throw new SDKError(new ErrorData(45002, "UnsupportedRoomSpecTypeOnUpdateTrackMeta"));

    /** @type {Object} */
    const target = this.localLSTracks.find((loclsTrack) => loclsTrack.lsTrack === lsTrack);
    if (!target) throw new SDKError(new ErrorData(45001, "TrackNotFoundOnUpdateTrackMeta"));

    try {
      this.ws.sendMessage({
        message_type: "sfu.update_track",
        track_id: target.track_id,
        tags: this.metaToTags(meta, src),
      });
    } catch (e) {
      this.internalError(61032, e);
    }
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
    const localLSTrack = this.localLSTracks.find((loclsTrack) => loclsTrack.lsTrack === lsTrack);
    if (!localLSTrack) throw new SDKError(new ErrorData(45009, "TrackNotFoundOnReplaceMediaStreamTrack"));

    try {
      await this.replaceLSTrack(mediaStreamTrack, localLSTrack);
    } catch (e) {
      this.internalError(61037, e);
    }
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
    if (this.state !== "open") throw new SDKError(new ErrorData(45005, "BadStateOnChangeMute"));
    /** @type {LocalLSTrack} */
    const localLSTrack = this.localLSTracks.find((loclsTrack) => loclsTrack.lsTrack === lsTrack);
    if (!localLSTrack) throw new SDKError(new ErrorData(45008, "TrackNotFoundOnChangeMute"));

    try {
      /** @type {MuteType} */
      const curMuteType = localLSTrack.muteType;
      if (curMuteType === nextMuteType) return; // do nothing
      await this.changeMuteState(curMuteType, nextMuteType, localLSTrack);

      const muteState = localLSTrack.getMuteState();
      if (this.sfupc) this.updateTrackMeta(lsTrack, { muteState }, "sdk");
    } catch (e) {
      this.internalError(61040, e);
    }
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
    if (this.state !== "open") throw new SDKError(new ErrorData(45010, "BadStateOnChangeMediaRequirements"));
    if (!this.sfupc) throw new SDKError(new ErrorData(45011, "UnsupportedRoomSpecTypeOnChangeMediaRequirements"));
    if (this.sendonly) throw new SDKError(new ErrorData(45013, "InvalidReceivingOptionOnChangeMediaRequirements"));
    const rtm = this.sfupc.remote_track_metadata.find((t) => t.connection_id === connection_id && t.kind === "video");
    if (!rtm) throw new SDKError(new ErrorData(45012, "ConnectionNotFoundOnChangeMediaRequirements"));

    try {
      /** @type {Object} */
      const message = {
        message_type: "sfu.update_connect_options",
        options: {
          receiving: {
            videos: [
              {
                track_id: rtm.track_id,
                enabled: videoRequirement === "required",
              },
            ],
          },
        },
      };
      this.ws.sendMessage(message);
    } catch (e) {
      this.internalError(61047, e);
    }
  }

  /**
   * @private
   */
  nextTrackOnReplaceTrack(curMuteType, nextMediaStreamTrack) {
    if (curMuteType === "unmute") return { nextMediaStreamTrack, trackEnabled: true };
    if (curMuteType === "softmute") return { nextMediaStreamTrack, trackEnabled: false };
    return { nextMediaStreamTrack: null, trackEnabled: false }; // hardmute
  }

  /**
   * @private
   */
  async replaceLSTrack(mediaStreamTrack, localLSTrack) {
    /** @type {{nextMediaStreamTrack: MediaStreamTrack, trackEnabled: boolean}}*/
    const { nextMediaStreamTrack, trackEnabled } = this.nextTrackOnReplaceTrack(localLSTrack.muteType, mediaStreamTrack);
    mediaStreamTrack.enabled = trackEnabled;
    await localLSTrack.replaceSenderTrack(nextMediaStreamTrack);
    localLSTrack.mediaStreamTrack = mediaStreamTrack;
  }

  /**
   * @private
   */
  nextTrackOnChangeMute(curMuteType, nextMuteType, curMediaStreamTrack) {
    if (nextMuteType === "unmute") return { nextMediaStreamTrack: curMediaStreamTrack, trackEnabled: true };
    if (nextMuteType === "softmute") return { nextMediaStreamTrack: curMediaStreamTrack, trackEnabled: false };
    return { nextMediaStreamTrack: null, trackEnabled: false }; // hardmute
  }

  /**
   * @private
   */
  async changeMuteState(curMuteType, nextMuteType, localLSTrack) {
    /** @type {{nextMediaStreamTrack: MediaStreamTrack, trackEnabled: boolean}} */
    const { nextMediaStreamTrack, trackEnabled } = this.nextTrackOnChangeMute(curMuteType, nextMuteType, localLSTrack.mediaStreamTrack);
    localLSTrack.mediaStreamTrack.enabled = trackEnabled;
    await localLSTrack.replaceSenderTrack(nextMediaStreamTrack);
    localLSTrack.muteType = nextMuteType;
  }

  /**
   * @private
   */
  tagsToMute(tags) {
    try {
      /** @type {Object} */
      const tag = tags.filter((tag) => tag.name === "muteState")[0];
      if (!tag) return null;
      /** @type {MuteType} */
      let muteType = "unmute";
      if (tag.value === "blank") muteType = "softmute";
      else if (tag.value === "paused") muteType = "hardmute";
      return muteType;
    } catch (e) {
      this.internalError(61039, e);
    }
  }

  /**
   * @private
   */
  tagsToMeta(tags) {
    try {
      return tags
        .filter((tag) => tag.source === "app_front")
        .reduce((ret, tag) => {
          ret[tag.name] = tag.value;
          return ret;
        }, {});
    } catch (e) {
      this.internalError(61008, e);
    }
  }

  /**
   * @private
   */
  metaToTags(meta, src = "app_front") {
    try {
      /** @type {Object[]} */
      const tags = [];
      Object.keys(meta).forEach((key) => {
        tags.push({
          name: key,
          value: meta[key],
          source: src,
          use_notification: true,
        });
      });
      return tags;
    } catch (e) {
      this.internalError(61009, e);
    }
  }

  /**
   * @private
   */
  async getLocalTrackMeta(local_track_slots) {
    try {
      if (!this.localLSTracks) return {};
      await this.sfupc.addTracks(this.localLSTracks);
      this.sfupc.assignTrackIdToTrack(local_track_slots, this.localLSTracks);
      return this.sfupc.makeLocalTrackMeta(local_track_slots, this.localLSTracks);
    } catch (e) {
      this.internalError(61036, e);
    }
  }

  /**
   * @private
   */
  setState(state, event = null) {
    try {
      this.putLog("state", `${state} <- ${this.state}`);
      this.state = state;
    } catch (e) {
      this.internalError(61001, e);
      return;
    }
    if (event) {
      if (event !== "error") this.emit(event);
    }
  }

  /**
   * @private
   */
  onTrackP2P(peer, e) {
    let obj = {};
    try {
      /** @type {{track: MediaStreamTrack, streams: MediaStream[]}} */
      const { track, streams } = e;
      /** @type {MediaStream} */
      const stream = streams[0];
      obj = { connection_id: peer.connection_id, mediaStreamTrack: track, stream };

      /** @type {Object} */
      const conn = this.connections.get(peer.connection_id);
      if (conn) {
        conn.state = "trackadded";
        this.connections.set(peer.connection_id, conn);
      }
    } catch (e) {
      this.internalError(61027, e);
      return;
    }
    this.emit("addremotetrack", obj);
  }

  /**
   * @private
   */
  async onTrackSFU(peer, e) {
    /** @type {Object} */
    let obj = {};
    /** @type {Object} */
    let conn = {};
    /** @type {Object} */
    let objRemoteTrack = {};
    /** @type {Object} */
    let objMute = {};
    try {
      /** @type {{track: MediaStreamTrack, streams: MediaStream[]}} */
      const { track, streams } = e;
      /** @type {String} */
      const msid = e.streams[0].id;
      /** @type {String} */
      const mid = e.transceiver.mid;
      /** @type {Object} */
      const meta = peer.remote_track_metadata.find((t) => t.msid === msid && t.mid === mid);
      if (!meta) return;
      /** @type {String} */
      const connection_id = meta.connection_id;

      /** @type {MediaStream} */
      const stream = streams[0];

      meta.track = track;
      meta.stream = stream;

      /** @type {Object} */
      const metadata = this.tagsToMeta(meta.tags);
      /** @type {MuteType} */
      const mute = this.tagsToMute(meta.tags);

      obj = { connection_id, mediaStreamTrack: track, stream, meta: metadata, mute };

      conn = this.connections.get(connection_id);
      if (conn) {
        conn.state = "trackadded";
        this.connections.set(connection_id, conn);

        if (conn.reservedUpdate && conn.reservedUpdate.hasOwnProperty(meta.track_id)) {
          const reserved = conn.reservedUpdate[meta.track_id];

          if (reserved.meta) obj.meta = reserved.meta;
          if (reserved.muteState) obj.mute = reserved.muteState;
        }
      }
    } catch (e) {
      this.internalError(61026, e);
      return;
    }
    this.emit("addremotetrack", obj);
  }

  /**
   * @private
   */
  onIceCandidateP2P(peer, e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onIceCandidateP2P (state!=open)");
      return;
    }
    try {
      if (e.candidate === null) return;
      this.ws.sendMessage({
        message_type: "p2p.icecandidate",
        peer_connection_id: peer.connection_id,
        candidate: e.candidate,
      });
    } catch (e) {
      this.internalError(61028, e);
    }
  }

  /**
   * @private
   */
  onIceCandidateSFU(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onIceCandidateSFU (state!=open)");
      return;
    }
    try {
      this.ws.sendMessage({
        message_type: "sfu.icecandidate",
        candidate: e.candidate,
      });
    } catch (e) {
      this.internalError(61030, e);
    }
  }

  /**
   * @private
   */
  onChangeStability(e) {
    const connection_id = e.connection_id === "" ? "sfu" : e.connection_id;
    this.emit("changestability", { connection_id, stability: e.stability });
  }

  /**
   * @private
   */
  makeConnectMessageOptions(send, recv, ice) {
    const options = {};
    if (send) {
      const sending = {};
      if (send.hasOwnProperty("video")) {
        const video = {};
        if (send.video.hasOwnProperty("codec")) video.codec = send.video.codec;
        if (send.video.hasOwnProperty("priority")) video.priority = send.video.priority;
        if (send.video.hasOwnProperty("maxBitrateKbps")) video.max_bitrate_kbps = send.video.maxBitrateKbps;
        sending.video = video;
      }
      options.sending = sending;
    }
    if (recv) {
      const receiving = {};
      if (recv.hasOwnProperty("enabled")) receiving.enabled = recv.enabled;
      options.receiving = receiving;
    }
    if (ice !== undefined && ice !== null) {
      const connecting = {};
      connecting.turn_protocols = ice === "all" ? ["udp", "tcp", "tls"] : [ice];
      options.connecting = connecting;
    }
    return options;
  }

  /**
   * @private
   */
  onWSOpen() {
    try {
      this.putLog("wsevent", "wsopen");
      /** @type {Object} */
      const connectMessage = {
        message_type: "connect",
        client_id: this.client_id,
        access_token: this.access_token,
        tags: this.metaToTags(this.connectionMetadata),
        sdk_info: { platform: "web", version: "1.2.0+20211109" },
        options: this.makeConnectMessageOptions(this.sendingOption, this.receivingOption, this.userIceServersProtocol),
      };
      this.ws.sendMessage(connectMessage);
    } catch (e) {
      this.internalError(61010, e);
    }
  }

  /**
   * @private
   */
  onWSError(e) {
    try {
      this.putLog("wsevent", "wserror: " + JSON.stringify(e));
      this.setState("closing", "error");
      this.emitError(50001, "WebSocketError", e);
      this.setState("closed", "close");
    } catch (e) {
      this.internalError(61011, e);
    }
  }

  /**
   * @private
   */
  onWSClose(e) {
    this.putLog("wsevent", `wsclose(${e.code}): ${e.reason}`);
    if (e.code === 1000) {
      // ws success code, do nothing
    } else if (e.code < 3000) {
      // ws error code
      /** @type {Number} */
      const code = 50000 + e.code;
      /** @type {String} */
      const err = "WebSocketBadClose" + code.toString();
      this.emitError(code, err, e);
    } else if (3000 <= e.code && e.code <= 3099) {
      // signaling success code, do nothing
    } else if (e.code === 3601) {
      this.emitError(53601, "ConnectionLimitExceeded", e);
    } else if (e.code === 3719) {
      this.emitError(53719, "ConnectionCreateTimeout", e);
    } else if (e.code === 3806) {
      this.emitError(53806, "ServerUnavailable", e);
    } else {
      // over 3100 exclude 3601,3719,3806
      const paramerr = this.getParamError(e.code);
      if (paramerr) this.emitError(40000 + e.code, paramerr.err, e);
      else this.internalError(61046, e);
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

    this.setState("closed", "close");
  }

  /**
   * @private
   */
  onConnectSuccess(e) {
    try {
      /** @type {{ ice_servers: RTCIceServer[], room_session_id: RoomSessionID }} */
      const { ice_servers, room_session_id } = e;
      this.rtcConfiguration.iceServers = ice_servers;
      this.room_session_id = room_session_id;
    } catch (e) {
      this.internalError(61013, e);
      return;
    }

    /** @type {number} */
    const now = new Date().getTime();
    e.connections.forEach((connection) => {
      /** @type {{connection_id: Object, tags: Object[]}} */
      const { connection_id, tags } = connection;
      /** @type {Object} */
      const meta = this.tagsToMeta(tags);
      this.emit("addremoteconnection", { connection_id, meta });

      this.connections.set(connection_id, { state: "joined", join: now });
    });
    this.setState("open", "open");
  }

  /**
   * @private
   */
  onNotifyConnectionConnect(e) {
    let obj = {};
    try {
      /** @type {{connection: Object}} */
      const { connection } = e;
      /** @type {{connection_id: Object, tags: Object[]}} */
      const { connection_id, tags } = connection;
      /** @type {Object} */
      const meta = this.tagsToMeta(tags);
      obj = { connection_id, meta };

      this.connections.set(connection_id, { state: "joined", join: new Date().getTime() });
    } catch (e) {
      this.internalError(61014, e);
      return;
    }
    this.emit("addremoteconnection", obj);
  }

  /**
   * @private
   */
  onNotifyConnectionLeave(e) {
    let obj = {};
    try {
      /** @type {{connection: Object}} */
      const { connection } = e;
      /** @type {{connection_id: Object, tags: Object[]}} */
      const { connection_id, tags } = connection;
      /** @type {Object} */
      const meta = this.tagsToMeta(tags);
      if (this.sfupc) {
        const mediaStreamTracks = this.sfupc.remote_track_metadata.map((meta) => meta.track);
        obj = { connection_id, meta, mediaStreamTracks };
      } else {
        obj = { connection_id, meta };
      }
      /** @type {Peer} */
      const peer = this.peers.get(connection_id);
      if (peer) {
        this.localLSTracks.forEach((loclsTrack) => loclsTrack.removeSenders(peer));
        peer.stop();
        peer.close();
        this.peers.delete(connection_id);
      }
      /** @type {Object} */
      const candidates = this.earlyCandidates.get(connection_id);
      if (candidates) this.earlyCandidates.delete(connection_id);

      /** @type {Object} */
      const conn = this.connections.get(connection_id);
      if (conn) this.connections.delete(connection_id);
    } catch (e) {
      this.internalError(61015, e);
      return;
    }
    this.emit("removeremoteconnection", obj);
  }

  /**
   * @private
   */
  onNotifyConnectionUpdate(e) {
    let obj = {};
    try {
      /** @type {{connection_id: Object, tags: Object[]}} */
      const { connection_id, tags } = e;
      /** @type {Object} */
      const meta = this.tagsToMeta(tags);
      obj = { connection_id, meta };
    } catch (e) {
      this.internalError(61033, e);
      return;
    }
    this.emit("updateremoteconnection", obj);
  }

  /**
   * @private
   */
  async onP2PRequestOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onP2PRequestOffer (state!=open)");
      return;
    }
    try {
      /** @type {{ peer_connection_id: ConnectionID }} */
      const { peer_connection_id } = e;
      if (this.userIceTransportPolicy) this.rtcConfiguration.iceTransportPolicy = this.userIceTransportPolicy;
      /** @type {Peer} */
      const peer = new Peer(peer_connection_id, this.rtcConfiguration, this.logger);
      this.peers.set(peer_connection_id, peer);
      peer.on("track", this.onTrackP2P.bind(this, peer));
      peer.on("icecandidate", this.onIceCandidateP2P.bind(this, peer));
      peer.on("changestability", this.onChangeStability.bind(this));
      if (this.localLSTracks) await peer.addTracks(this.localLSTracks);

      this.localLSTracks.forEach(async (localLSTrack) => {
        await this.changeMuteState("unmute", localLSTrack.muteType, localLSTrack);
      });

      /** @type {RTCSessionDescription} */
      const offer = await peer.getOffer();
      this.ws.sendMessage({
        message_type: "p2p.offer",
        peer_connection_id,
        sdp: offer,
      });
    } catch (e) {
      this.internalError(61016, e);
    }
  }

  /**
   * @private
   */
  async onP2PRelayOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onP2PRelayOffer (state!=open)");
      return;
    }
    try {
      /** @type {{peer_connection_id: ConnectionID, sdp: RTCSessionDescription }} */
      const { peer_connection_id, sdp } = e;
      if (this.userIceTransportPolicy) this.rtcConfiguration.iceTransportPolicy = this.userIceTransportPolicy;
      /** @type {Peer} */
      const peer = new Peer(peer_connection_id, this.rtcConfiguration, this.logger);
      this.peers.set(peer_connection_id, peer);
      peer.on("track", this.onTrackP2P.bind(this, peer));
      peer.on("icecandidate", this.onIceCandidateP2P.bind(this, peer));
      peer.on("changestability", this.onChangeStability.bind(this));
      if (this.localLSTracks) await peer.addTracks(this.localLSTracks);

      this.localLSTracks.forEach(async (localLSTrack) => {
        await this.changeMuteState("unmute", localLSTrack.muteType, localLSTrack);
      });

      /** @type {RTCSessionDescription} */
      const answer = await peer.getAnswer(sdp);
      this.ws.sendMessage({
        message_type: "p2p.answer",
        peer_connection_id,
        sdp: answer,
      });

      // 先行到着していたcandidateがあればここで処理
      const candidates = this.earlyCandidates.get(peer_connection_id);
      if (candidates) {
        candidates.forEach(async (candidate) => {
          await peer.setIceCandidate(candidate);
        });
        this.earlyCandidates.delete(peer_connection_id);
      }
    } catch (e) {
      this.internalError(61017, e);
    }
  }

  /**
   * @private
   */
  async onP2PRelayAnswer(e) {
    try {
      /** @type {{ peer_connection_id: ConnectionID, sdp: RTCSessionDescription }} */
      const { peer_connection_id, sdp } = e;
      /** @type {Peer} */
      const peer = this.peers.get(peer_connection_id);
      await peer.setAnswer(sdp);
    } catch (e) {
      this.internalError(61018, e);
    }
  }

  /**
   * @private
   */
  async onP2PRelayIcecandidate(e) {
    try {
      /** @type {{ peer_connection_id: ConnectionID, candidate: RTCIceCandidate }} */
      const { peer_connection_id, candidate } = e;
      if (candidate === null || candidate.candidate === "") return;
      /** @type {Peer} */
      const peer = this.peers.get(peer_connection_id);

      // 稀にこの時点でpeerがないケースがある。その場合保留しAnswer後に処理する
      if (peer) await peer.setIceCandidate(candidate);
      else {
        const candidates = this.earlyCandidates.get(peer_connection_id);
        if (candidates) candidates.push(candidate);
        else this.earlyCandidates.set(peer_connection_id, [candidate]);
      }
    } catch (e) {
      this.internalError(61019, e);
    }
  }

  /**
   * @private
   */
  onP2PRequestUpdateAnswer(e) {
    try {
      console.debug(e);
    } catch (e) {
      this.internalError(61021, e);
    }
  }

  /**
   * @private
   */
  onP2PRelayUpdateAnswer(e) {
    try {
      console.debug(e);
    } catch (e) {
      this.internalError(61022, e);
    }
  }

  /**
   * @private
   */
  async onSFUOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onSFUOffer (state!=open)");
      return;
    }
    try {
      /** @type {{sdp: RTCSessionDescription }} */
      const { sdp } = e;
      this.rtcConfiguration.iceTransportPolicy = "relay";
      this.sfupc = new Peer("", this.rtcConfiguration, this.logger);
      this.sfupc.setRemoteTrackMetadata(e.remote_track_metadata);
      this.sfupc.on("track", this.onTrackSFU.bind(this, this.sfupc));
      this.sfupc.on("icecandidate", this.onIceCandidateSFU.bind(this));
      this.sfupc.on("changestability", this.onChangeStability.bind(this));

      /** @type {Object} */
      const local_track_metadata = await this.getLocalTrackMeta(e.local_track_slots);
      this.ws.sendMessage({
        message_type: "sfu.pre_answer",
        local_track_metadata,
      });

      this.localLSTracks.forEach(async (localLSTrack) => {
        await this.changeMuteState("unmute", localLSTrack.muteType, localLSTrack);
      });

      /** @type {RTCSessionDescription} */
      const answer = await this.sfupc.getAnswer(sdp);
      this.ws.sendMessage({
        message_type: "sfu.answer",
        sdp: answer,
      });
    } catch (e) {
      this.internalError(61020, e);
    }
  }

  /**
   * @private
   */
  async onSFUUpdateOffer(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onSFUUpdateOffer (state!=open)");
      return;
    }
    try {
      /** @type {{peer_connection_id: ConnectionID, sdp: RTCSessionDescription }} */
      const { sdp } = e;

      this.sfupc.setRemoteTrackMetadata(e.remote_track_metadata);

      /** @type {RTCSessionDescription} */
      const answer = await this.sfupc.getAnswer(sdp);
      this.ws.sendMessage({
        message_type: "sfu.update_answer",
        sdp: answer,
      });
    } catch (e) {
      this.internalError(61023, e);
    }
  }

  /**
   * @private
   */
  async onSFURelayIcecandidate(e) {
    try {
      /** @type {{ candidate: RTCIceCandidate }} */
      const { candidate } = e;
      if (candidate === null || candidate.candidate === "") return;
      await this.sfupc.setIceCandidate(candidate);
    } catch (e) {
      this.internalError(61024, e);
    }
  }

  /**
   * @private
   */
  onNotifySFUTrackUpdate(e) {
    let objRemoteTrack = {};
    let objMute = {};
    let muteState;
    let meta;

    try {
      /** @type {{track_id: String, tags: Object[]}} */
      const { track_id, tags } = e;
      /** @type {Object} */
      const rtm = this.sfupc.remote_track_metadata.find((t) => t.track_id === track_id);
      if (!rtm) return;

      /** @type {Object} */
      meta = this.tagsToMeta(tags);
      objRemoteTrack = { connection_id: rtm.connection_id, mediaStreamTrack: rtm.track, stream: rtm.stream, meta };
      muteState = this.tagsToMute(tags);
      objMute = { connection_id: rtm.connection_id, mediaStreamTrack: rtm.track, stream: rtm.stream, mute: muteState };

      const conn = this.connections.get(rtm.connection_id);
      if (conn && conn.state !== "trackadded") {
        if (!conn.hasOwnProperty("reservedUpdate")) conn.reservedUpdate = {};
        /** @type {Object} */
        const obj = {};
        if (Object.keys(meta).length) obj.meta = meta;
        if (muteState) obj.muteState = muteState;
        conn.reservedUpdate[track_id] = obj;

        this.connections.set(rtm.connection_id, conn);
        return;
      }
    } catch (e) {
      this.internalError(61034, e);
      return;
    }
    if (Object.keys(meta).length) this.emit("updateremotetrack", objRemoteTrack);
    if (muteState) this.emit("updatemute", objMute);
  }

  /**
   * @private
   */
  onPing(e) {
    if (this.state !== "open") {
      this.putLog("debug", "return onPing (state!=open)");
      return;
    }
    try {
      this.ws.sendMessage({ message_type: "pong" });
    } catch (e) {
      this.internalError(61025, e);
    }
  }

  /**
   * @private
   */
  onError(e) {
    /** @type {{error_code: Number}} */
    const { error_code } = e;
    this.putLog("wsevent", "sigerror: " + JSON.stringify(e));

    // TODO: remove this if server is modified
    if (e.reason === "room_state_unacceptable_message_type" && e.client_message_type === "sfu.update_track") {
      this.emitError(45005, "BadStateOnChangeMute", e);
      return;
    }
    const sigerr = this.getSignalingError(error_code);
    if (sigerr) this.emitError(45000 + error_code, sigerr.err, e);
    else this.internalError(61045, e);
  }

  /**
   * @private
   */
  onDebugInfo(e) {
    try {
      const { debug_info } = e;
      this.putLog("debug", JSON.stringify(debug_info));
    } catch (e) {
      this.internalError(61035, e);
    }
  }

  /**
   * @private
   */
  monitor() {
    if (this.sendonly) return;
    /** @type {number} */
    const now = new Date().getTime();
    this.connections.forEach((conn, connection_id) => {
      if (conn.state !== "joined") return;
      if (!conn.join) return;
      if (10 * 1000 < now - conn.join) {
        conn.state = "timeout";
        this.connections.set(connection_id, conn);
        this.emitError(54000, "OnTrackTimeout", { connection_id });
      }
    });
  }

  /**
   * @private
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
      [3225, { err: "InvalidVideoMaxBitrateKBPSOnConnect" }], // options.sending.video.max_bitrate_kbps 形式違反
      //  [3226, {err: "options.receiving 形式違反"}],
      //  [3227, {err: "options.receiving.enabled 形式違反"}],
      //  [3228, {err: "options.connecting 形式違反"}],
      [3229, { err: "InvalidConnectingTurnProtocols" }], // options.connecting.turn_protocols 形式違反
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
      [3425, { err: "InvalidAccessTokenBadRoomSpecMediaControlBitrateReservationMBPS" }], //room_spec.media_control.bitrate_reservation_mbps 形式違反"}],
      [3426, { err: "InvalidAccessTokenExceedTimeLimitation" }], //exp - nbf <= 3600 に違反
      [3599, { err: "InvalidAccessToken" }], //その他のAccessToken形式違反"}],
      [3600, { err: "RoomSpecMissMatchOnConnect" }], // room_spec が room_instance 作成時の room_spec と一致しない"}],
      //  [3601, {err: "ConnectionLimitExceeded"}], // max_connection 数超過"}],
      [3602, { err: "DuplicateConnectionIDOnConnect" }], // 既に join 済みの connection_id で join"}],
    ]);
    return errmap.get(code);
  }

  /**
   * @private
   */
  getSignalingError(code) {
    const errmap = new Map([
      //[0, { err: ""}], // Server がサポートしていない、または State で許可されていない message_type のメッセージを送信した
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
   */
  putLog(type, msg) {
    if (!this.logger) return;
    if (type === "state") this.stateTailHistory = this.logger.putLog(this.stateHeadHistory, this.stateTailHistory, msg);
    else if (type === "wsevent") this.wsEventTailHistory = this.logger.putLog(this.wsEventHeadHistory, this.wsEventTailHistory, msg);
    else this.debugInfoTailHistory = this.logger.putLog(this.debugInfoHeadHistory, this.debugInfoTailHistory, msg);
  }
}

export { LSTrack };
export { Client };

export const testables = {
  ErrorData: ErrorData,
  LocalLSTrack: LocalLSTrack,
};
