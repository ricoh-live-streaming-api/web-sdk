"use strict";

import * as LSSDK from "../src/ricoh-ls-sdk.js";
import { Credentials } from "./credential.js";

const $ = document.querySelector.bind(document);
/*
 サンプルのためクライアントサイドに生成関数を記載していますが、
 AccessTokenはアプリバックエンドを用意して生成してください。
*/
export function accessToken(CLIENT_SECRET, room_spec) {
  const header = {
    alg: "HS256",
    cty: "JWT",
  };
  const now = Math.floor(Date.now() / 1000); // sec(epoch)
  const payload = {
    nbf: KJUR.jws.IntDate.get((now - 60 * 30).toString()),
    exp: KJUR.jws.IntDate.get((now + 60 * 30).toString()),
    connection_id: btoa(Math.random()).replace(/=/g, ""),
    room_id: "room1",
    room_spec: room_spec,
  };
  const accessToken = KJUR.jws.JWS.sign(null, header, payload, CLIENT_SECRET);
  return accessToken;
}

function addOption(dom, value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.text = text;
  dom.appendChild(option);
}

document.addEventListener("DOMContentLoaded", async (e) => {
  $("#start").disabled = false;

  const $audioSource = $("#audioSource");
  const $videoSource = $("#videoSource");
  await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const deviceInfos = await navigator.mediaDevices.enumerateDevices();
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const value = deviceInfo.deviceId;
    if (deviceInfo.kind === "audioinput" && $audioSource) {
      const text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      addOption($audioSource, value, text);
    } else if (deviceInfo.kind === "videoinput" && $videoSource) {
      const text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      addOption($videoSource, value, text);
    }
  }
});

let lsTracks = [];
let client = null;
let firstPeerID = "";
let firstPeerReq = "required";
let sendrate = 2000;
let fps = 1000;

function createClient() {
  const client = new LSSDK.Client();
  client.addEventListener("connecting", (e) => {
    console.log(`[${e.type}]`, client.getState());
  });
  client.addEventListener("open", (e) => {
    console.log(`[${e.type}]`, client.getState());
  });
  client.addEventListener("closing", (e) => {
    console.log(`[${e.type}]`, client.getState());
  });
  client.addEventListener("close", (e) => {
    console.log(`[${e.type}]`, client.getState());
  });
  client.addEventListener("addlocaltrack", (e) => {
    console.log(`[${e.type}]`, client.getState());
    const { stream, mediaStreamTrack } = e.detail;
    $("#localStream").srcObject = stream;
  });
  client.addEventListener("error", (e) => {
    console.table(e.detail);
    //      console.log(e.toReportString());
  });
  client.on("addremoteconnection", ({ connection_id, meta }) => {
    console.log(`add: ${connection_id}`);
    console.log(meta);

    if (firstPeerID === "") firstPeerID = connection_id;

    $("#chgconmeta").disabled = false;
    $("#chgtrackmeta").disabled = false;
    $("#chgtrack").disabled = false;
    $("#togglereq").disabled = false;
    $("#togglesendrate").disabled = false;
    $("#togglefps").disabled = false;
  });
  client.on("removeremoteconnection", ({ connection_id, meta, mediaStreamTrack }) => {
    console.log(`remove: ${connection_id}`);
    console.log(meta);
    console.log(mediaStreamTrack);
    let $video = $(`#${connection_id}`);
    if ($video !== null) {
      $("#remote-streams").removeChild($video);
    }
  });
  client.on("updateremoteconnection", ({ connection_id, meta }) => {
    console.log(`update: ${connection_id}`);
    console.log(meta);
  });
  client.on("updatemute", ({ connection_id, mediaStreamTrack, stream, mute }) => {
    console.log(`updatemute: ${connection_id} ${mediaStreamTrack.kind}`);
    console.log(mute);
  });
  client.on("changestability", ({ connection_id, stability }) => {
    console.log(`changestability: ${connection_id} ${stability}`);
  });
  client.on("addremotetrack", async ({ connection_id, mediaStreamTrack, stream, meta, mute }) => {
    console.log(connection_id, mediaStreamTrack, stream, meta, mute);
    let $video = $(`#${connection_id}`);
    if ($video === null) {
      $video = document.createElement("video");
      $video.id = connection_id;
      $("#remote-streams").appendChild($video);
    }

    if ($video.srcObject) {
      $video.srcObject.addTrack(mediaStreamTrack);
    } else {
      $video.srcObject = stream;
    }
    await $video.play();
  });
  client.on("updateremotetrack", ({ connection_id, mediaStreamTrack, stream, meta }) => {
    console.log(connection_id, mediaStreamTrack, stream, meta);
  });

  return client;
}

$("#stop").addEventListener("click", async (e) => {
  lsTracks.forEach((lsTrack) => {
    lsTrack.mediaStreamTrack.stop();
  });
  client.disconnect();
  $("#remote-streams").textContent = "";
  $("#localStream").srcObject = null;
  $("#start").disabled = false;
  $("#stop").disabled = true;
  firstPeerID = "";
  firstPeerReq = "required";
});

