import React, { useCallback, useState } from "react";
import _map from "lodash.map";

import useAgoraClient from "../../hooks/useAgoraClient";
import Header from "./components/header";
import VideoPanel from "./components/videoPanel";

export default function Home({ channelId, onLeaveChannel }) {
  const onAgoraFailure = useCallback((error) => {
    console.log(error);
  }, []);

  const [client, users, tracks] = useAgoraClient({
    channelId,
    onFailure: onAgoraFailure,
  });

  const [audioState, setAudioState] = useState(true);
  const handleAudioEnable = useCallback(
    async (enabled) => {
      if (tracks) {
        await tracks[0]?.setEnabled(enabled);
        setAudioState(enabled);
      }
    },
    [tracks]
  );

  const [videoState, setVideoState] = useState(true);
  const handleVideoEnable = useCallback(
    async (enabled) => {
      if (tracks) {
        await tracks[1]?.setEnabled(enabled);
        setVideoState(enabled);
      }
    },
    [tracks]
  );

  const handleLeaveChannel = useCallback(async () => {
    await client.leave();
    client.removeAllListeners();
    if (tracks) {
      tracks.forEach((track) => track.close());
    }
    onLeaveChannel();
  }, [client, tracks, onLeaveChannel]);

  return (
    <div
      className="d-flex flex-column bg-light"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Header
        channelId={channelId}
        audio={audioState}
        video={videoState}
        onAudioEnable={handleAudioEnable}
        onVideoEnable={handleVideoEnable}
        onLeaveChannel={handleLeaveChannel}
      />
      <div className="row g-0" style={{ flex: 1 }}>
        <div
          className="col-md-9 p-4 bg-white rounded"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {users &&
            _map(users, (user) => (
              <VideoPanel videoTrack={user.videoTrack} userId={user.uid} />
            ))}
        </div>
        <div className="col-md-3 p-4 bg-light">
          {tracks && <VideoPanel videoTrack={tracks[1]} userId="You" />}
        </div>
      </div>
    </div>
  );
}
