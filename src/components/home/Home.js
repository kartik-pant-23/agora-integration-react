import React, { useCallback, useEffect } from "react";
import _map from "lodash.map";

import { useAgoraClient } from "../../hooks/useAgoraClient";
import Header from "./components/header";
import VideoPanel from "./components/videoPanel";

export default function Home({ channelId, onLeaveChannel }) {
  const onAgoraFailure = useCallback((error) => {
    console.log(error);
  }, []);

  const [users, tracks, audio, video, screenShare, leaveChannel] =
    useAgoraClient({
      channelId,
      onFailure: onAgoraFailure,
    });

  useEffect(() => {
    const handleStopScreenSharingFromBrowser = () => {
      screenShare.setState(false);
    };
    window.addEventListener(
      "screen-sharing-stop",
      handleStopScreenSharingFromBrowser
    );
    return () => {
      window.removeEventListener(
        "screen-sharing-stop",
        handleStopScreenSharingFromBrowser
      );
    };
  });

  const handleLeaveChannel = useCallback(async () => {
    await leaveChannel();
    onLeaveChannel();
  }, [leaveChannel, onLeaveChannel]);

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Header
        channelId={channelId}
        audio={audio.state}
        video={video.state}
        screenSharing={screenShare.state}
        onAudioEnable={audio.setState}
        onVideoEnable={video.setState}
        onScreenSharingEnable={screenShare.setState}
        onLeaveChannel={handleLeaveChannel}
      />
      <div className="row m-0" style={{ flex: 1 }}>
        <div className="col-md-9 p-2 d-flex bg-light">
          <div
            className="p-2 my-auto d-flex"
            style={{ height: "75vh", overflow: "auto" }}
          >
            {users &&
              _map(users, (user) => (
                <VideoPanel videoTrack={user.videoTrack} userId={user.uid} />
              ))}
          </div>
        </div>
        <div className="col-md-3 p-2">
          {tracks && <VideoPanel videoTrack={tracks[1]} userId="You" />}
        </div>
      </div>
      {/* <div className="row g-0" style={{ flex: 1 }}>
        <div
          className="col-md-9 p-4 bg-white rounded"
          style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)" }}
        >
          {users &&
            _map(users, (user) => (
              <VideoPanel videoTrack={user.videoTrack} userId={user.uid} />
            ))}
        </div>
        <div className="col-md-3 p-4 bg-light">
          {tracks && <VideoPanel videoTrack={tracks[1]} userId="You" />}
        </div>
      </div> */}
    </div>
  );
}