$("#start").addEventListener("click", async (e) => {
  let type = "p2p";
  if (window.location.search.match(/type=sfu/)) type = "sfu";
  else if (window.location.search.match(/type=p2p_turn/)) type = "p2p_turn";

  $("#type").innerText = type;

  const $audioSource = $("#audioSource");
  const $videoSource = $("#videoSource");
  const audioSource = $audioSource.value;
  const videoSource = $videoSource.value;

  const constraints = {
    video: { deviceId: videoSource ? { exact: videoSource } : undefined, width: 320, height: 240 },
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // const share = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const room_spec = {
    type,
    //    media_control: { bitrate_reservation_mbps: 10 },
  };
  const access_token = accessToken(Credentials.CLIENT_SECRET, room_spec);

  try {
    client = createClient();
    const connectOption = {
      sending: { video: { codec: "vp8", maxBitrateKbps: sendrate } },
      // iceServersProtocol: "tls",
      meta: { metaexample2: "connection_metadata" },
    };
    const sendrecv = $("input:checked[name=sendrecv]").value;
    if (sendrecv === "recvonly") {
      connectOption.sending.enabled = false;
    } else {
      lsTracks = stream.getTracks().map((mediaStreamTrack) => {
        const mute = mediaStreamTrack.kind === "audio" ? $("input:checked[name=amute]").value : $("input:checked[name=vmute]").value;
        return new LSSDK.LSTrack(mediaStreamTrack, stream, { meta: { metaexample: mediaStreamTrack.kind }, mute });
      });
      connectOption.localLSTracks = lsTracks;
      if (sendrecv === "sendonly") connectOption.receiving = { enabled: false };
    }

    if (Credentials.SIGNALING_URL) connectOption.signalingURL = Credentials.SIGNALING_URL;
    client.connect(Credentials.CLIENT_ID, access_token, connectOption);
  } catch (e) {
    console.log(e);
    // console.log(e.toReportString());
  }
  $("#start").disabled = true;
  $("#stop").disabled = false;
});

$("#chgconmeta").addEventListener("click", async (e) => {
  client.updateMeta({ metaexample2: "new_connection_metadata" });
});

$("#chgtrackmeta").addEventListener("click", async (e) => {
  client.updateTrackMeta(lsTracks[0], { metaexample: "new_track_metadata" });
});

$("#chgtrack").addEventListener("click", async (e) => {
  const audioSource = $("#audioSource").value;
  const videoSource = $("#videoSource").value;
  const constraints = {
    video: { deviceId: videoSource ? { exact: videoSource } : undefined, width: 320, height: 240 },
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const audio = stream.getAudioTracks()[0];
  const video = stream.getVideoTracks()[0];

  lsTracks.forEach(async (lsTrack) => {
    lsTrack.mediaStreamTrack.stop();
    if (lsTrack.mediaStreamTrack.kind === "audio") await client.replaceMediaStreamTrack(lsTrack, audio);
    else if (lsTrack.mediaStreamTrack.kind === "video") await client.replaceMediaStreamTrack(lsTrack, video);
    else return;
    $("#localStream").srcObject = stream;
  });
});

$("#togglereq").addEventListener("click", async (e) => {
  if (firstPeerID === "") {
    console.log("no peers");
    return;
  }
  firstPeerReq = firstPeerReq === "required" ? "unrequired" : "required";
  client.changeMediaRequirements(firstPeerID, firstPeerReq);
  console.log(`set new requirement ${firstPeerReq}`);
});

$("#togglesendrate").addEventListener("click", async (e) => {
  sendrate = sendrate === 2000 ? 500 : 2000;
  client.changeVideoSendBitrate(sendrate);
  console.log(`set new send bitrate ${sendrate}`);
});

$("#togglefps").addEventListener("click", async (e) => {
  const lsTrack = lsTracks.filter((lsTrack) => lsTrack.mediaStreamTrack.kind === "video")[0];
  fps = fps === 1000 ? 10 : 1000;
  client.changeVideoSendFramerate(fps);
  console.log(`set new fps ${fps}`);
});

$("#amute").addEventListener("change", async (e) => {
  const mute = $("input:checked[name=amute]").value;
  if ($("#start").disabled) {
    const lsTrack = lsTracks.filter((lsTrack) => lsTrack.mediaStreamTrack.kind === "audio")[0];
    client.changeMute(lsTrack, mute);
  }
});

$("#vmute").addEventListener("change", async (e) => {
  const mute = $("input:checked[name=vmute]").value;
  if ($("#start").disabled) {
    const lsTrack = lsTracks.filter((lsTrack) => lsTrack.mediaStreamTrack.kind === "video")[0];
    client.changeMute(lsTrack, mute);
  }
});

$("#dllog").addEventListener("click", (e) => {
  const result = client.getHeadReport() + client.getTailReport();
  const downLoadLink = document.createElement("a");
  downLoadLink.download = "log.txt";
  downLoadLink.href = URL.createObjectURL(new Blob([result], { type: "text.plain" }));
  downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
  downLoadLink.click();
});

$("#dlstatslog").addEventListener("click", (e) => {
  const result = client.getStatsReport();
  const downLoadLink = document.createElement("a");
  downLoadLink.download = "statslog.txt";
  downLoadLink.href = URL.createObjectURL(new Blob([result], { type: "text.plain" }));
  downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
  downLoadLink.click();
});

navigator.mediaDevices.addEventListener("devicechange", (e) => {
  console.log(e);
});
