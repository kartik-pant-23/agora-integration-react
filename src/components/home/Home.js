import React from "react";

import Header from "./components/header";

export default function Home({ channelId, onLeaveChannel }) {
  return (
    <div
      className="d-flex flex-column bg-light"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Header
        channelId={channelId}
        audio={true}
        video={true}
        onAudioEnable={() => {}}
        onVideoEnable={() => {}}
        onLeaveChannel={onLeaveChannel}
      />
      <div className="px-4 pt-2 pb-4 row g-0" style={{ flex: 1 }}>
        <div className="col-md-10 p-2 bg-white rounded"></div>
        <div className="col-md-2 p-2 bg-light"></div>
      </div>
    </div>
  );
}
